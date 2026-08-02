export type VolunteerStatus = "active" | "inactive" | "pending";

export type PreviousPosition = "Member" | "President" | "Secretary" | "Treasurer" | "Other";

export interface Volunteer {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  city: string;
  skills: string[];
  interests: string[];
  hours: number;
  xp: number;
  level: number;
  eventsAttended: number;
  status: VolunteerStatus;
  joinedOn: string;
  badges: string[];
  organization: string;
  // Admin-only fields — collected at registration, never shown on public/volunteer-facing views.
  photoUrl?: string;
  previousOrganization?: string;
  previousPosition?: PreviousPosition;
  previousJoinedOn?: string;
  previousEventsParticipated?: string;
  certificationProofs?: string[];
}

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface VolunteerEvent {
  id: string;
  title: string;
  organization: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  status: EventStatus;
  cover: string;
  description: string;
}

export interface Certificate {
  id: string;
  volunteerName: string;
  eventTitle: string;
  issuedOn: string;
  hours: number;
  verified: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  hours: number;
  badge: string;
}

export interface AIMatch {
  volunteerName: string;
  eventTitle: string;
  skillMatch: number;
  availabilityMatch: number;
  experienceMatch: number;
  interestMatch: number;
  distanceKm: number;
  reason: string;
  recommendedRole: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  type: "checkin" | "certificate" | "registration" | "badge" | "alert";
}
