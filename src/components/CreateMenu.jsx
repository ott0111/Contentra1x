import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lightbulb, PenSquare, Megaphone, Trophy, Handshake, DollarSign, Sparkles } from "lucide-react";

const OPTIONS = [
  { label: "New Idea", to: "/app/ideas?new=1", icon: Lightbulb, hint: "Capture a content idea" },
  { label: "New Content", to: "/app/content?new=1", icon: PenSquare, hint: "Start in Content Studio" },
  { label: "New Campaign", to: "/app/campaigns?new=1", icon: Megaphone, hint: "Group content around a goal" },
  { label: "New Goal", to: "/app/goals?new=1", icon: Trophy, hint: "Track a growth target" },
  { label: "New Brand Deal", to: "/app/brand-deals?new=1", icon: Handshake, hint: "Track a sponsorship" },
  { label: "New Revenue Entry", to: "/app/revenue?new=1", icon: DollarSign, hint: "Log income" },
];

export default function CreateMenu({ open, onOpenChange }) {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md gap-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Create new</DialogTitle>
        </DialogHeader>
        <div className="p-3">
          {OPTIONS.map((o) => (
            <button
              key={o.label}
              onClick={() => { onOpenChange(false); navigate(o.to); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <o.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{o.label}</p>
                <p className="text-xs text-muted-foreground">{o.hint}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
