import React from "react";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  // idea / content
  "Idea": "bg-secondary text-muted-foreground",
  "Developing": "bg-secondary text-muted-foreground",
  "Planned": "bg-info/15 text-info",
  "In Progress": "bg-info/15 text-info",
  "Draft": "bg-secondary text-muted-foreground",
  "Review": "bg-warning/15 text-warning",
  "Approved": "bg-success/15 text-success",
  "Scheduled": "bg-info/15 text-info",
  "Published": "bg-success/15 text-success",
  "Archived": "bg-secondary text-muted-foreground",
  // deal
  "Prospect": "bg-secondary text-muted-foreground",
  "Negotiating": "bg-warning/15 text-warning",
  "Accepted": "bg-info/15 text-info",
  "Creating": "bg-info/15 text-info",
  "Submitted": "bg-info/15 text-info",
  "Paid": "bg-success/15 text-success",
  "Cancelled": "bg-destructive/15 text-destructive",
  // priority
  "High": "bg-destructive/15 text-destructive",
  "Medium": "bg-warning/15 text-warning",
  "Low": "bg-secondary text-muted-foreground",
  // campaign
  "Planning": "bg-secondary text-muted-foreground",
  "Active": "bg-success/15 text-success",
  "Completed": "bg-info/15 text-info",
  // goal
  "On Track": "bg-success/15 text-success",
  "Behind": "bg-warning/15 text-warning",
  "At Risk": "bg-destructive/15 text-destructive",
  "Not Started": "bg-secondary text-muted-foreground",
  "Completed ": "bg-info/15 text-info",
};

export default function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "bg-secondary text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium", cls)}>
      {status}
    </span>
  );
}
