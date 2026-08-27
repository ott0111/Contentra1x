import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Lightbulb, Calendar, BarChart3, Repeat2, Users2, ArrowRight,
  Check, Zap, BrainCircuit,
} from "lucide-react";

const FEATURES = [
  { icon: Lightbulb, title: "Idea Hub", desc: "Capture, organize, and prioritize every content idea in one place." },
  { icon: Sparkles, title: "Contentra AI", desc: "Generate ideas, scripts, hooks, and captions tuned to your niche." },
  { icon: Calendar, title: "Content Calendar", desc: "Plan and schedule across every platform with a unified calendar." },
  { icon: BarChart3, title: "Analytics", desc: "Understand what's working with clean, actionable performance data." },
  { icon: Repeat2, title: "Repurposing", desc: "Turn one video into a week of posts across every platform." },
  { icon: Users2, title: "Team & Agency", desc: "Collaborate, approve, and manage multiple client workspaces." },
];

const STEPS = [
  { n: "01", title: "Discover", desc: "Find trends and opportunities in your niche." },
  { n: "02", title: "Create", desc: "Turn ideas into polished scripts and captions with AI." },
  { n: "03", title: "Publish", desc: "Schedule and ship across every platform." },
  { n: "04", title: "Grow", desc: "Analyze performance and let AI guide your next move." },
];

const PLANS = [
  { name: "Free", price: "$0", period: "/mo", desc: "For getting started", features: ["Basic dashboard","25 ideas","15 AI generations","Basic calendar","Basic analytics"], cta: "Start free" },
  { name: "Pro", price: "$19.99", period: "/mo", desc: "For serious creators", features: ["Unlimited ideas","Advanced AI & repurposing","Content Studio","Advanced analytics","Goals & trends","Competitor tracking"], cta: "Start 7-day trial", featured: true },
  { name: "Business", price: "$49.99", period: "/mo", desc: "For teams & agencies", features: ["Everything in Pro","Teams & workspaces","Client management","Brand deals & revenue","Campaign reporting","Priority support"], cta: "Start trial" },
];

const FAQ = [
  { q: "Do I need connected social accounts?", a: "No. Contentra works fully with manual entry and AI. Connect platforms later for automated analytics — we never pretend data is live when it isn't." },
  { q: "Can I cancel anytime?", a: "Yes. Your subscription can be canceled at any time and you keep access until the end of your billing period." },
  { q: "Is my data private?", a: "Absolutely. You only ever see your own workspace data. We never expose passwords, tokens, or private billing information." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/6a8ee261fe7625b02013b40a/3119203af_2B3A2A23-0C6D-4349-8BF9-AF9EC3BD400F.png" alt="Contentra" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-semibold tracking-tight">Contentra</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link to="/about" className="hover:text-foreground">About</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/register"><Button size="sm">Start free</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/40 text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> The Creator Operating System
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl mx-auto leading-[1.05]">
            The Operating System <br className="hidden sm:block" /> for <span className="text-primary">Creators</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan, create, publish, analyze, and grow your content — all from one powerful workspace.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/register"><Button size="lg">Start for Free <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            <Link to="/pricing"><Button size="lg" variant="outline">Explore Contentra</Button></Link>
          </div>

          {/* Product preview mock */}
          <div className="mt-16 rounded-2xl border border-border bg-card p-2 max-w-5xl mx-auto shadow-2xl">
            <div className="rounded-xl bg-background border border-border overflow-hidden">
              <div className="flex">
                <div className="w-48 border-r border-border p-4 hidden sm:block">
                  <div className="h-3 w-24 rounded bg-secondary mb-4" />
                  {[1,2,3,4,5].map(i => <div key={i} className="h-7 rounded bg-secondary/40 mb-1.5" />)}
                </div>
                <div className="flex-1 p-5 text-left">
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {["Total views","Followers","Engagement"].map((l,i) => (
                      <div key={l} className="rounded-lg border border-border bg-card p-3">
                        <div className="h-2 w-16 rounded bg-secondary mb-2" />
                        <div className="h-5 w-20 rounded bg-foreground/80" />
                        <div className={`h-2 w-10 rounded mt-1 ${i===0?"bg-success":i===1?"bg-info":"bg-warning"}`} />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4 h-40 flex items-end gap-2">
                    {[40,65,50,80,70,95,60,85,75,100,90,110].map((h,i) => (
                      <div key={i} className="flex-1 rounded-t bg-primary/30" style={{height:`${h}%`}} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loop */}
      <section className="border-t border-border py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center">One connected loop</h2>
          <p className="text-muted-foreground text-center mt-2 max-w-xl mx-auto">Discover → Idea → Create → Plan → Publish → Analyze → Grow</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-5">
                <span className="text-xs font-mono text-primary">{s.n}</span>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight">Everything in one workspace</h2>
            <p className="text-muted-foreground mt-2">Stop juggling six tools. Contentra connects your entire content workflow.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI band */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-10 text-center">
          <BrainCircuit className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-semibold tracking-tight">An AI that knows your creator context</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Contentra AI understands your niche, platforms, goals, and past performance — so every suggestion is actually relevant.</p>
          <Link to="/register" className="inline-block mt-6"><Button size="lg">Try Contentra AI <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-center mt-2">Start free. Upgrade when you're ready.</p>
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {PLANS.map((p) => (
              <div key={p.name} className={`rounded-2xl border p-6 ${p.featured ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                {p.featured && <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-primary text-primary-foreground mb-3">Recommended</span>}
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button className="w-full" variant={p.featured ? "default" : "outline"}>{p.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-medium">{f.q}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-semibold tracking-tight">Start building your content engine today</h2>
          <p className="text-muted-foreground mt-3">Free to start. No credit card required.</p>
          <Link to="/register" className="inline-block mt-6"><Button size="lg">Get started free <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/6a8ee261fe7625b02013b40a/3119203af_2B3A2A23-0C6D-4349-8BF9-AF9EC3BD400F.png" alt="Contentra" className="w-6 h-6 rounded-md object-cover" />
            <span>Contentra</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
          <span>© {new Date().getFullYear()} Contentra</span>
        </div>
      </footer>
    </div>
  );
}
