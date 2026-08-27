import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";

export default function Settings() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => { base44.auth.me().then(setMe).catch(() => {}).finally(() => setLoading(false)); }, []);

  const patch = (p) => setMe((m) => ({ ...m, ...p }));
  const save = async () => { setSaving(true); try { await base44.auth.updateMe({ full_name: me.full_name, username: me.username, bio: me.bio, niche: me.niche, posting_frequency: me.posting_frequency }); setSavedAt(new Date()); } finally { setSaving(false); } };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <PageHeader title="Settings" description="Manage your profile, workspace, and preferences." />
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="social">Social accounts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-5 space-y-4">
            <div><Label>Full name</Label><Input className="mt-1.5" value={me?.full_name || ""} onChange={(e) => patch({ full_name: e.target.value })} /></div>
            <div><Label>Username</Label><Input className="mt-1.5" value={me?.username || ""} onChange={(e) => patch({ username: e.target.value })} /></div>
            <div><Label>Email</Label><Input className="mt-1.5" value={me?.email || ""} disabled /></div>
            <div><Label>Bio</Label><Textarea className="mt-1.5" rows={3} value={me?.bio || ""} onChange={(e) => patch({ bio: e.target.value })} /></div>
            <div className="flex items-center gap-3">
              <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save changes</Button>
              {savedAt && <span className="text-xs text-success">Saved</span>}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="workspace">
          <Card className="p-5 space-y-4">
            <div><Label>Workspace name</Label><Input className="mt-1.5" defaultValue={`${me?.full_name || "My"} Workspace`} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Default timezone</Label><Input className="mt-1.5" defaultValue="UTC" /></div>
              <div><Label>Currency</Label><select className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option></select></div>
            </div>
            <Button>Save workspace</Button>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-5">
            <p className="text-sm text-muted-foreground mb-4">Connect your social accounts to enable live analytics. Accounts are stored securely — we never store passwords.</p>
            <div className="space-y-2">
              {PLATFORMS.map((p) => (
                <div key={p} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40">
                  <div><p className="text-sm font-medium">{p}</p><p className="text-xs text-muted-foreground">Manual / Not connected</p></div>
                  <Button variant="outline" size="sm" disabled>Connect</Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/70 mt-4">OAuth integrations are prepared for future connection. No platform APIs are currently connected.</p>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-5 space-y-3">
            {["Scheduled post reminders","Goal updates","AI recommendations","Performance milestones","Team assignments"].map((n) => (
              <label key={n} className="flex items-center justify-between">
                <span className="text-sm">{n}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
              </label>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">Password and account security are managed through your authentication provider. Use the forgot-password flow to reset your password.</p>
            <Button variant="outline" onClick={() => base44.auth.logout("/")}>Sign out</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
