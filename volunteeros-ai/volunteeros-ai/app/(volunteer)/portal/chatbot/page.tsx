"use client";

import { useState } from "react";
import { Sparkles, Send, CalendarSearch, Award, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentVolunteer } from "@/components/portal/sidebar";

const suggestions = [
  { icon: CalendarSearch, label: "Find an event near me" },
  { icon: Award, label: "When is my next certificate due?" },
  { icon: HelpCircle, label: "How do I improve my leadership score?" },
];

export default function PortalChatbotPage() {
  const [messages, setMessages] = useState([
    { from: "ai", text: `Hi ${currentVolunteer.name.split(" ")[0]}! I'm your VolunteerOS AI assistant. Ask me about events, your passport score, or certificates.` },
  ]);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "ai", text: "Here's what I found based on your volunteer profile — this is a demo response for the hackathon build." },
      ]);
    }, 700);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink dark:text-crema-50">
          <Sparkles size={22} className="text-espresso-500" /> Ask AI
        </h1>
        <p className="text-sm text-muted-foreground">Your personal assistant for events, passport score, and certificates.</p>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-thin">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.from === "ai" ? "bg-muted text-foreground" : "ml-auto bg-espresso-600 text-crema-50"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border p-3">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => send(s.label)}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-espresso-700 hover:bg-espresso-50 dark:text-crema-200 dark:hover:bg-white/5"
            >
              <s.icon size={12} /> {s.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the assistant..."
            className="h-11 flex-1 rounded-xl border border-border bg-muted/60 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" size="icon"><Send size={16} /></Button>
        </form>
      </Card>
    </div>
  );
}
