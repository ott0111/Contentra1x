import { base44 } from "@/api/base44Client";
import { PLAN_LIMITS } from "@/lib/constants";

// Centralized plan + usage system. Client-side check (architecture for server enforcement later).
export function getPlanLimits(plan = "free") {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

export async function getCurrentPlan() {
  try {
    const me = await base44.auth.me();
    return me?.plan || "free";
  } catch {
    return "free";
  }
}

export async function getUsageCounts() {
  const counts = {};
  const entities = ["Idea", "AIUsage"];
  try {
    const [ideas, ai] = await Promise.all([
      base44.entities.Idea.list("-updated_date", 500),
      base44.entities.AIUsage.list("-updated_date", 500),
    ]);
    counts.ideas = ideas.length;
    // AI usage this month
    const now = new Date();
    counts.aiGenerations = ai.filter(a => a.created_date && new Date(a.created_date).getMonth() === now.getMonth()).length;
  } catch {
    counts.ideas = 0;
    counts.aiGenerations = 0;
  }
  return counts;
}

export async function checkLimit(feature) {
  const plan = await getCurrentPlan();
  const limits = getPlanLimits(plan);
  const usage = await getUsageCounts();
  const limit = limits[feature];
  const used = usage[feature] || 0;
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);
  const reached = limit !== Infinity && used >= limit;
  return { plan, limit, used, remaining, reached };
}
