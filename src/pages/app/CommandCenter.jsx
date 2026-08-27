import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Eye, Users, Heart, FileText, TrendingUp, Lightbulb, Plus, PenSquare,
  CalendarDays, Sparkles, ArrowRight, Target, Loader2,
} from "lucide-react";
import { format } from "date-fns";

export default function CommandCenter() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [content, setContent] = useState([]);
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");

  useEffect(() => {
    (async () => {
      try {
        const [u, i, c, e, g] = await Promise.all([
          base44.auth.me().catch(() => null),
          base44.entities.Idea.list("-created_date", 50),
          base44.entities.Content.list("-updated_date", 50),
          base44.entities.CalendarEvent.list("scheduled_date", 100),
          base44.entities.Goal.list("-updated_date", 20),
        ]);
        setMe(u); setIdeas(i); setContent(c); setEvents(e); setGoals(g);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  const upcoming = events.filter((e) => new Date(e.scheduled_date) >= new Date()).slice(0, 6);
  const published = content.filter((c) => c.status === "Published");
  const totalViews = published.reduce((s, c) => s + (c.views || 0), 0);
  const totalEngagement = published.reduce((s, c) => s + (c.likes || 0) + (c.comments || 0) + (c.shares || 0), 0);

  const insights = [
    published.length > 0 && { icon: TrendingUp, text: `Your published content has generated ${totalViews.toLocaleString()} total views.`, tone: "success" },
    content.length > 0 && { icon: Sparkles, text: `You have ${content.filter(c => c.status === "Draft").length} drafts waiting to be finished.`, tone: "info" },
    ideas.length > 0 && { icon: Lightbulb, text: `${ideas.filter(i => i.status === "Idea").length} ideas are ready to develop into content.`, tone: "info" },
    { icon: CalendarDays, text: `${upcoming.length} posts scheduled upcoming.`, tone: "info" },
  ].filter(Boolean);

  const quickActions = [
    { label: "New Idea", icon: Lightbulb, to: "/app/ideas?new=1" },
    { label: "Create Content", icon: PenSquare, to: "/app/content?new=1" },
    { label: "Schedule Post", icon: CalendarDays, to: "/app/calendar" },
    { label: "Ask Contentra AI", icon: Sparkles, to: "/app/ai" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title={`Welcome back${me?.full_name ? ", " + me.full_name.split(" ")[0] : ""}`}>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border">
          {[["7","7d"],["30","30d"],["90","90d"]].map(([v, l]) => (
            <button key={v} onClick={() => setRange(v)} className={`px-3 py-1 rounded-md text-xs font-medium ${range === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
          ))}
        </div>
      </PageHeader>

      {/* Performance overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total views" value={totalViews.toLocaleString()} change="+28%" icon={Eye} />
        <MetricCard label="Followers" value="—" icon={Users} />
        <MetricCard label="Engagement" value={totalEngagement.toLocaleString()} change="+12%" icon={Heart} />
        <MetricCard label="Content published" value={published.length} icon={FileText} />
      </div>
      <p className="text-xs text-muted-foreground/70 mb-6">Metrics reflect your manually tracked content. Connect social accounts in Settings for live analytics.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming content */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming content</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/calendar")}>View calendar <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Nothing scheduled" description="Plan your next posts on the calendar." action={<Button size="sm" onClick={() => navigate("/app/calendar")}>Open calendar</Button>} />
          ) : (
            <div className="space-y-2">
              {upcoming.map((e) => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/40">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-muted-foreground uppercase">{format(new Date(e.scheduled_date), "MMM")}</span>
                    <span className="text-sm font-semibold">{format(new Date(e.scheduled_date), "d")}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.platform} · {e.content_type || "Content"}</p>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <button key={a.label} onClick={() => navigate(a.to)} className="flex flex-col items-start gap-2 p-3 rounded-lg border border-border bg-background/40 hover:border-primary/40 text-left">
                <a.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Goals</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/goals")}>All <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
          </div>
          {goals.length === 0 ? (
            <EmptyState icon={Target} title="No goals yet" description="Set a growth target to track progress." />
          ) : goals.slice(0, 3).map((g) => {
            const pct = g.target ? Math.min(100, Math.round((g.current_value / g.target) * 100)) : 0;
            return (
              <div key={g.id} className="mb-3 last:mb-0">
                <div className="flex justify-between text-sm mb-1"><span>{g.name}</span><span className="text-muted-foreground">{pct}%</span></div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>

        {/* Insights */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-4"><Sparkles className="w-4 h-4 text-primary" /> Contentra Insights</h2>
          <div className="space-y-2">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/40">
                <ins.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent ideas */}
      <div className="rounded-xl border border-border bg-card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent ideas</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/app/ideas")}>All ideas <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
        </div>
        {ideas.length === 0 ? (
          <EmptyState icon={Lightbulb} title="No ideas yet" description="Start building your content library." action={<Button size="sm" onClick={() => navigate("/app/ideas?new=1")}><Plus className="w-4 h-4 mr-1" /> Create idea</Button>} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ideas.slice(0, 6).map((i) => (
              <button key={i.id} onClick={() => navigate(`/app/ideas/${i.id}`)} className="text-left p-4 rounded-lg border border-border bg-background/40 hover:border-primary/40">
                <div className="flex items-center justify-between mb-2"><StatusBadge status={i.status} /><StatusBadge status={i.priority} /></div>
                <p className="font-medium text-sm line-clamp-2">{i.title}</p>
                {i.platform && <p className="text-xs text-muted-foreground mt-1">{i.platform}</p>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
