import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function About() {
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
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-semibold tracking-tight">About Contentra</h1>
        <p className="text-lg text-muted-foreground mt-4">Contentra is the operating system for creators — a single workspace to plan, create, publish, analyze, and grow content across every platform.</p>
        <div className="prose prose-invert max-w-none mt-10 space-y-6 text-muted-foreground">
          <div>
            <h2 className="text-foreground text-xl font-semibold">Why we built it</h2>
            <p className="mt-2">Creators juggle a dozen disconnected tools — notes apps, spreadsheets, schedulers, analytics dashboards. Contentra replaces that mess with one connected system where ideas become content, content becomes calendar events, and performance becomes your next idea.</p>
          </div>
          <div>
            <h2 className="text-foreground text-xl font-semibold">Who it's for</h2>
            <p className="mt-2">From solo creators and influencers to agencies managing multiple client brands — anyone who treats content as a craft and a business.</p>
          </div>
          <div>
            <h2 className="text-foreground text-xl font-semibold">Our mission</h2>
            <p className="mt-2">Give every creator the same operational firepower that big studios and agencies have — powered by AI that actually understands their context, and data they can trust.</p>
          </div>
        </div>
        <Link to="/register" className="inline-block mt-10"><Button size="lg">Get started free</Button></Link>
      </div>
    </div>
  );
}
