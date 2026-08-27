import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CONTENT = {
  terms: { title: "Terms of Service", body: "These Terms of Service govern your use of Contentra. By using the platform you agree to these terms. This is placeholder legal copy and should be replaced with finalized terms reviewed by counsel before launch." },
  privacy: { title: "Privacy Policy", body: "This Privacy Policy explains how Contentra collects, uses, and protects your information. We never expose your passwords, OAuth tokens, or private billing data to other users. This is placeholder copy — replace with finalized policy." },
  cookies: { title: "Cookie Policy", body: "Contentra uses essential cookies to operate and optional cookies to improve your experience. This is placeholder copy — replace with a finalized cookie policy." },
  refund: { title: "Refund Policy", body: "Subscription fees are generally non-refundable. You may cancel at any time and retain access until the end of your billing period. This is placeholder copy — replace with a finalized refund policy." },
};

export default function Legal({ kind = "terms" }) {
  const c = CONTENT[kind] || CONTENT.terms;
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
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-8 text-muted-foreground leading-relaxed">{c.body}</div>
        <p className="mt-6 text-xs text-muted-foreground/70">Note: This is placeholder content. Do not claim legal compliance without finalized documents.</p>
      </div>
    </div>
  );
}
