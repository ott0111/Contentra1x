import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Repeat2, Save, ArrowRight } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";

export default function Repurpose() {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [targets, setTargets] = useState(["TikTok", "Instagram"]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = (p) => setTargets((t) => t.includes(p) ? t.filter((x) => x !== p) : [...t, p]);

  const generate = async () => {
    if (!source.trim() || targets.length === 0) return;
    setLoading(true); setResult("");
    try {
      const prompt = `Repurpose the following content into optimized versions for these platforms: ${targets.join(", ")}. For each platform, provide: a hook, a short concept, a caption with hashtags, and a CTA. Source content:\n\n${source}`;
      const res = await base44.functions.invoke("contentraAI", { prompt, feature: "repurposing" });
      setResult(res?.data?.result || "No result.");
      base44.entities.AIUsage.create({ feature: "repurposing", request_type: "repurpose", success: true }).catch(() => {});
    } catch { setResult("Contentra AI is unavailable right now."); }
    finally { setLoading(false); }
  };

  const saveAsContent = async () => {
    await base44.entities.Content.create({ title: "Repurposed content", status: "Draft", notes: result });
    navigate("/app/content");
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <PageHeader title="Repurpose" description="Turn one piece of content into platform-native versions." />
      <div className="space-y-4">
        <div>
          <Label>Paste a script, transcript, or existing content</Label>
          <Textarea className="mt-1.5" rows={8} value={source} onChange={(e) => setSource(e.target.value)} placeholder="Paste your YouTube video transcript, blog post, or script here…" />
        </div>
        <div>
          <Label>Target platforms</Label>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {PLATFORMS.map((p) => <button key={p} onClick={() => toggle(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${targets.includes(p) ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>{p}</button>)}
          </div>
        </div>
        <Button onClick={generate} disabled={loading || !source.trim() || targets.length === 0}><Repeat2 className="w-4 h-4 mr-1" /> Generate variations {loading && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}</Button>

        {result && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Generated variations</h3>
              <Button size="sm" variant="outline" onClick={saveAsContent}><Save className="w-3.5 h-3.5 mr-1" /> Save to Content Studio</Button>
            </div>
            <div className="text-sm whitespace-pre-wrap text-muted-foreground">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
