import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import EmptyState from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Eye, Heart, MessageCircle, Share2, Users, Loader2, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format } from "date-fns";

const DEMO_SERIES = Array.from({ length: 12 }, (_, i) => ({ name: format(new Date(2026, i, 1), "MMM"), views: 4000 + i * 1800 + Math.round(Math.random() * 2000), followers: 1000 + i * 320 }));

export default function Analytics() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setContent(await base44.entities.Content.list("-updated_date", 100)); }
      catch { setContent([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const published = content.filter((c) => c.status === "Published");
  const totalViews = published.reduce((s, c) => s + (c.views || 0), 0);
  const totalLikes = published.reduce((s, c) => s + (c.likes || 0), 0);
  const totalComments = published.reduce((s, c) => s + (c.comments || 0), 0);
  const totalShares = published.reduce((s, c) => s + (c.shares || 0), 0);
  const sorted = [...published].sort((a, b) => (b.views || 0) - (a.views || 0));
  const top = sorted.slice(0, 5);
  const worst = sorted.slice(-3).reverse();

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Analytics" description="Understand what's working across your content." />

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard label="Views" value={totalViews.toLocaleString()} icon={Eye} change="+28%" />
            <MetricCard label="Likes" value={totalLikes.toLocaleString()} icon={Heart} change="+15%" />
            <MetricCard label="Comments" value={totalComments.toLocaleString()} icon={MessageCircle} />
            <MetricCard label="Shares" value={totalShares.toLocaleString()} icon={Share2} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-4">Views over time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={DEMO_SERIES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-4">Followers over time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DEMO_SERIES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="followers" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground/70 mb-6">Charts use illustrative demo data. Connect social accounts in Settings for live analytics.</p>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-3">Top performing content</h3>
              {top.length === 0 ? <EmptyState icon={BarChart3} title="No published content yet" description="Publish content with view counts to see performance." /> : top.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm truncate flex-1">{c.title}</span>
                  <span className="text-sm font-medium ml-3">{(c.views || 0).toLocaleString()} views</span>
                </div>
              ))}
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-3">Worst performing content</h3>
              {worst.length === 0 ? <p className="text-sm text-muted-foreground">Not enough data.</p> : worst.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm truncate flex-1">{c.title}</span>
                  <span className="text-sm font-medium ml-3">{(c.views || 0).toLocaleString()} views</span>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
