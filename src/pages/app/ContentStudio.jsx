import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Loader2 } from "lucide-react";
import { PLATFORMS, CONTENT_TYPES, CONTENT_STATUSES, CONTENT_GOALS } from "@/lib/constants";
import { format } from "date-fns";

const blank = { title: "", platform: "", content_type: "", status: "Draft", goal: "", publish_date: "" };

export default function ContentStudio() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); try { setItems(await base44.entities.Content.list("-updated_date", 200)); } catch { setItems([]); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (params.get("new") === "1") { setForm(blank); setModalOpen(true); params.delete("new"); setParams(params); } }, []);

  const filtered = useMemo(() => items.filter((i) => {
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    return true;
  }), [items, search, filterStatus]);

  const save = async () => { if (!form.title.trim()) return; setSaving(true); try { await base44.entities.Content.create(form); setModalOpen(false); load(); } finally { setSaving(false); } };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Content Studio" description="Create, write, and manage every piece of content.">
        <Button onClick={() => { setForm(blank); setModalOpen(true); }}><Plus className="w-4 h-4 mr-1" /> New Content</Button>
      </PageHeader>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search content…" className="pl-9" /></div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="all">All statuses</option>{CONTENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        : filtered.length === 0 ? <div className="rounded-xl border border-border bg-card"><EmptyState icon={Plus} title="No content yet" description="Create your first piece of content in the studio." action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4 mr-1" /> New content</Button>} /></div>
        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <button key={c.id} onClick={() => navigate(`/app/content/${c.id}`)} className="text-left rounded-xl border border-border bg-card p-4 hover:border-primary/40">
              <div className="flex items-center justify-between mb-2"><StatusBadge status={c.status} /><span className="text-xs text-muted-foreground">{c.platform || "—"}</span></div>
              <h3 className="font-medium line-clamp-2">{c.title}</h3>
              <p className="text-xs text-muted-foreground mt-2">{c.content_type || "Content"}{c.publish_date ? ` · ${format(new Date(c.publish_date), "MMM d")}` : ""}</p>
            </button>
          ))}
        </div>}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New content</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2"><Label>Title *</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Platform</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}><option value="">Select…</option>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div><Label>Content type</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })}><option value="">Select…</option>{CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><Label>Goal</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}><option value="">Select…</option>{CONTENT_GOALS.map((g) => <option key={g}>{g}</option>)}</select></div>
            <div><Label>Publish date</Label><Input type="date" className="mt-1.5" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
