import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FolderOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function Library() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("ideas");
  const [search, setSearch] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [content, setContent] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [i, c, t] = await Promise.all([
          base44.entities.Idea.list("-updated_date", 100),
          base44.entities.Content.list("-updated_date", 100),
          base44.entities.Template.list("-updated_date", 100),
        ]);
        setIdeas(i); setContent(c); setTemplates(t);
      } finally { setLoading(false); }
    })();
  }, []);

  const items = useMemo(() => {
    let list = tab === "ideas" ? ideas : tab === "content" ? content : templates;
    if (search) list = list.filter((x) => (x.title || x.name || "").toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [tab, search, ideas, content, templates]);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Library" description="Everything you've created, in one place." />

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="ideas">Ideas ({ideas.length})</TabsTrigger>
            <TabsTrigger value="content">Content ({content.length})</TabsTrigger>
            <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="pl-9" /></div>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        : items.length === 0 ? <div className="rounded-xl border border-border bg-card"><EmptyState icon={FolderOpen} title="Nothing here yet" description="Create ideas, content, or templates to fill your library." /></div>
        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => {
            const title = it.title || it.name;
            const sub = it.platform || it.category || "";
            const to = tab === "ideas" ? `/app/ideas/${it.id}` : tab === "content" ? `/app/content/${it.id}` : "/app/templates";
            return (
              <button key={it.id} onClick={() => navigate(to)} className="text-left rounded-xl border border-border bg-card p-4 hover:border-primary/40">
                {it.status && <div className="mb-2"><StatusBadge status={it.status} /></div>}
                <h3 className="font-medium line-clamp-2">{title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{sub}{it.updated_date ? ` · ${format(new Date(it.updated_date), "MMM d")}` : ""}</p>
              </button>
            );
          })}
        </div>}
    </div>
  );
}
