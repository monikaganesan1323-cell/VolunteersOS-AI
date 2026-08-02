import { NextResponse } from "next/server";
import { GOOFY_SYSTEM_PROMPT, buildContextBlock, type ChatMessage } from "@/lib/chat-prompt";
import { fallbackReply } from "@/lib/chat-fallback";

export const runtime = "nodejs";

/**
 * Chat endpoint. The API key stays server-side and is never shipped to the
 * browser. With no key configured, the local responder answers instead, so
 * the assistant still works out of the box.
 */
export async function POST(request: Request) {
  let messages: ChatMessage[] = [];
  let context = null;

  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
    context = body?.context ?? null;
  } catch {
    return NextResponse.json({ reply: "That message didn't parse. Try again?", source: "local" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ reply: fallbackReply(messages, context), source: "local" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 600,
        system: `${GOOFY_SYSTEM_PROMPT}\n\n${buildContextBlock(context)}`,
        messages: messages
          .filter((m) => m.text?.trim())
          .slice(-12) // keep the request small; the widget is a side panel, not a thesis
          .map((m) => ({
            role: m.from === "ai" ? "assistant" : "user",
            content: m.text,
          })),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Anthropic request failed:", response.status, detail);
      return NextResponse.json({ reply: fallbackReply(messages, context), source: "local" });
    }

    const data = await response.json();
    const reply = (data?.content ?? [])
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({
      reply: reply || fallbackReply(messages, context),
      source: reply ? "anthropic" : "local",
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ reply: fallbackReply(messages, context), source: "local" });
  }
}
