import React from "react";
import { cn } from "@/lib/utils";

export default function MetricCard({ label, value, change, icon: Icon, accent }) {
  const positive = typeof change === "string" ? change.startsWith("+") : change >= 0;
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-secondary/60 flex items-center justify-center">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      {change !== undefined && (
        <div className={cn("mt-1 text-xs font-medium", positive ? "text-success" : "text-destructive")}>
          {typeof change === "string" ? change : `${change > 0 ? "+" : ""}${change}%`}
        </div>
      )}
    </div>
  );
}
