import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, Trash2, Sparkles, Loader2, PenSquare, FileText, Megaphone, Repeat2 } from "lucide-react";
import { PLATFORMS, CATEGORIES, IDEA_STATUSES, PRIORITIES, CONTENT_TYPES } from "@/lib/constants";

const AI_ACTIONS = [
  { key: "expand", label: "Expand Idea", icon: Sparkles, prompt: (t, d) => `Expand this content idea into a detailed concept with structure, key points, and angle. Idea: "${t}". ${d ? `Description: ${d}` : ""}` },
  { key: "hook", label: "Generate Hook", icon: Sparkles, prompt: (t) => `Generate 5 strong opening hooks for this content idea: "${t}".` },
  { key: "script", label: "Generate Script", icon: FileText, prompt: (t, d) => `Write a short-form video script for this idea: "${t}". ${d ? `Description: ${d}` : ""}` },
  { key: "caption", label: "Generate Caption", icon: PenSquare, prompt: (t) => `Write an engaging caption with hashtags for this content idea: "${t}".` },
  { key: "cta", label: "Generate CTA", icon: Megaphone, prompt: (t) => `Suggest 5 clear calls-to-action for this content idea: "${t}".` },
  { key: "variations", label: "Generate Variations", icon: Repeat2, prompt: (t) => `Give 3 different angle variations for this content idea: "${t}".` },
];

export default function IdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setIdea(await base44.entities.Idea.get(id)); }
    catch { setIdea(null); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [id]);

  const update = async (patch) => { setIdea({ ...idea, ...patch }); await base44.entities.Idea.update(id, patch); };
  const toggleFav = async () => update({ favorite: !idea.favorite });

  const runAI = async (action) => {
    setAiLoading(true); setAiResult("");
    try {
      const res = await base44.functions.invoke("contentraAI", { prompt: action.prompt(idea.title, idea.description), feature: "idea_generation" });
      setAiResult(res?.data?.result || "No result.");
      base44.entities.AIUsage.create({ feature: "idea_generation", request_type: action.key, success: true }).catch(() => {});
    } catch { setAiResult("Contentra AI is unavailable right now."); }
    finally { setAiLoading(false); }
  };

  const convertToContent = async () => {
    setSaving(true);
    try {
      const c = await base44.entities.Content.create({
        title: idea.title, platform: idea.platform || "", content_type: idea.content_type || "",
        status: "Draft", idea_id: idea.id, caption: idea.description || "",
      });
      await update({ status: "In Progress" });
      navigate(`/app/content/${c.id}`);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (!idea) return <div className="p-8 text-center text-muted-foreground">Idea not found. <Link to="/app/ideas" className="text-primary">Back to ideas</Link></div>;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <Link to="/app/ideas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4 mr-1" /> Back to ideas</Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2"><StatusBadge status={idea.status} /><StatusBadge status={idea.priority} />{idea.platform && <span className="text-xs text-muted-foreground">{idea.platform}</span>}</div>
          <input className="text-2xl font-semibold tracking-tight bg-transparent w-full outline-none focus:border-b focus:border-border" value={idea.title} onChange={(e) => setIdea({ ...idea, title: e.target.value })} onBlur={(e) => update({ title: e.target.value })} />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleFav}><Star className={`w-4 h-4 ${idea.favorite ? "fill-warning text-warning" : ""}`} /></Button>
          <Button variant="ghost" size="icon" onClick={async () => { await base44.entities.Idea.delete(id); navigate("/app/ideas"); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Label>Description</Label>
            <Textarea className="mt-1.5" rows={3} defaultValue={idea.description} onBlur={(e) => update({ description: e.target.value })} placeholder="Describe your idea…" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea className="mt-1.5" rows={3} defaultValue={idea.notes} onBlur={(e) => update({ notes: e.target.value })} placeholder="Add notes…" />
          </div>

          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-primary" /> AI actions</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {AI_ACTIONS.map((a) => (
                <Button key={a.key} variant="outline" size="sm" onClick={() => runAI(a)} disabled={aiLoading}><a.icon className="w-3.5 h-3.5 mr-1" /> {a.label}</Button>
              ))}
            </div>
            {(aiLoading || aiResult) && (
              <div className="rounded-lg border border-border bg-background/40 p-4 text-sm whitespace-pre-wrap min-h-[80px]">
                {aiLoading ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Generating…</span> : aiResult}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Details</h3>
            <div className="space-y-3 text-sm">
              <div><Label className="text-xs">Status</Label>
                <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={idea.status} onChange={(e) => update({ status: e.target.value })}>{IDEA_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
              <div><Label className="text-xs">Priority</Label>
                <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={idea.priority} onChange={(e) => update({ priority: e.target.value })}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
              </div>
              <div><Label className="text-xs">Platform</Label>
                <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={idea.platform || ""} onChange={(e) => update({ platform: e.target.value })}><option value="">Any</option>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select>
              </div>
              <div><Label className="text-xs">Category</Label>
                <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={idea.category || ""} onChange={(e) => update({ category: e.target.value })}><option value="">Select…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
              </div>
              <div><Label className="text-xs">Content type</Label>
                <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={idea.content_type || ""} onChange={(e) => update({ content_type: e.target.value })}><option value="">Select…</option>{CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}</select>
              </div>
              <div><Label className="text-xs">Target audience</Label><input className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" defaultValue={idea.target_audience || ""} onBlur={(e) => update({ target_audience: e.target.value })} /></div>
            </div>
          </Card>
          <Button className="w-full" onClick={convertToContent} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Convert to Content</Button>
        </div>
      </div>
    </div>
  );
}
