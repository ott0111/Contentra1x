import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Plus, Trophy, Loader2, Pencil, Trash2 } from "lucide-react";
import { GOAL_TYPES, PLATFORMS } from "@/lib/constants";
import { format } from "date-fns";

const blank = { name: "", type: "Followers", target: 0, current_value: 0, deadline: "", platform: "", status: "Not Started" };

export default function Goals() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => { setLoading(true); try { setGoals(await base44.entities.Goal.list("-updated_date", 100)); } catch { setGoals([]); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (params.get("new") === "1") { setEditing(null); setForm(blank); setModalOpen(true); params.delete("new"); setParams(params); } }, []);

  const save = async () => { if (!form.name.trim() || !form.target) return; setSaving(true); try { if (editing) await base44.entities.Goal.update(editing.id, form); else await base44.entities.Goal.create(form); setModalOpen(false); load(); } finally { setSaving(false); } };
  const openEdit = (g) => { setEditing(g); setForm({ ...blank, ...g }); setModalOpen(true); };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Goals" description="Track your growth targets and stay accountable.">
        <Button onClick={() => { setEditing(null); setForm(blank); setModalOpen(true); }}><Plus className="w-4 h-4 mr-1" /> New goal</Button>
      </PageHeader>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        : goals.length === 0 ? <div className="rounded-xl border border-border bg-card"><EmptyState icon={Trophy} title="No goals yet" description="Set a growth target to track your progress." action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4 mr-1" /> New goal</Button>} /></div>
        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => {
            const pct = g.target ? Math.min(100, Math.round((g.current_value / g.target) * 100)) : 0;
            return (
              <div key={g.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge status={g.status} />
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(g)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteId(g.id)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <h3 className="font-semibold">{g.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{g.type} · {g.platform || "All platforms"}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">{(g.current_value || 0).toLocaleString()} / {g.target.toLocaleString()}</span><span className="font-medium">{pct}%</span></div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} /></div>
                </div>
                {g.deadline && <p className="text-xs text-muted-foreground mt-3">Due {format(new Date(g.deadline), "MMM d, yyyy")}</p>}
              </div>
            );
          })}
        </div>}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit goal" : "New goal"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Name *</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Type</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{GOAL_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
              <div><Label>Platform</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}><option value="">All</option>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Target *</Label><Input type="number" className="mt-1.5" value={form.target} onChange={(e) => setForm({ ...form, target: Number(e.target.value) })} /></div>
              <div><Label>Current</Label><Input type="number" className="mt-1.5" value={form.current_value} onChange={(e) => setForm({ ...form, current_value: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Deadline</Label><Input type="date" className="mt-1.5" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
              <div><Label>Status</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Not Started</option><option>On Track</option><option>Behind</option><option>At Risk</option><option>Completed</option></select></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this goal?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={async () => { await base44.entities.Goal.delete(deleteId); setDeleteId(null); load(); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
