import type { Volunteer, VolunteerEvent } from "@/types";

export interface EventSuggestion {
  volunteer: Volunteer;
  event: VolunteerEvent;
  score: number; // 0-100
  matched: string[]; // requirement terms this volunteer covers
}

function norm(value: string) {
  return value.trim().toLowerCase();
}

/**
 * The matching vocabulary is every skill and interest that actually exists
 * across the roster. Grounding it in real terms keeps event requirements from
 * picking up noise words out of free-text descriptions.
 */
export function buildVocabulary(volunteers: Volunteer[]) {
  const vocab = new Set<string>();
  for (const v of volunteers) {
    for (const term of [...v.skills, ...v.interests]) {
      if (term.trim()) vocab.add(norm(term));
    }
  }
  return [...vocab];
}

/** An event's requirements are the vocabulary terms named in its own text. */
export function eventRequirements(event: VolunteerEvent, vocabulary: string[]) {
  const haystack = norm(`${event.title} ${event.category} ${event.description}`);
  return vocabulary.filter((term) => haystack.includes(term));
}

/**
 * Weighted fit: what share of the event's requirements the volunteer covers,
 * plus smaller credit for caring about the category and for being local.
 */
export function scoreMatch(
  volunteer: Volunteer,
  event: VolunteerEvent,
  requirements: string[]
) {
  const profile = new Set([...volunteer.skills, ...volunteer.interests].map(norm));
  const matched = requirements.filter((term) => profile.has(term));

  const skillFit = requirements.length ? matched.length / requirements.length : 0;
  const categoryFit = profile.has(norm(event.category)) ? 1 : 0;
  const localityFit =
    volunteer.city && norm(event.location).includes(norm(volunteer.city)) ? 1 : 0;

  const score = 0.6 * skillFit + 0.25 * categoryFit + 0.15 * localityFit;

  return { score: Math.round(score * 100), matched };
}

/**
 * For each volunteer, the upcoming event they fit best. Strongest fits first,
 * one suggestion per volunteer so the same person isn't listed repeatedly.
 */
export function suggestEvents(
  volunteers: Volunteer[],
  events: VolunteerEvent[],
  limit = 4
): EventSuggestion[] {
  const upcoming = events.filter((e) => e.status === "upcoming");
  if (upcoming.length === 0 || volunteers.length === 0) return [];

  const vocabulary = buildVocabulary(volunteers);
  const requirementsByEvent = new Map(
    upcoming.map((e) => [e.id, eventRequirements(e, vocabulary)] as const)
  );

  const suggestions: EventSuggestion[] = [];

  for (const volunteer of volunteers) {
    let best: EventSuggestion | null = null;

    for (const event of upcoming) {
      const requirements = requirementsByEvent.get(event.id) ?? [];
      const { score, matched } = scoreMatch(volunteer, event, requirements);
      if (score > 0 && (!best || score > best.score)) {
        best = { volunteer, event, score, matched };
      }
    }

    if (best) suggestions.push(best);
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, limit);
}
