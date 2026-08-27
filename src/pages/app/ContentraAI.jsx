import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AIChat from "@/components/AIChat";

export default function ContentraAI() {
  const [me, setMe] = useState(null);
  useEffect(() => { base44.auth.me().then(setMe).catch(() => {}); }, []);

  const systemContext = me ? `You are Contentra AI, a creator growth assistant. Creator context — name: ${me.full_name || ""}, niche: ${me.niche || "general"}, platforms: ${(me.platforms || []).join(", ") || "none"}, goals: ${(me.goals || []).join(", ") || "growth"}, posting frequency: ${me.posting_frequency || "regular"}, audience size: ${me.audience_size || "unknown"}. Give practical, specific, actionable advice.` : "You are Contentra AI, a creator growth assistant. Give practical, specific, actionable advice.";

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> Contentra AI</h1>
        <p className="text-sm text-muted-foreground">Your AI partner for ideas, scripts, strategy, and growth.</p>
      </div>
      <div className="flex-1 min-h-0">
        <AIChat systemContext={systemContext} feature="chat" />
      </div>
    </div>
  );
}
