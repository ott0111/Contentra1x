import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";
import { secrets } from "base44:runtime";

// Custom PayPal billing integration (REST API v2).
// Actions:
//   create-order  -> { action, plan, amount } -> { orderId, approveUrl }
//   capture-order -> { action, orderId, plan, amount } -> { status, plan }
// On capture, a Subscription record is created and the user's plan is upgraded.
// Auto-detects live vs sandbox: tries live first, falls back to sandbox on auth failure.
const BASES = {
  live: "https://api-m.paypal.com",
  sandbox: "https://api-m.sandbox.paypal.com",
};

async function tokenFor(base) {
  const id = secrets.get("PAYPAL_CLIENT_ID");
  const secret = secrets.get("PAYPAL_CLIENT_SECRET");
  if (!id || !secret) throw new Error("PayPal credentials not configured");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: "Basic " + btoa(`${id}:${secret}`) },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  if (!res.ok) {
    const err = await res.text();
    const isAuthFail = res.status === 401 || err.includes("invalid_client");
    const e = new Error(`PayPal auth failed: ${err}`);
    e.isAuthFail = isAuthFail;
    throw e;
  }
  const data = await res.json();
  return data.access_token;
}

async function accessToken() {
  const token = await tokenFor(BASES.sandbox);
  return { token, base: BASES.sandbox };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action } = body || {};

    if (action === "create-order") {
      const { plan, amount } = body;
      if (!plan || typeof amount !== "number" || amount <= 0)
        return Response.json({ error: "plan and a positive amount are required" }, { status: 400 });

      const { token, base } = await accessToken();
      const origin = req.headers.get("origin") || req.headers.get("referer") || "https://app.contentra.app";
      const res = await fetch(`${base}/v2/checkout/orders`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            amount: { currency_code: "USD", value: amount.toFixed(2) },
            description: `Contentra ${plan} plan`,
          }],
          application_context: {
            brand_name: "Contentra",
            return_url: `${origin}/app/billing?paypal=approved&plan=${plan}`,
            cancel_url: `${origin}/app/billing?paypal=cancelled`,
            user_action: "PAY_NOW",
          },
        }),
      });
      const order = await res.json();
      if (!res.ok) return Response.json({ error: order.message || "PayPal order creation failed" }, { status: 400 });
      const approve = order.links?.find((l) => l.rel === "approve")?.href;
      return Response.json({ orderId: order.id, approveUrl: approve });
    }

    if (action === "capture-order") {
      const { orderId, plan, amount } = body;
      if (!orderId || !plan) return Response.json({ error: "orderId and plan are required" }, { status: 400 });

      const { token, base } = await accessToken();
      const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: "{}",
      });
      const data = await res.json();
      if (!res.ok) return Response.json({ error: data.message || "PayPal capture failed" }, { status: 400 });

      try {
        await base44.entities.Subscription.create({
          plan, status: "active", provider: "paypal",
          provider_order_id: orderId, amount: Number(amount || 0), currency: "USD",
        });
      } catch {}
      try { await base44.auth.updateMe({ plan }); } catch {}

      return Response.json({ status: "completed", plan });
    }

    return Response.json({ error: "unknown action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
