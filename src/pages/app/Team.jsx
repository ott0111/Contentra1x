import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Users2, UserPlus, Loader2, Crown } from "lucide-react";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [inviting, setInviting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [u, list] = await Promise.all([
        base44.auth.me().catch(() => null),
        base44.entities.User.list("-created_date", 50).catch(() => []),
      ]);
      setMe(u); setMembers(list);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const invite = async () => {
    if (!email.trim()) return;
    setInviting(true);
    try { await base44.users.inviteUser(email.trim(), role); setEmail(""); setInviteOpen(false); load(); }
    catch (e) { alert(e?.message || "Could not invite user"); }
    finally { setInviting(false); }
  };

  const isAdmin = me?.role === "admin";

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Team" description="Invite teammates and manage roles.">
        {isAdmin && <Button onClick={() => setInviteOpen(true)}><UserPlus className="w-4 h-4 mr-1" /> Invite member</Button>}
      </PageHeader>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        : members.length === 0 ? <div className="rounded-xl border border-border bg-card"><EmptyState icon={Users2} title="No team members" description="Invite teammates to collaborate on content." /></div>
        : <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary">{(m.full_name || m.email || "U").charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{m.full_name || "Unnamed"} {m.id === me?.id && <span className="text-xs text-muted-foreground">(you)</span>}</p>
                <p className="text-xs text-muted-foreground truncate">{m.email}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground"><Crown className="w-3 h-3" /> {m.role || "user"}</span>
            </div>
          ))}
        </div>}
      {!isAdmin && <p className="text-xs text-muted-foreground/70 mt-4">Only workspace admins can invite members.</p>}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Invite team member</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Email</Label><Input className="mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@email.com" /></div>
            <div><Label>Role</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value)}><option value="user">Member</option><option value="admin">Admin</option></select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button><Button onClick={invite} disabled={inviting}>{inviting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Send invite</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
