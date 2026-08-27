import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Loader2 } from "lucide-react";
import UpgradeModal from "@/components/UpgradeModal";
import { checkLimit } from "@/lib/plans";

const SUGGESTIONS = [
  "Give me 10 content ideas for my niche",
  "Turn this idea into a short-form script",
  "What should I post this week?",
  "Give me better hooks for my last video",
  "Analyze my content strategy",
];

export default function AIChat({ systemContext, feature = "chat", suggestions = SUGGESTIONS, placeholder = "Ask Contentra AI…" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [upgrade, setUpgrade] = useState({ open: false, message: "" });
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const prompt = text || input;
    if (!prompt.trim() || loading) return;

    // Entitlement check (client-side architecture)
    try {
      const limit = await checkLimit("aiGenerations");
      if (limit.reached) {
        setUpgrade({ open: true, message: "You've reached your monthly AI generation limit. Upgrade to Pro for more." });
        return;
      }
    } catch {}

    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setInput("");
    setLoading(true);
    try {
      const full = systemContext ? `${systemContext}\n\nUser request: ${prompt}` : prompt;
      const res = await base44.functions.invoke("contentraAI", { prompt: full, feature });
      const content = res?.data?.result || "I couldn't generate a response right now. Please try again.";
      setMessages((m) => [...m, { role: "assistant", content }]);
      base44.entities.AIUsage.create({ feature, request_type: "prompt", success: true }).catch(() => {});
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Contentra AI is unavailable right now. Please try again in a moment." }]);
      base44.entities.AIUsage.create({ feature, request_type: "prompt", success: false }).catch(() => {});
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">How can I help you grow today?</h2>
            <p className="text-sm text-muted-foreground mt-1">Ask me anything about your content, strategy, or audience.</p>
            <div className="grid sm:grid-cols-2 gap-2 mt-6 text-left">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-secondary text-sm text-foreground">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl bg-card border border-border flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Thinking…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="border-t border-border p-3">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={placeholder} rows={1} className="resize-none min-h-[44px] max-h-32" />
          <Button onClick={() => send()} disabled={loading || !input.trim()} size="icon" className="h-11 w-11 shrink-0"><Send className="w-4 h-4" /></Button>
        </div>
      </div>
      <UpgradeModal open={upgrade.open} onOpenChange={(o) => setUpgrade({ ...upgrade, open: o })} message={upgrade.message} />
    </div>
  );
}
