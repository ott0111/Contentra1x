import React, { useState, useEffect } from "react";
import CrudPage from "@/components/CrudPage";
import MetricCard from "@/components/MetricCard";
import { DollarSign } from "lucide-react";
import { REVENUE_SOURCES, PLATFORMS } from "@/lib/constants";
import { base44 } from "@/api/base44Client";

const FIELDS = [
  { key: "amount", label: "Amount", type: "number", required: true },
  { key: "source", label: "Source", type: "select", options: REVENUE_SOURCES, required: true },
  { key: "platform", label: "Platform", type: "select", options: PLATFORMS },
  { key: "date", label: "Date", type: "date" },
  { key: "campaign", label: "Campaign" },
  { key: "notes", label: "Notes", type: "textarea" },
];

const COLUMNS = [
  { key: "amount", label: "Amount", type: "currency" },
  { key: "source", label: "Source" },
  { key: "platform", label: "Platform" },
  { key: "date", label: "Date", type: "date" },
];

export default function Revenue() {
  const [items, setItems] = useState([]);
  useEffect(() => { base44.entities.Revenue.list("-updated_date", 100).then(setItems).catch(() => {}); }, []);

  const total = items.reduce((s, r) => s + (r.amount || 0), 0);
  const bySource = {};
  items.forEach((r) => { bySource[r.source] = (bySource[r.source] || 0) + (r.amount || 0); });
  const topSource = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <div className="p-6 lg:p-8 pb-0">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard label="Total revenue" value={`$${total.toLocaleString()}`} icon={DollarSign} />
          <MetricCard label="Entries" value={items.length} icon={DollarSign} />
          <MetricCard label="Top source" value={topSource ? topSource[0] : "—"} icon={DollarSign} />
        </div>
      </div>
      <CrudPage entity="Revenue" title="Revenue" description="Track income across all your revenue streams." icon={DollarSign} emptyTitle="No revenue logged" emptyDescription="Add a revenue entry to start tracking income." createLabel="Add revenue" columns={COLUMNS} fields={FIELDS} filters={[{ key: "source", label: "source", options: REVENUE_SOURCES }]} />
    </div>
  );
}
