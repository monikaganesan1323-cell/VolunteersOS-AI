"use client";

import { useEffect, useState } from "react";
import { Sparkles, Send, Users, FileText, Search, BarChart3, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssistant } from "@/hooks/use-assistant";

const suggestions = [
  { icon: FileText, label: "Generate this week's report" },
  { icon: Users, label: "Find volunteers for Blood Donation Camp" },
  { icon: Search, label: "Create a new event" },
  { icon: Award, label: "Generate pending certificates" },
  { icon: BarChart3, label: "Summarize July analytics" },
];

// Mock "last seen" state — in a real build this comes from the user's session record.
const DAYS_INACTIVE = 6;
const SCORE_BEFORE = 92;
const SCORE_AFTER = 86;

const inactivityReasons = [
  "Busy with exams / work",
  "Traveling",
  "Personal reasons",
  "Just needed a break",
];

export default function ChatbotPage() {
  const { messages, setMessages, pending, send } = useAssistant(
    "Hi Monika! I'm your VolunteerOS AI assistant. Ask me to generate reports, match volunteers to events, draft certificates, or summarize analytics."
  );
  const [input, setInput] = useState("");
  const [askedInactivity, setAskedInactivity] = useState(false);
  const [reasonGiven, setReasonGiven] = useState(false);

  // On login, if there's been a real gap since last activity, the assistant opens with a check-in.
  useEffect(() => {
    if (DAYS_INACTIVE < 3) return;
    const timer = setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: `Welcome back — it's been ${DAYS_INACTIVE} days since your last check-in or event activity. Everything okay? Just so you know, your Passport leadership score dipped a little from consistency: ${SCORE_BEFORE} → ${SCORE_AFTER}. It recovers quickly once you're active again, so no need to worry.`,
        },
      ]);
      setAskedInactivity(true);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSend(text: string) {
    if (!text.trim()) return;
    setInput("");
    void send(text);
  }

  function sendReason(reason: string) {
    setMessages((m) => [
      ...m,
      { from: "user", text: reason },
      {
        from: "ai",
        text: `Got it, thanks for letting me know. I've noted "${reason}" against the gap so it won't count against your streak history. Want me to suggest a few upcoming events near you to help your score bounce back?`,
      },
    ]);
    setReasonGiven(true);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink dark:text-crema-50">
          <Sparkles size={22} className="text-espresso-500" /> AI Assistant
        </h1>
        <p className="text-sm text-muted-foreground">Ask anything about your volunteers, events, or program performance.</p>
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

          {pending && (
            <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              …
            </div>
          )}

          {askedInactivity && !reasonGiven && (
            <div className="flex flex-wrap gap-2 pl-1">
              {inactivityReasons.map((r) => (
                <button
                  key={r}
                  onClick={() => sendReason(r)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-espresso-700 transition-colors hover:bg-espresso-50 dark:text-crema-200 dark:hover:bg-white/5"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border p-3">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSend(s.label)}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-espresso-700 hover:bg-espresso-50 dark:text-crema-200 dark:hover:bg-white/5"
            >
              <s.icon size={12} /> {s.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 border-t border-border p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the assistant..."
            className="h-11 flex-1 rounded-xl border border-border bg-muted/60 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" size="icon" disabled={pending}><Send size={16} /></Button>
        </form>
      </Card>
    </div>
  );
}
