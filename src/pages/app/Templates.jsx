import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, LayoutTemplate, Loader2, Copy, Pencil } from "lucide-react";
import { PLATFORMS, CATEGORIES, DEFAULT_TEMPLATES } from "@/lib/constants";

export default function Templates() {
  const navigate = useNavigate();
  const [custom, setCustom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", platform: "", category: "", content_structure: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); try { setCustom(await base44.entities.Template.list("-updated_date", 100)); } catch { setCustom([]); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const categories = ["All", ...new Set([...DEFAULT_TEMPLATES.map((t) => t.category), ...custom.map((t) => t.category)].filter(Boolean))];
  const all = [...DEFAULT_TEMPLATES.map((t) => ({ ...t, isDefault: true })), ...custom.map((t) => ({ ...t, isDefault: false }))];
  const filtered = filter === "All" ? all : all.filter((t) => t.category === filter);

  const applyTemplate = async (t) => {
    const c = await base44.entities.Content.create({ title: `From template: ${t.name}`, platform: t.platform || "", status: "Draft", notes: t.content_structure || "" });
    navigate(`/app/content/${c.id}`);
  };
  const save = async () => { if (!form.name.trim()) return; setSaving(true); try { await base44.entities.Template.create({ ...form, is_custom: true }); setModalOpen(false); setForm({ name: "", description: "", platform: "", category: "", content_structure: "" }); load(); } finally { setSaving(false); } };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Templates" description="Start faster with proven content structures.">
        <Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4 mr-1" /> New template</Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${filter === c ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>{c}</button>)}
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        : filtered.length === 0 ? <div className="rounded-xl border border-border bg-card"><EmptyState icon={LayoutTemplate} title="No templates" description="Create a custom template to reuse structures." /></div>
        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{t.platform || "Any"} · {t.category || "—"}</span>
                {t.isDefault ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Default</span> : <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary">Custom</span>}
              </div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-1">{t.description}</p>
              {t.content_structure && <pre className="mt-3 text-xs text-muted-foreground bg-background/40 rounded-lg p-3 whitespace-pre-wrap line-clamp-4">{t.content_structure}</pre>}
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1" onClick={() => applyTemplate(t)}>Use template</Button>
                {!t.isDefault && <Button size="icon" variant="outline" onClick={async () => { await base44.entities.Template.delete(t.id); load(); }}><Pencil className="w-3.5 h-3.5" /></Button>}
              </div>
            </div>
          ))}
        </div>}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New template</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2"><Label>Name *</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="col-span-2"><Label>Description</Label><Input className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Platform</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}><option value="">Any</option>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div><Label>Category</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="col-span-2"><Label>Content structure</Label><Textarea className="mt-1.5" rows={5} value={form.content_structure} onChange={(e) => setForm({ ...form, content_structure: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
