"use client";

import { useCallback, useState } from "react";
import { useVolunteers } from "@/lib/volunteer-store";
import { useEvents } from "@/lib/event-store";
import { useOrganizations } from "@/lib/org-store";
import type { ChatMessage } from "@/lib/chat-prompt";

/**
 * Shared chat plumbing for the floating widget and the full Chatbot page.
 * Both send the same live snapshot, so the assistant answers from real data
 * wherever it is opened.
 */
export function useAssistant(opening: string, surface: "admin" | "portal" = "admin") {
  const { volunteers } = useVolunteers();
  const { events } = useEvents();
  const { organizations } = useOrganizations();

  const [messages, setMessages] = useState<ChatMessage[]>([{ from: "ai", text: opening }]);
  const [pending, setPending] = useState(false);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pending) return;

      const next: ChatMessage[] = [...messages, { from: "user", text: trimmed }];
      setMessages(next);
      setPending(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: next,
            context: {
              volunteers,
              events,
              organizations,
              userName: "Monika",
              surface,
            },
          }),
        });

        const data = await response.json();
        setMessages((m) => [
          ...m,
          { from: "ai", text: data?.reply ?? "My brain slipped a gear there. Ask me again?" },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          { from: "ai", text: "Couldn't reach my thinking bits just then — check your connection and try again." },
        ]);
      } finally {
        setPending(false);
      }
    },
    [messages, pending, volunteers, events, organizations, surface]
  );

  return { messages, setMessages, pending, send };
}
