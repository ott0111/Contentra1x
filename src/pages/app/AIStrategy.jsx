import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, BrainCircuit } from "lucide-react";

export default function AIStrategy() {
  const [me, setMe] = useState(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { base44.auth.me().then(setMe).catch(() => {}); }, []);

  const analyze = async () => {
    if (!question.trim()) return;
    setLoading(true); setResult("");
    try {
      const ctx = me ? `Creator context: niche ${me.niche}, platforms ${(me.platforms||[]).join(", ")}, goals ${(me.goals||[]).join(", ")}, audience ${me.audience_size}. ` : "";
      const res = await base44.functions.invoke("contentraAI", { prompt: `${ctx}As a content strategist, answer this with a concrete, prioritized action plan: ${question}`, feature: "strategy" });
      setResult(res?.data?.result || "No result.");
      base44.entities.AIUsage.create({ feature: "strategy", request_type: "strategy", success: true }).catch(() => {});
    } catch { setResult("Contentra AI is unavailable right now."); }
    finally { setLoading(false); }
  };

  const PRESETS = ["What content should I focus on this quarter?", "How do I grow from 10K to 50K followers?", "How do I monetize my audience?", "What's my biggest content gap?"];

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <PageHeader title="AI Strategy" description="Get a strategic action plan tailored to your creator context." />
      <div className="space-y-4">
        <div>
          <Label>What do you want to strategize?</Label>
          <Textarea className="mt-1.5" rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a strategy question…" />
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => <button key={p} onClick={() => setQuestion(p)} className="px-3 py-1.5 rounded-lg text-sm border border-border bg-card text-muted-foreground hover:text-foreground">{p}</button>)}
        </div>
        <Button onClick={analyze} disabled={loading || !question.trim()}><BrainCircuit className="w-4 h-4 mr-1" /> Analyze {loading && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}</Button>
        {result && <div className="rounded-xl border border-border bg-card p-5 text-sm whitespace-pre-wrap text-muted-foreground">{result}</div>}
      </div>
    </div>
  );
}
