import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/constants";
import UpgradeModal from "@/components/UpgradeModal";

const PLANS = [
  { key: "free", name: "Free", price: "$0", features: ["25 ideas","15 AI generations","2 social accounts","Basic analytics"] },
  { key: "pro", name: "Pro", price: "$19.99", features: ["Unlimited ideas","500 AI generations","Advanced AI & repurposing","Goals & trends","Competitor tracking"], featured: true },
  { key: "business", name: "Business", price: "$49.99", features: ["Everything in Pro","Unlimited AI","Teams & workspaces","Client management","Brand deals & revenue"] },
];

export default function Billing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState("free");
  const [usage, setUsage] = useState({ ideas: 0, aiGenerations: 0 });
  const [loading, setLoading] = useState(true);
  const [upgrade, setUpgrade] = useState({ open: false, target: "pro" });
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await base44.auth.me();
        setPlan(me?.plan || "free");
        const [ideas, ai] = await Promise.all([
          base44.entities.Idea.list("-updated_date", 500).catch(() => []),
          base44.entities.AIUsage.list("-updated_date", 500).catch(() => []),
        ]);
        const now = new Date();
        setUsage({ ideas: ideas.length, aiGenerations: ai.filter((a) => a.created_date && new Date(a.created_date).getMonth() === now.getMonth()).length });
      } finally { setLoading(false); }
    })();
  }, []);

  // Handle return from PayPal approval redirect
  useEffect(() => {
    if (searchParams.get("paypal") !== "approved") return;
    const orderId = searchParams.get("token");
    const planKey = searchParams.get("plan");
    if (!orderId || !planKey) return;
    setProcessing(planKey);
    (async () => {
      try {
        const res = await base44.functions.invoke("paypal", { action: "capture-order", orderId, plan: planKey, amount: planKey === "pro" ? 19.99 : 49.99 });
        if (res?.data?.status === "completed") setPlan(planKey);
      } finally {
        setProcessing(null);
        navigate("/app/billing", { replace: true });
      }
    })();
  }, [searchParams]);

  const startPayPal = async (planKey) => {
    const amounts = { pro: 19.99, business: 49.99 };
    const amount = amounts[planKey];
    if (!amount) return;
    setProcessing(planKey);
    setError("");
    try {
      const res = await base44.functions.invoke("paypal", { action: "create-order", plan: planKey, amount });
      const approveUrl = res?.data?.approveUrl;
      if (approveUrl) window.location.href = approveUrl;
      else { setError("PayPal did not return a checkout URL. Check your PayPal credentials in Secrets."); setProcessing(null); }
    } catch (err) {
      setError(err?.message || "PayPal checkout failed. Verify your PayPal credentials in Secrets settings.");
      setProcessing(null);
    }
  };

  const limits = PLAN_LIMITS[plan];

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <PageHeader title="Billing" description="Manage your subscription and usage." />
      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> : (
        <>
          <Card className="p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current plan</p>
                <p className="text-2xl font-semibold capitalize">{limits.label}</p>
              </div>
              {plan !== "business" && <Button onClick={() => startPayPal(plan === "free" ? "pro" : "business")} disabled={processing}><Sparkles className="w-4 h-4 mr-1" /> {processing ? "Redirecting…" : "Upgrade with PayPal"}</Button>}
            </div>
          </Card>

          <h3 className="font-semibold mb-3">Usage this month</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { label: "Ideas", used: usage.ideas, limit: limits.ideas },
              { label: "AI generations", used: usage.aiGenerations, limit: limits.aiGenerations },
            ].map((u) => {
              const pct = u.limit === Infinity ? 0 : Math.min(100, Math.round((u.used / u.limit) * 100));
              return (
                <Card key={u.label} className="p-5">
                  <div className="flex justify-between text-sm mb-2"><span>{u.label}</span><span className="text-muted-foreground">{u.used} / {u.limit === Infinity ? "∞" : u.limit}</span></div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} /></div>
                </Card>
              );
            })}
          </div>

          <h3 className="font-semibold mb-3">Available plans</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((p) => (
              <Card key={p.key} className={`p-5 ${p.featured ? "border-primary" : ""}`}>
                {p.featured && <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-primary text-primary-foreground mb-3">Recommended</span>}
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-2xl font-semibold mt-1">{p.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /><span className="text-muted-foreground">{f}</span></li>)}
                </ul>
                <Button className="w-full mt-5" variant={plan === p.key ? "outline" : p.featured ? "default" : "outline"} disabled={plan === p.key || processing === p.key} onClick={() => (p.key === "free" ? setUpgrade({ open: true, target: p.key }) : startPayPal(p.key))}>
                  {plan === p.key ? "Current plan" : processing === p.key ? "Redirecting to PayPal…" : p.key === "free" ? `Choose ${p.name}` : `Upgrade with PayPal`}
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70 mt-6">Billing is processed securely via PayPal. You're redirected to PayPal to approve payment, then returned here to confirm your upgrade.</p>
        </>
      )}

      <UpgradeModal open={upgrade.open} onOpenChange={(o) => setUpgrade({ ...upgrade, open: o })} title="Upgrade your plan" message="Connect a payment provider to complete your upgrade. Your plan changes will apply once billing is configured." />
    </div>
  );
}
