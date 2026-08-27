import React from "react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import { Sparkles } from "lucide-react";

export default function ComingSoon({ title, description }) {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title={title} description={description} />
      <div className="rounded-xl border border-border bg-card">
        <EmptyState
          icon={Sparkles}
          title="In active development"
          description="This module is part of Contentra's connected workflow and will be wired up next. The data model and navigation are already in place."
        />
      </div>
    </div>
  );
}
