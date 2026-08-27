import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Compass, ArrowRight, Info } from "lucide-react";
import { DEMO_TRENDS } from "@/lib/constants";
import { base44 } from "@/api/base44Client";

export default function Trends() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(null);

  const createFromTrend = async (t) => {
    setCreating(t.topic);
    try {
      await base44.entities.Idea.create({ title: `${t.topic} content`, description: t.description, platform: t.platform, category: t.category, status: "Idea", estimated_potential: t.trend_strength > 80 ? "High" : "Medium" });
      navigate("/app/ideas");
    } finally { setCreating(null); }
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Trends" description="Spot rising topics and formats in your niche." />
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-info/10 border border-info/20 text-info text-xs mb-6">
        <Info className="w-4 h-4" /> Trend data shown is illustrative demo data, not live. Connect a trend API later for real-time signals.
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {DEMO_TRENDS.map((t, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{t.platform} · {t.category}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary" style={{ width: `${t.trend_strength}%` }} /></div>
                <span className="text-xs font-medium">{t.trend_strength}</span>
              </div>
            </div>
            <h3 className="font-semibold">{t.topic}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
            <Button size="sm" variant="outline" className="mt-4" onClick={() => createFromTrend(t)} disabled={creating === t.topic}>
              <Compass className="w-3.5 h-3.5 mr-1" /> Create content from trend <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
