import type { ChatContext, ChatMessage } from "@/lib/chat-prompt";

/**
 * Used when no ANTHROPIC_API_KEY is configured. It is not a language model —
 * it reads the user's actual question, looks the answer up in live app data,
 * and replies with the same goofy voice. Genuinely responsive, just narrower.
 */

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function formatDate(iso: string) {
  if (!iso) return "date TBC";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function fallbackReply(
  messages: ChatMessage[],
  context: ChatContext | null | undefined
): string {
  const last = [...messages].reverse().find((m) => m.from === "user")?.text ?? "";
  const q = last.toLowerCase().trim();

  const volunteers = context?.volunteers ?? [];
  const events = context?.events ?? [];
  const organizations = context?.organizations ?? [];
  const live = events.filter((e) => e.status === "upcoming" || e.status === "ongoing");

  if (!q) {
    return "I'm here, fully caffeinated and ready. Ask me about your events, volunteers, or organisations!";
  }

  // Greetings
  if (/^(hi|hey|hello|yo|hai|namaskaram|vanakkam|good (morning|afternoon|evening))\b/.test(q)) {
    return pick([
      `Hello! ${volunteers.length} volunteers and ${live.length} live events on the board today. What are we digging into?`,
      "Hey there! Freshly brewed and ready to help — events, volunteers, or organisations?",
    ]);
  }

  if (/(how are you|what'?s up|how'?s it going)/.test(q)) {
    return "Running at full roast, thanks for asking! More importantly — what do you need from the dashboard?";
  }

  // What can you do
  if (/(help|what can you do|options|commands)/.test(q)) {
    return "I can tell you about upcoming events, who your most active volunteers are, which organisations are on board, and how attendance scanning works. Ask away — I read your live data, not a script.";
  }

  // Events
  if (/(event|upcoming|schedule|calendar|what'?s on)/.test(q)) {
    if (live.length === 0) {
      return "Not a single upcoming event on the board — suspiciously quiet. Hit Create Event on the Events page and I'll have something to talk about.";
    }
    const list = live
      .slice(0, 4)
      .map((e) => `• ${e.title} — ${formatDate(e.date)}, ${e.location} (${e.registered}/${e.capacity})`)
      .join("\n");
    return `${live.length} event${live.length > 1 ? "s" : ""} brewing:\n${list}`;
  }

  // Volunteers
  if (/(volunteer|people|roster|who|top|active)/.test(q)) {
    if (volunteers.length === 0) return "No volunteers loaded yet. Add one from the Volunteers page and I'll start bragging about them.";
    const top = [...volunteers].sort((a, b) => b.hours - a.hours).slice(0, 3);
    const list = top.map((v) => `• ${v.name} — ${v.hours}h, level ${v.level}, ${v.city}`).join("\n");
    return `${volunteers.length} volunteers on the roster. Your heavy hitters:\n${list}\nThat's a lot of weekends given up.`;
  }

  // Organisations
  if (/(organisation|organization|ngo|partner|club)/.test(q)) {
    if (organizations.length === 0) return "No organisations on file yet — the Organizations page has an Add button with your name on it.";
    const names = organizations.slice(0, 4).map((o) => o.name).join(", ");
    return `${organizations.length} organisations signed up, including ${names}. Want to know which region any of them covers?`;
  }

  // Attendance
  if (/(attendance|check.?in|check.?out|scan|qr|geofence|gps|face)/.test(q)) {
    return "Attendance runs on QR plus a 100m geofence — first scan logs arrival, second logs departure. The Attendance page has the scanner. Fair warning: it won't budge if you're not near the venue.";
  }

  // Matching
  if (/(match|recommend|suggest|suitable|fit)/.test(q)) {
    return "The Events page has a match panel that scores volunteers against each event's requirements — skills and interests do most of the work, with a nudge for category and locality. Best matches float to the top.";
  }

  // Reports / analytics
  if (/(report|analytic|summar|stat|number|performance|dashboard)/.test(q)) {
    const totalHours = volunteers.reduce((sum, v) => sum + v.hours, 0);
    return `Quick pour: ${volunteers.length} volunteers, ${totalHours.toLocaleString("en-IN")} hours logged between them, ${live.length} live events. The Analytics page has the proper charts — I just do headlines.`;
  }

  // Certificates
  if (/(certificate|badge|award)/.test(q)) {
    return "Certificates live on their own page, issued per volunteer per completed event. I can't generate them yet — that button isn't wired to me.";
  }

  // Create things
  if (/(create|add|new)\b/.test(q)) {
    return "I can't create records myself yet (hands are purely decorative). But Create Event is on the Events page, Add Volunteer on Volunteers, Add Organization on Organizations — all three save properly.";
  }

  if (/(thank|thanks|nice|great|good job)/.test(q)) {
    return pick(["Any time! I'll be here, quietly over-caffeinated.", "That's what I'm here for. Go make some good happen."]);
  }

  return pick([
    "That one went straight over my head — and I'm quite tall. Try asking about events, volunteers, organisations, or attendance.",
    "You've out-thought me. I'm solid on events, volunteers, organisations and attendance, though — pick one of those and I'm useful again.",
  ]);
}
