import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Star, LayoutGrid, List, Loader2, Pencil, Trash2 } from "lucide-react";
import { PLATFORMS, CATEGORIES, IDEA_STATUSES, PRIORITIES, CONTENT_TYPES } from "@/lib/constants";

const blank = { title: "", description: "", platform: "", category: "", tags: [], priority: "Medium", status: "Idea", target_audience: "", content_type: "", estimated_potential: "", notes: "" };

export default function Ideas() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setIdeas(await base44.entities.Idea.list("-created_date", 200)); }
    catch { setIdeas([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (params.get("new") === "1") { setForm(blank); setModalOpen(true); params.delete("new"); setParams(params); }
  }, []);

  const filtered = useMemo(() => ideas.filter((i) => {
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    if (filterPlatform !== "all" && i.platform !== filterPlatform) return false;
    return true;
  }), [ideas, search, filterStatus, filterPlatform]);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try { await base44.entities.Idea.create(form); setModalOpen(false); load(); }
    finally { setSaving(false); }
  };

  const toggleFav = async (i) => { await base44.entities.Idea.update(i.id, { favorite: !i.favorite }); load(); };
  const del = async (i) => { await base44.entities.Idea.delete(i.id); load(); };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Ideas" description="Capture, organize, and prioritize your content ideas.">
        <Button onClick={() => { setForm(blank); setModalOpen(true); }}><Plus className="w-4 h-4 mr-1" /> New Idea</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ideas…" className="pl-9" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All statuses</option>
          {IDEA_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All platforms</option>
          {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <div className="flex items-center gap-1 p-1 rounded-md bg-secondary/50 border border-border">
          <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card"><EmptyState icon={Plus} title="No ideas yet" description="Start building your content library." action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4 mr-1" /> Create idea</Button>} /></div>
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((i) => (
              <div key={i.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-1.5"><StatusBadge status={i.status} /><StatusBadge status={i.priority} /></div>
                  <button onClick={() => toggleFav(i)}><Star className={`w-4 h-4 ${i.favorite ? "fill-warning text-warning" : "text-muted-foreground"}`} /></button>
                </div>
                <button onClick={() => navigate(`/app/ideas/${i.id}`)} className="block text-left">
                  <h3 className="font-medium line-clamp-2">{i.title}</h3>
                  {i.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{i.description}</p>}
                </button>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{i.platform || "Any"} · {i.category || "Uncategorized"}</span>
                  <button onClick={() => del(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {filtered.map((i) => (
              <div key={i.id} className="flex items-center gap-3 p-4 hover:bg-secondary/30">
                <button onClick={() => toggleFav(i)}><Star className={`w-4 h-4 ${i.favorite ? "fill-warning text-warning" : "text-muted-foreground"}`} /></button>
                <button onClick={() => navigate(`/app/ideas/${i.id}`)} className="flex-1 text-left min-w-0">
                  <p className="font-medium truncate">{i.title}</p>
                  <p className="text-xs text-muted-foreground">{i.platform} · {i.category}</p>
                </button>
                <StatusBadge status={i.status} />
                <StatusBadge status={i.priority} />
                <button onClick={() => del(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New idea</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="col-span-2"><Label>Title *</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="col-span-2"><Label>Description</Label><Textarea className="mt-1.5" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Platform</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}><option value="">Any</option>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div><Label>Category</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><Label>Priority</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div><Label>Content type</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })}><option value="">Select…</option>{CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="col-span-2"><Label>Target audience</Label><Input className="mt-1.5" value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save idea</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
