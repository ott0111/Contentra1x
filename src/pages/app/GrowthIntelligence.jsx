import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function GrowthIntelligence() {
  const navigate = useNavigate();
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
  const byType = {};
  published.forEach((c) => { const k = c.content_type || "Other"; byType[k] = (byType[k] || { views: 0, count: 0 }); byType[k].views += c.views || 0; byType[k].count++; });
  const types = Object.entries(byType).map(([k, v]) => ({ type: k, avg: v.count ? Math.round(v.views / v.count) : 0, count: v.count })).sort((a, b) => b.avg - a.avg);
  const best = types[0];
  const worst = types[types.length - 1];

  const recommendations = [
    best && { icon: TrendingUp, tone: "success", title: `${best.type} is your strongest format`, reason: `Averaging ${best.avg.toLocaleString()} views across ${best.count} posts.`, action: "Double down on this format", to: "/app/content?new=1" },
    worst && best && worst.type !== best.type && { icon: TrendingDown, tone: "warning", title: `${worst.type} is underperforming`, reason: `Only ${worst.avg.toLocaleString()} avg views.`, action: "Test a new angle or retire it", to: "/app/ai" },
    { icon: Sparkles, tone: "info", title: "Repurpose your best content", reason: "Your top posts can become a week of short-form.", action: "Open Repurpose", to: "/app/repurpose" },
    { icon: TrendingUp, tone: "info", title: "Explore rising trends", reason: "Align your next posts with what's gaining momentum.", action: "View trends", to: "/app/trends" },
  ].filter(Boolean);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Growth Intelligence" description="Turn your performance into a concrete action plan." />
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 mb-6">
        <h2 className="text-xl font-semibold">Growth summary</h2>
        <p className="text-muted-foreground mt-2">
          {published.length > 0
            ? `Your content generated ${published.reduce((s, c) => s + (c.views || 0), 0).toLocaleString()} views across ${published.length} published posts. ${best ? `Your ${best.type} format is leading.` : ""}`
            : "Publish content to unlock personalized growth insights."}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {recommendations.map((r, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${r.tone === "success" ? "bg-success/15" : r.tone === "warning" ? "bg-warning/15" : "bg-info/15"}`}><r.icon className={`w-4 h-4 ${r.tone === "success" ? "text-success" : r.tone === "warning" ? "text-warning" : "text-info"}`} /></div>
              <div className="flex-1">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.reason}</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate(r.to)}>{r.action} <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
