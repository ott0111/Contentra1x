import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Bell, Check, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); try { setItems(await base44.entities.Notification.list("-created_date", 50)); } catch { setItems([]); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const markRead = async (n) => { if (!n.read) { await base44.entities.Notification.update(n.id, { read: true }); load(); } };
  const markAll = async () => { await base44.entities.Notification.updateMany({ read: false }, { $set: { read: true } }); load(); };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Notifications" description="Stay on top of what needs your attention.">
        <Button variant="outline" size="sm" onClick={markAll}><Check className="w-4 h-4 mr-1" /> Mark all read</Button>
      </PageHeader>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        : items.length === 0 ? <div className="rounded-xl border border-border bg-card"><EmptyState icon={Bell} title="No notifications" description="You're all caught up." /></div>
        : <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {items.map((n) => (
            <button key={n.id} onClick={() => markRead(n)} className="flex items-start gap-3 p-4 w-full text-left hover:bg-secondary/30">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-transparent" : "bg-primary"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? "text-muted-foreground" : "font-medium text-foreground"}`}>{n.title}</p>
                {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                <p className="text-[11px] text-muted-foreground/70 mt-1">{n.created_date ? formatDistanceToNow(new Date(n.created_date), { addSuffix: true }) : ""}</p>
              </div>
            </button>
          ))}
        </div>}
    </div>
  );
}
