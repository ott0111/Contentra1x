import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { PLATFORMS, CONTENT_TYPES, CONTENT_STATUSES } from "@/lib/constants";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, parseISO } from "date-fns";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(new Date());
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", platform: "", content_type: "", status: "Scheduled", scheduled_date: format(new Date(), "yyyy-MM-dd") });
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); try { setEvents(await base44.entities.CalendarEvent.list("scheduled_date", 200)); } catch { setEvents([]); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const filtered = useMemo(() => events.filter((e) => filterPlatform === "all" || e.platform === filterPlatform), [events, filterPlatform]);

  const eventsFor = (day) => filtered.filter((e) => { try { return isSameDay(parseISO(e.scheduled_date), day); } catch { return false; } });

  const save = async () => { if (!form.title.trim() || !form.scheduled_date) return; setSaving(true); try { await base44.entities.CalendarEvent.create(form); setModalOpen(false); load(); } finally { setSaving(false); } };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Calendar" description="Plan and schedule content across every platform.">
        <Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4 mr-1" /> New event</Button>
      </PageHeader>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCursor(addMonths(cursor, -1))}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="font-semibold w-36 text-center">{format(cursor, "MMMM yyyy")}</span>
          <Button variant="ghost" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
        </div>
        <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="all">All platforms</option>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="p-2 text-xs font-medium text-muted-foreground text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const dayEvents = eventsFor(day);
              const inMonth = isSameMonth(day, cursor);
              return (
                <div key={day.toISOString()} className={`min-h-[96px] sm:min-h-[120px] border-b border-r border-border p-1.5 ${inMonth ? "" : "bg-secondary/20"}`}>
                  <div className={`text-xs mb-1 ${inMonth ? "text-muted-foreground" : "text-muted-foreground/40"}`}>{format(day, "d")}</div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((e) => (
                      <div key={e.id} className="px-1.5 py-1 rounded text-[11px] bg-primary/15 text-primary border border-primary/20 truncate">{e.title}</div>
                    ))}
                    {dayEvents.length > 3 && <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 3} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New calendar event</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Title *</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Platform</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}><option value="">Select…</option>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select></div>
              <div><Label>Type</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })}><option value="">Select…</option>{CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Status</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{CONTENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><Label>Date *</Label><Input type="date" className="mt-1.5" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
