import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";

const defaults = (fields) =>
  Object.fromEntries(fields.map((f) => [f.key, f.type === "multiselect" ? [] : f.type === "number" ? 0 : ""]));

function Field({ field, value, onChange }) {
  const set = (v) => onChange({ ...value, [field.key]: v });
  if (field.type === "textarea")
    return <Textarea value={value[field.key]} onChange={(e) => set(e.target.value)} rows={3} />;
  if (field.type === "select")
    return (
      <select
        value={value[field.key]}
        onChange={(e) => set(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">Select…</option>
        {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  if (field.type === "number")
    return <Input type="number" value={value[field.key]} onChange={(e) => set(Number(e.target.value))} />;
  if (field.type === "date")
    return <Input type="date" value={value[field.key] || ""} onChange={(e) => set(e.target.value)} />;
  return <Input value={value[field.key]} onChange={(e) => set(e.target.value)} />;
}

export default function CrudPage({
  entity, title, description, columns, fields, filters = [],
  emptyTitle, emptyDescription, createLabel = "New", icon: EmptyIcon,
  currency,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaults(fields));
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await base44.entities[entity].list("-updated_date", 200)); }
    catch { setItems([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((it) => {
    if (search) {
      const q = search.toLowerCase();
      if (!columns.some((c) => String(it[c.key] ?? "").toLowerCase().includes(q))) return false;
    }
    for (const f of filters) {
      const v = filterValues[f.key];
      if (v && v !== "all" && it[f.key] !== v) return false;
    }
    return true;
  }), [items, search, filterValues]);

  const openCreate = () => { setEditing(null); setForm(defaults(fields)); setModalOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm({ ...defaults(fields), ...it }); setModalOpen(true); };

  const save = async () => {
    const required = fields.filter((f) => f.required);
    if (required.some((f) => !form[f.key] && form[f.key] !== 0)) return;
    setSaving(true);
    try {
      if (editing) await base44.entities[entity].update(editing.id, form);
      else await base44.entities[entity].create(form);
      setModalOpen(false);
      load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const doDelete = async () => {
    await base44.entities[entity].delete(deleteId);
    setDeleteId(null);
    load();
  };

  const renderCell = (it, col) => {
    const v = it[col.key];
    if (col.type === "badge") return v ? <StatusBadge status={v} /> : null;
    if (col.type === "date") return v ? format(new Date(v), "MMM d, yyyy") : "—";
    if (col.type === "currency") return v != null ? `$${Number(v).toLocaleString()}` : "—";
    if (col.type === "number") return v != null ? Number(v).toLocaleString() : "—";
    return v || "—";
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title={title} description={description}>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> {createLabel}</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="pl-9" />
        </div>
        {filters.map((f) => (
          <select
            key={f.key}
            value={filterValues[f.key] || "all"}
            onChange={(e) => setFilterValues({ ...filterValues, [f.key]: e.target.value })}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm min-w-[140px]"
          >
            <option value="all">All {f.label}</option>
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyState icon={EmptyIcon} title={emptyTitle || `No ${title.toLowerCase()} yet`} description={emptyDescription || "Create your first entry to get started."} action={<Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> {createLabel}</Button>} />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-muted-foreground">
                <tr>
                  {columns.map((c) => <th key={c.key} className="text-left font-medium px-4 py-3">{c.label}</th>)}
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((it) => (
                  <tr key={it.id} className="hover:bg-secondary/30">
                    {columns.map((c) => <td key={c.key} className="px-4 py-3 text-foreground">{renderCell(it, c)}</td>)}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(it)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(it.id)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "New"} {title.replace(/s$/, "")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2 max-h-[60vh] overflow-y-auto">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" || f.type === "multiselect" ? "col-span-2" : ""}>
                <Label className="mb-1.5 block text-sm">{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                <Field field={f} value={form} onChange={setForm} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
