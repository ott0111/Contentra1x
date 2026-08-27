import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

// Reusable API service: returns the caller's plan, per-feature limits, current
// usage, remaining quota, and whether each limit has been reached.
// Any client (web, iOS, Android, Windows, macOS) can call this to enforce
// subscription entitlements consistently on the server side.
const LIMITS = {
  free: { ideas: 25, aiGenerations: 15, socialAccounts: 2, storage: 100, competitors: 3, clients: 1, workspaces: 1, teamMembers: 1, label: "Free" },
  pro: { ideas: Infinity, aiGenerations: 500, socialAccounts: 8, storage: 5000, competitors: 25, clients: 5, workspaces: 3, teamMembers: 5, label: "Pro" },
  business: { ideas: Infinity, aiGenerations: Infinity, socialAccounts: Infinity, storage: 50000, competitors: Infinity, clients: Infinity, workspaces: Infinity, teamMembers: Infinity, label: "Business" },
};

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const plan = user.plan || "free";
    const limits = LIMITS[plan] || LIMITS.free;

    const [ideas, ai] = await Promise.all([
      base44.entities.Idea.list("-updated_date", 500),
      base44.entities.AIUsage.list("-created_date", 500),
    ]);
    const now = new Date();
    const aiThisMonth = ai.filter((a) => a.created_date && new Date(a.created_date).getMonth() === now.getMonth()).length;
    const usage = { ideas: ideas.length, aiGenerations: aiThisMonth };

    const features = Object.keys(limits).filter((k) => k !== "label");
    const entitlements = {};
    for (const f of features) {
      const limit = limits[f];
      const used = usage[f] || 0;
      entitlements[f] = {
        limit,
        used,
        remaining: limit === Infinity ? Infinity : Math.max(0, limit - used),
        reached: limit !== Infinity && used >= limit,
      };
    }

    return Response.json({ plan, label: limits.label, entitlements });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
