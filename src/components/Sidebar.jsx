import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, Lightbulb, PenSquare, Calendar, FolderOpen, LayoutTemplate,
  Sparkles, Repeat2, BrainCircuit, BarChart3, TrendingUp, Compass, Users2, Trophy,
  Handshake, DollarSign, Megaphone, Bell, Settings, CreditCard, ChevronLeft, ChevronRight,
  PanelLeftClose,
} from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/6a8ee261fe7625b02013b40a/3119203af_2B3A2A23-0C6D-4349-8BF9-AF9EC3BD400F.png";

const PLAN_LEVELS = { free: 0, pro: 1, business: 2 };

const SECTIONS = [
  {
    label: "Main",
    items: [
      { to: "/app", label: "Command Center", icon: LayoutDashboard, end: true },
      { to: "/app/ideas", label: "Ideas", icon: Lightbulb },
      { to: "/app/content", label: "Content Studio", icon: PenSquare },
      { to: "/app/calendar", label: "Calendar", icon: Calendar },
      { to: "/app/library", label: "Library", icon: FolderOpen },
      { to: "/app/templates", label: "Templates", icon: LayoutTemplate },
    ],
  },
  {
    label: "AI",
    items: [
      { to: "/app/ai", label: "Contentra AI", icon: Sparkles },
      { to: "/app/repurpose", label: "Repurpose", icon: Repeat2 },
      { to: "/app/strategy", label: "AI Strategy", icon: BrainCircuit },
    ],
  },
  {
    label: "Growth",
    items: [
      { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/app/growth", label: "Growth Intelligence", icon: TrendingUp },
      { to: "/app/trends", label: "Trends", icon: Compass },
      { to: "/app/competitors", label: "Competitors", icon: Users2 },
      { to: "/app/goals", label: "Goals", icon: Trophy },
    ],
  },
  {
    label: "Business",
    minPlan: "business",
    items: [
      { to: "/app/brand-deals", label: "Brand Deals", icon: Handshake },
      { to: "/app/revenue", label: "Revenue", icon: DollarSign },
      { to: "/app/campaigns", label: "Campaigns", icon: Megaphone },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/app/team", label: "Team", icon: Users2, minPlan: "business" },
      { to: "/app/clients", label: "Clients", icon: FolderOpen },
      { to: "/app/notifications", label: "Notifications", icon: Bell },
      { to: "/app/settings", label: "Settings", icon: Settings },
      { to: "/app/billing", label: "Billing", icon: CreditCard },
    ],
  },
];

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    base44.auth.me().then((me) => setPlan(me?.plan || "free")).catch(() => {});
  }, []);

  const userLevel = PLAN_LEVELS[plan] ?? 0;
  const canAccess = (minPlan) => !minPlan || (PLAN_LEVELS[minPlan] ?? 0) <= userLevel;

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onCloseMobile} />}
      <aside
        className={cn(
          "z-50 h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200",
          "fixed lg:static inset-y-0 left-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-[68px]" : "lg:w-[240px]",
          "w-[240px]"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
          <NavLink to="/app" className="flex items-center gap-2.5" onClick={onCloseMobile}>
            <img src={LOGO_URL} alt="Contentra" className="w-7 h-7 rounded-lg object-cover shrink-0" />
            {!collapsed && <span className="font-semibold text-foreground tracking-tight">Contentra</span>}
          </NavLink>
          <button onClick={onToggleCollapse} className="hidden lg:block text-muted-foreground hover:text-foreground">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          {SECTIONS.map((section) => {
            if (!canAccess(section.minPlan)) return null;
            const items = section.items.filter((item) => canAccess(item.minPlan));
            if (items.length === 0) return null;
            return (
              <div key={section.label} className="mb-4">
                {!collapsed && (
                  <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={onCloseMobile}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-foreground"
                            : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/60",
                          collapsed && "lg:justify-center"
                        )
                      }
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border shrink-0">
          <NavLink
            to="/app/billing"
            onClick={onCloseMobile}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary/50 transition-colors",
              collapsed && "lg:justify-center"
            )}
          >
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">Upgrade to Pro</p>
                <p className="text-[11px] text-muted-foreground truncate">Unlock unlimited AI</p>
              </div>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
