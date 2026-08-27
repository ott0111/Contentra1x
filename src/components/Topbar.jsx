import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell, HelpCircle, Plus } from "lucide-react";
import CreateMenu from "@/components/CreateMenu";
import UpgradeModal from "@/components/UpgradeModal";

export default function Topbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [unread, setUnread] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => {});
    base44.entities.Notification.list("-created_date", 20).then(n => setUnread(n.filter(x => !x.read).length)).catch(() => {});
  }, []);

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar} className="lg:hidden text-muted-foreground hover:text-foreground p-1.5">
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/app")}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground hover:text-foreground w-64"
        >
          <Search className="w-4 h-4" />
          <span>Search…</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <Button size="sm" className="hidden sm:flex" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create
        </Button>
        <Button size="icon" variant="ghost" className="sm:hidden" onClick={() => setCreateOpen(true)}>
          <Plus className="w-5 h-5" />
        </Button>
        <button onClick={() => navigate("/app/notifications")} className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
          <Bell className="w-4.5 h-4.5" />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground hidden sm:block">
          <HelpCircle className="w-4.5 h-4.5" />
        </button>
        <button onClick={() => navigate("/app/settings")} className="ml-1 flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-secondary">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
            {(me?.full_name || me?.email || "U").charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">{me?.full_name || me?.email || "Account"}</span>
        </button>
      </div>

      <CreateMenu open={createOpen} onOpenChange={setCreateOpen} onUpgrade={() => setUpgradeOpen(true)} />
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </header>
  );
}
