import React, { useState, useEffect } from "react";
import CrudPage from "@/components/CrudPage";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import { Handshake, DollarSign, Clock, CheckCircle } from "lucide-react";
import { DEAL_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import { base44 } from "@/api/base44Client";

const FIELDS = [
  { key: "brand", label: "Brand", required: true },
  { key: "contact", label: "Contact" },
  { key: "campaign", label: "Campaign" },
  { key: "deal_value", label: "Deal value", type: "number" },
  { key: "currency", label: "Currency" },
  { key: "deadline", label: "Deadline", type: "date" },
  { key: "deliverables", label: "Deliverables", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: DEAL_STATUSES },
  { key: "payment_status", label: "Payment status", type: "select", options: PAYMENT_STATUSES },
  { key: "notes", label: "Notes", type: "textarea" },
];

const COLUMNS = [
  { key: "brand", label: "Brand" },
  { key: "deal_value", label: "Value", type: "currency" },
  { key: "status", label: "Status", type: "badge" },
  { key: "payment_status", label: "Payment", type: "badge" },
  { key: "deadline", label: "Deadline", type: "date" },
];

export default function BrandDeals() {
  const [deals, setDeals] = useState([]);
  useEffect(() => { base44.entities.BrandDeal.list("-updated_date", 100).then(setDeals).catch(() => {}); }, []);

  const active = deals.filter((d) => !["Paid", "Cancelled"].includes(d.status)).length;
  const pending = deals.filter((d) => d.payment_status !== "Paid" && d.status !== "Cancelled").length;
  const revenue = deals.filter((d) => d.payment_status === "Paid").reduce((s, d) => s + (d.deal_value || 0), 0);
  const completed = deals.filter((d) => d.status === "Paid").length;

  return (
    <div>
      <div className="p-6 lg:p-8 pb-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Active deals" value={active} icon={Handshake} />
          <MetricCard label="Pending payments" value={pending} icon={Clock} />
          <MetricCard label="Revenue" value={`$${revenue.toLocaleString()}`} icon={DollarSign} />
          <MetricCard label="Completed" value={completed} icon={CheckCircle} />
        </div>
      </div>
      <CrudPage entity="BrandDeal" title="Brand Deals" description="Track sponsorships and partnerships." icon={Handshake} emptyTitle="No brand deals yet" emptyDescription="Add a sponsorship to start tracking deals and payments." createLabel="New deal" columns={COLUMNS} fields={FIELDS} filters={[{ key: "status", label: "status", options: DEAL_STATUSES }]} />
    </div>
  );
}
