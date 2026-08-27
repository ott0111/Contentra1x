import CrudPage from "@/components/CrudPage";
import { Users2 } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";

export default function Competitors() {
  return (
    <CrudPage
      entity="Competitor"
      title="Competitors"
      description="Track other creators in your niche (manual tracking — API-ready)."
      icon={Users2}
      emptyTitle="No competitors tracked"
      emptyDescription="Add creators to monitor their content and learn from what works."
      createLabel="Add competitor"
      columns={[
        { key: "name", label: "Name" },
        { key: "username", label: "Username" },
        { key: "platform", label: "Platform", type: "badge" },
        { key: "category", label: "Category" },
      ]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "username", label: "Username" },
        { key: "platform", label: "Platform", type: "select", options: PLATFORMS },
        { key: "profile_url", label: "Profile URL" },
        { key: "category", label: "Category" },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
