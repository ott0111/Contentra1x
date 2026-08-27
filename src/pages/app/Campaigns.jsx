import CrudPage from "@/components/CrudPage";
import { Megaphone } from "lucide-react";
import { CAMPAIGN_STATUSES, PLATFORMS, CONTENT_GOALS } from "@/lib/constants";

export default function Campaigns() {
  return (
    <CrudPage
      entity="Campaign"
      title="Campaigns"
      description="Group content around a shared goal."
      icon={Megaphone}
      emptyTitle="No campaigns yet"
      emptyDescription="Create a campaign to organize related content."
      createLabel="New campaign"
      columns={[
        { key: "name", label: "Name" },
        { key: "goal", label: "Goal" },
        { key: "status", label: "Status", type: "badge" },
        { key: "start_date", label: "Start", type: "date" },
        { key: "end_date", label: "End", type: "date" },
        { key: "budget", label: "Budget", type: "currency" },
      ]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "goal", label: "Goal", type: "select", options: CONTENT_GOALS },
        { key: "start_date", label: "Start date", type: "date" },
        { key: "end_date", label: "End date", type: "date" },
        { key: "budget", label: "Budget", type: "number" },
        { key: "status", label: "Status", type: "select", options: CAMPAIGN_STATUSES },
      ]}
      filters={[{ key: "status", label: "status", options: CAMPAIGN_STATUSES }]}
    />
  );
}
