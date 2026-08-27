import CrudPage from "@/components/CrudPage";
import { FolderOpen } from "lucide-react";
import { CLIENT_STATUSES } from "@/lib/constants";

export default function Clients() {
  return (
    <CrudPage
      entity="Client"
      title="Clients"
      description="Manage client workspaces (agency mode)."
      icon={FolderOpen}
      emptyTitle="No clients yet"
      emptyDescription="Add a client to manage their content and campaigns."
      createLabel="Add client"
      columns={[
        { key: "company", label: "Company" },
        { key: "contact", label: "Contact" },
        { key: "industry", label: "Industry" },
        { key: "status", label: "Status", type: "badge" },
      ]}
      fields={[
        { key: "company", label: "Company", required: true },
        { key: "contact", label: "Contact" },
        { key: "email", label: "Email" },
        { key: "website", label: "Website" },
        { key: "industry", label: "Industry" },
        { key: "status", label: "Status", type: "select", options: CLIENT_STATUSES },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      filters={[{ key: "status", label: "status", options: CLIENT_STATUSES }]}
    />
  );
}
