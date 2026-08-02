"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Users, FileText, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssistant } from "@/hooks/use-assistant";

const suggestions = [
  { icon: FileText, label: "Generate report" },
  { icon: Users, label: "Find volunteers" },
  { icon: Search, label: "Create event" },
  { icon: BarChart3, label: "Analytics summary" },
];

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const { messages, pending, send } = useAssistant(
    "Hi Monika! I'm your VolunteerOS AI assistant. I can generate reports, match volunteers, and summarize analytics — what do you need?"
  );
  const [input, setInput] = useState("");

  function handleSend(text: string) {
    if (!text.trim()) return;
    setInput("");
    void send(text);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-warm-lg"
          >
            <div className="flex items-center justify-between bg-espresso-600 px-5 py-4 text-crema-50">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <span className="font-display text-sm font-semibold">VolunteerOS Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "ai"
                      ? "bg-muted text-foreground"
                      : "ml-auto bg-espresso-600 text-crema-50"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {pending && (
                <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">
                  …
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
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the assistant..."
                className="h-10 flex-1 rounded-xl border border-border bg-muted/60 px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" size="icon" disabled={pending}>
                <Send size={15} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-espresso-600 text-crema-50 shadow-warm-lg"
        aria-label="Open AI assistant"
      >
        <Sparkles size={22} />
      </motion.button>
    </>
  );
}
