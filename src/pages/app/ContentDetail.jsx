import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Trash2, Sparkles, Loader2, Save, CalendarPlus } from "lucide-react";
import { PLATFORMS, CONTENT_TYPES, CONTENT_STATUSES, CONTENT_GOALS } from "@/lib/constants";

const AI_TOOLS = [
  { key: "improve", label: "Improve" },
  { key: "shorten", label: "Shorten" },
  { key: "expand", label: "Expand" },
  { key: "hook", label: "Hook" },
  { key: "cta", label: "CTA" },
  { key: "engaging", label: "More engaging" },
];

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const saveTimer = useRef(null);

  const load = async () => { try { setItem(await base44.entities.Content.get(id)); } catch { setItem(null); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [id]);

  const patch = (p) => {
    setItem((it) => ({ ...it, ...p }));
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try { await base44.entities.Content.update(id, p); setSavedAt(new Date()); } catch {}
    }, 800);
  };

  const runAI = async (tool, field) => {
    setAiLoading(true);
    try {
      const value = item[field] || item.title;
      const prompts = {
        improve: `Improve this ${field}: "${value}"`,
        shorten: `Shorten this ${field} while keeping the message: "${value}"`,
        expand: `Expand this ${field} with more detail: "${value}"`,
        hook: `Generate 5 hooks for: "${item.title}"`,
        cta: `Generate 5 CTAs for: "${item.title}"`,
        engaging: `Make this ${field} more engaging and conversational: "${value}"`,
      };
      const res = await base44.functions.invoke("contentraAI", { prompt: prompts[tool], feature: field === "script" ? "script_generation" : "caption_generation" });
      patch({ [field]: res?.data?.result || value });
      base44.entities.AIUsage.create({ feature: field === "script" ? "script_generation" : "caption_generation", request_type: tool, success: true }).catch(() => {});
    } catch {} finally { setAiLoading(false); }
  };

  const schedule = async () => {
    const date = item.publish_date || new Date().toISOString().slice(0, 10);
    await base44.entities.CalendarEvent.create({ title: item.title, platform: item.platform, content_type: item.content_type, status: "Scheduled", scheduled_date: date, content_id: id });
    await patch({ status: "Scheduled" });
    navigate("/app/calendar");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (!item) return <div className="p-8 text-center text-muted-foreground">Content not found. <Link to="/app/content" className="text-primary">Back</Link></div>;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <Link to="/app/content" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4 mr-1" /> Back to content</Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2"><StatusBadge status={item.status} /><span className="text-xs text-muted-foreground">{item.platform} · {item.content_type}</span>{savedAt && <span className="text-xs text-success flex items-center gap-1"><Save className="w-3 h-3" /> Saved</span>}</div>
          <input className="text-2xl font-semibold tracking-tight bg-transparent w-full outline-none focus:border-b focus:border-border" value={item.title} onChange={(e) => patch({ title: e.target.value })} />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={schedule}><CalendarPlus className="w-4 h-4 mr-1" /> Schedule</Button>
          <Button variant="ghost" size="icon" onClick={async () => { await base44.entities.Content.delete(id); navigate("/app/content"); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="caption">Caption</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Status</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={item.status} onChange={(e) => patch({ status: e.target.value })}>{CONTENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><Label>Platform</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={item.platform || ""} onChange={(e) => patch({ platform: e.target.value })}><option value="">Select…</option>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div><Label>Content type</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={item.content_type || ""} onChange={(e) => patch({ content_type: e.target.value })}><option value="">Select…</option>{CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><Label>Goal</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={item.goal || ""} onChange={(e) => patch({ goal: e.target.value })}><option value="">Select…</option>{CONTENT_GOALS.map((g) => <option key={g}>{g}</option>)}</select></div>
            <div><Label>Publish date</Label><Input type="date" className="mt-1.5" value={item.publish_date || ""} onChange={(e) => patch({ publish_date: e.target.value })} /></div>
            <div><Label>Audience</Label><Input className="mt-1.5" value={item.audience || ""} onChange={(e) => patch({ audience: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[["Views","views"],["Likes","likes"],["Comments","comments"],["Shares","shares"]].map(([l, k]) => (
              <div key={k}><Label className="text-xs">{l}</Label><Input type="number" className="mt-1" value={item[k] || 0} onChange={(e) => patch({ [k]: Number(e.target.value) })} /></div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="script">
          <div className="flex flex-wrap gap-2 mb-3">{AI_TOOLS.map((t) => <Button key={t.key} variant="outline" size="sm" onClick={() => runAI(t.key, "script")} disabled={aiLoading}>{t.label}</Button>)}</div>
          <Textarea rows={16} className="font-mono text-sm" value={item.script || ""} onChange={(e) => patch({ script: e.target.value })} placeholder="Write your script…" />
        </TabsContent>

        <TabsContent value="caption">
          <div className="flex flex-wrap gap-2 mb-3">{AI_TOOLS.map((t) => <Button key={t.key} variant="outline" size="sm" onClick={() => runAI(t.key, "caption")} disabled={aiLoading}>{t.label}</Button>)}</div>
          <Textarea rows={10} value={item.caption || ""} onChange={(e) => patch({ caption: e.target.value })} placeholder="Write your caption…" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div><Label>Hook</Label><Input className="mt-1.5" value={item.hook || ""} onChange={(e) => patch({ hook: e.target.value })} /></div>
            <div><Label>CTA</Label><Input className="mt-1.5" value={item.cta || ""} onChange={(e) => patch({ cta: e.target.value })} /></div>
          </div>
        </TabsContent>

        <TabsContent value="notes"><Textarea rows={12} value={item.notes || ""} onChange={(e) => patch({ notes: e.target.value })} placeholder="Notes…" /></TabsContent>

        <TabsContent value="ai">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-primary" /> Contentra AI</h3>
            <p className="text-sm text-muted-foreground mb-4">Use AI to draft, refine, and generate variations. Results populate the fields above.</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => runAI("improve", "script")} disabled={aiLoading}>{aiLoading && <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />} Improve script</Button>
              <Button variant="outline" size="sm" onClick={() => runAI("hook", "hook")} disabled={aiLoading}>Generate hook</Button>
              <Button variant="outline" size="sm" onClick={() => runAI("cta", "cta")} disabled={aiLoading}>Generate CTA</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
