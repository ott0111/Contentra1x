import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { CREATOR_TYPES, PLATFORMS, NICHES } from "@/lib/constants";

const GOALS = ["Grow followers","Increase views","Increase engagement","Build a personal brand","Make money","Get sponsorships","Become consistent","Grow a business","Build an audience"];
const FREQUENCIES = ["Daily","A few times a week","Weekly","A few times a month","Monthly"];
const SIZES = ["Under 1K","1K–10K","10K–50K","50K–100K","100K–500K","500K+"];

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors ${active ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-border"}`}
    >
      {children}
    </button>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    full_name: "", username: "", bio: "", creator_type: "", platforms: [], niche: "", goals: [], frequency: "", audience_size: "", challenges: "", experience: "",
  });

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const toggle = (k, v) => setData((d) => ({ ...d, [k]: d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v] }));

  const steps = ["Welcome","Profile","Creator type","Platforms","Niche","Goals","Frequency","Audience","Workspace"];

  const canNext = () => {
    if (step === 1) return data.full_name.trim() && data.username.trim();
    if (step === 2) return data.creator_type;
    if (step === 3) return data.platforms.length > 0;
    if (step === 4) return data.niche;
    if (step === 5) return data.goals.length > 0;
    if (step === 6) return data.frequency;
    if (step === 7) return data.audience_size;
    return true;
  };

  const finish = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: data.full_name,
        username: data.username,
        bio: data.bio,
        creator_type: data.creator_type,
        platforms: data.platforms,
        niche: data.niche,
        goals: data.goals,
        posting_frequency: data.frequency,
        audience_size: data.audience_size,
        challenges: data.challenges,
        experience_level: data.experience,
        onboarding_complete: true,
      });
      navigate("/app", { replace: true });
    } catch (e) {
      console.error(e);
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-14 border-b border-border flex items-center px-6">
        <div className="flex items-center gap-2">
          <img src="https://media.base44.com/images/public/6a8ee261fe7625b02013b40a/3119203af_2B3A2A23-0C6D-4349-8BF9-AF9EC3BD400F.png" alt="Contentra" className="w-7 h-7 rounded-lg object-cover" />
          <span className="font-semibold tracking-tight">Contentra</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-1.5 mb-8">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`} />
            ))}
          </div>

          {step === 0 && (
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Welcome to Contentra</h1>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">The operating system for creators. Let's set up your workspace — it takes about a minute.</p>
              <Button className="mt-8" size="lg" onClick={() => setStep(1)}>Get started <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Your profile</h2>
              <p className="text-muted-foreground mt-1">This is how you'll appear in your workspace.</p>
              <div className="space-y-4 mt-6">
                <div><Label>Full name *</Label><Input className="mt-1.5" value={data.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Alex Rivera" /></div>
                <div><Label>Username *</Label><Input className="mt-1.5" value={data.username} onChange={(e) => set("username", e.target.value)} placeholder="alexrivera" /></div>
                <div><Label>Bio</Label><Textarea className="mt-1.5" rows={2} value={data.bio} onChange={(e) => set("bio", e.target.value)} placeholder="A short creator bio" /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">What type of creator are you?</h2>
              <p className="text-muted-foreground mt-1">We'll tailor your workspace accordingly.</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {CREATOR_TYPES.map((c) => <Chip key={c} active={data.creator_type === c} onClick={() => set("creator_type", c)}>{c}</Chip>)}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Which platforms do you use?</h2>
              <p className="text-muted-foreground mt-1">Select all that apply.</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {PLATFORMS.map((p) => <Chip key={p} active={data.platforms.includes(p)} onClick={() => toggle("platforms", p)}>{p}</Chip>)}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">What's your niche?</h2>
              <p className="text-muted-foreground mt-1">This helps Contentra AI personalize suggestions.</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {NICHES.map((n) => <Chip key={n} active={data.niche === n} onClick={() => set("niche", n)}>{n}</Chip>)}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">What are your primary goals?</h2>
              <p className="text-muted-foreground mt-1">Select all that apply.</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {GOALS.map((g) => <Chip key={g} active={data.goals.includes(g)} onClick={() => toggle("goals", g)}>{g}</Chip>)}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">How often do you post?</h2>
              <div className="flex flex-wrap gap-2 mt-6">
                {FREQUENCIES.map((f) => <Chip key={f} active={data.frequency === f} onClick={() => set("frequency", f)}>{f}</Chip>)}
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">What's your current audience size?</h2>
              <div className="flex flex-wrap gap-2 mt-6">
                {SIZES.map((s) => <Chip key={s} active={data.audience_size === s} onClick={() => set("audience_size", s)}>{s}</Chip>)}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-5">
                <Check className="w-7 h-7 text-success" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Your workspace is ready</h1>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">We've personalized Contentra for {data.niche || "your niche"} on {data.platforms.join(", ") || "your platforms"}.</p>
              <Button className="mt-8" size="lg" onClick={finish} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Enter Contentra <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          )}

          {step > 0 && step < 8 && (
            <div className="flex items-center justify-between mt-10">
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>Continue <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
