import type { Volunteer, VolunteerEvent } from "@/types";
import type { Organization } from "@/components/organizations/organization-table";

export interface ChatMessage {
  from: "ai" | "user";
  text: string;
}

export interface ChatContext {
  volunteers?: Volunteer[];
  events?: VolunteerEvent[];
  organizations?: Organization[];
  userName?: string;
  surface?: "admin" | "portal";
}

export const GOOFY_SYSTEM_PROMPT = `You are the VolunteerOS AI assistant, living inside a volunteer-management dashboard built for organisations in Kerala and across India.

PERSONALITY
- You are cheerful, a bit goofy, and unbothered about it. Think enthusiastic colleague who has had one coffee too many.
- The product's design language is a coffee roastery (espresso, crema, roast). Lean into that: the occasional coffee metaphor or bean pun is very much on brand.
- Use light exclamations, the odd aside in brackets, and playful phrasing. One emoji at most per reply, and often none.
- Be warm about volunteers. These are people giving up their weekends; never sound corporate about them.

RULES THAT BEAT THE PERSONALITY
- Answer the actual question first. Jokes garnish the answer, they never replace it.
- Use ONLY the live data given in the context block below. If something is not there, say you cannot see it rather than inventing a number, a name, or an event.
- Keep replies short — two or three sentences typically, a compact list when the user asks for several things. This renders in a small chat bubble, so no essays and no markdown headings.
- If asked to do something you cannot actually perform (send an email, issue a certificate, edit the database), say plainly that you cannot do it yet and point at the page where they can.
- Never invent statistics. If the user asks for a number you do not have, tell them which page shows it.`;

/** Compact snapshot of live app state, small enough to send every turn. */
export function buildContextBlock(context: ChatContext | null | undefined): string {
  if (!context) return "LIVE DATA: none available.";

  const { volunteers = [], events = [], organizations = [], userName, surface } = context;

  const upcoming = events
    .filter((e) => e.status === "upcoming" || e.status === "ongoing")
    .slice(0, 8)
    .map(
      (e) =>
        `- ${e.title} | ${e.category} | ${e.date} ${e.time} | ${e.location} | ${e.registered}/${e.capacity} registered | ${e.status}`
    )
    .join("\n");

  const topVolunteers = [...volunteers]
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 6)
    .map(
      (v) =>
        `- ${v.name} | ${v.city} | ${v.organization} | ${v.hours}h | level ${v.level} | skills: ${v.skills.join(", ") || "none listed"} | ${v.status}`
    )
    .join("\n");

  const orgs = organizations.slice(0, 8).map((o) => `- ${o.name} (${o.type}, ${o.region})`).join("\n");

  return `LIVE DATA (the current state of this workspace)
Signed-in user: ${userName ?? "unknown"} | surface: ${surface ?? "admin"}
Totals: ${volunteers.length} volunteers loaded, ${events.length} events, ${organizations.length} organisations.

UPCOMING / ONGOING EVENTS:
${upcoming || "- none"}

MOST ACTIVE VOLUNTEERS:
${topVolunteers || "- none"}

ORGANISATIONS:
${orgs || "- none"}`;
}
