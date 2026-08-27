import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PLANS = [
  { name: "Free", price: 0, annual: 0, desc: "For getting started", features: ["Basic dashboard","25 ideas","15 AI generations / month","Basic calendar","Basic analytics","2 social accounts","Basic templates"], cta: "Start free" },
  { name: "Pro", price: 19.99, annual: 15.99, desc: "For serious creators", features: ["Unlimited ideas","Advanced AI & repurposing","Content Studio","Advanced calendar","Advanced analytics & growth intelligence","Goals & trends","Competitor tracking","8 social accounts","Advanced templates"], cta: "Start 7-day trial", featured: true },
  { name: "Business", price: 49.99, annual: 39.99, desc: "For teams & agencies", features: ["Everything in Pro","Teams & multiple workspaces","Client management","Brand deal tracking","Revenue tools","Campaign reporting","Priority support"], cta: "Start trial" },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"><span className="text-primary-foreground font-bold text-sm">C</span></div>
            <span className="font-semibold tracking-tight">Contentra</span>
          </Link>
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-semibold tracking-tight">Pricing that scales with you</h1>
          <p className="text-muted-foreground mt-3">Start free. Upgrade when you're ready to go all-in.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 ${p.featured ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              {p.featured && <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-primary text-primary-foreground mb-3">Recommended</span>}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">${p.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">or ${p.annual}/mo billed annually</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /><span className="text-muted-foreground">{f}</span></li>
                ))}
              </ul>
              <Link to="/register" className="block mt-6"><Button className="w-full" variant={p.featured ? "default" : "outline"}>{p.cta}</Button></Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">Billing is processed securely when a payment provider is connected. No charges until then.</p>
      </div>
    </div>
  );
}
