import { Certificate, LeaderboardEntry, AIMatch, ActivityItem } from "@/types";

export const certificates: Certificate[] = [
  { id: "C-9001", volunteerName: "Fathima Zahra", eventTitle: "Rural Literacy Bootcamp", issuedOn: "2026-07-29", hours: 40, verified: true },
  { id: "C-9002", volunteerName: "Meera Pillai", eventTitle: "Flood Relief Coordination", issuedOn: "2026-07-20", hours: 24, verified: true },
  { id: "C-9003", volunteerName: "Ananya Krishnan", eventTitle: "Beach Cleanup Drive — Fort Kochi", issuedOn: "2026-07-15", hours: 6, verified: true },
  { id: "C-9004", volunteerName: "Nikhil Raj", eventTitle: "Housing Repair Sprint", issuedOn: "2026-07-06", hours: 16, verified: false },
  { id: "C-9005", volunteerName: "Priya Nambiar", eventTitle: "Community Kitchen — Onam Sadya", issuedOn: "2026-06-28", hours: 10, verified: true },
  { id: "C-9006", volunteerName: "Karthik Iyer", eventTitle: "Inter-College Sports Meet", issuedOn: "2026-06-20", hours: 8, verified: true },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Fathima Zahra", xp: 11040, level: 15, hours: 302, badge: "Legend" },
  { rank: 2, name: "Meera Pillai", xp: 9870, level: 13, hours: 271, badge: "Elite" },
  { rank: 3, name: "Ananya Krishnan", xp: 8420, level: 12, hours: 214, badge: "Elite" },
  { rank: 4, name: "Diya Suresh", xp: 7050, level: 10, hours: 189, badge: "Champion" },
  { rank: 5, name: "Priya Nambiar", xp: 6720, level: 9, hours: 178, badge: "Champion" },
  { rank: 6, name: "Rahul Menon", xp: 6210, level: 9, hours: 156, badge: "Champion" },
  { rank: 7, name: "Sneha Thomas", xp: 5430, level: 8, hours: 145, badge: "Rising Star" },
  { rank: 8, name: "Karthik Iyer", xp: 4890, level: 7, hours: 122, badge: "Rising Star" },
];

export const aiMatches: AIMatch[] = [
  { volunteerName: "Ananya Krishnan", eventTitle: "Blood Donation Mega Camp", skillMatch: 94, availabilityMatch: 88, experienceMatch: 91, interestMatch: 85, distanceKm: 3.2, reason: "First-aid certification and prior camp coordination make her a strong on-site lead.", recommendedRole: "Camp Coordinator" },
  { volunteerName: "Vishnu Prasad", eventTitle: "Youth Coding Workshop", skillMatch: 89, availabilityMatch: 95, experienceMatch: 72, interestMatch: 97, distanceKm: 12.4, reason: "Strong social-media skillset and high interest score in youth programs.", recommendedRole: "Workshop Media Lead" },
  { volunteerName: "Aditya Varma", eventTitle: "Mangrove Restoration Drive", skillMatch: 91, availabilityMatch: 80, experienceMatch: 86, interestMatch: 93, distanceKm: 6.7, reason: "Drone mapping experience directly supports the restoration survey phase.", recommendedRole: "Survey & Mapping Lead" },
  { volunteerName: "Sneha Thomas", eventTitle: "Community Kitchen — Onam Sadya", skillMatch: 78, availabilityMatch: 90, experienceMatch: 68, interestMatch: 74, distanceKm: 22.1, reason: "Accounting background suited to donation tracking and inventory during the drive.", recommendedRole: "Inventory & Donations" },
];

export const activityFeed: ActivityItem[] = [
  { id: "A-1", actor: "Ananya Krishnan", action: "checked in to", target: "Beach Cleanup Drive — Fort Kochi", time: "8 min ago", type: "checkin" },
  { id: "A-2", actor: "System AI", action: "generated a certificate for", target: "Meera Pillai", time: "34 min ago", type: "certificate" },
  { id: "A-3", actor: "Vishnu Prasad", action: "registered for", target: "Youth Coding Workshop", time: "1 hr ago", type: "registration" },
  { id: "A-4", actor: "Fathima Zahra", action: "earned the badge", target: "Mentor", time: "2 hr ago", type: "badge" },
  { id: "A-5", actor: "Kerala Disaster Corps", action: "issued an emergency broadcast for", target: "Idukki Sector 4", time: "3 hr ago", type: "alert" },
  { id: "A-6", actor: "Priya Nambiar", action: "checked in to", target: "Community Kitchen — Onam Sadya prep", time: "5 hr ago", type: "checkin" },
];

export const volunteerGrowth = [
  { month: "Feb", volunteers: 7820 },
  { month: "Mar", volunteers: 8140 },
  { month: "Apr", volunteers: 8490 },
  { month: "May", volunteers: 9120 },
  { month: "Jun", volunteers: 9760 },
  { month: "Jul", volunteers: 10482 },
];

export const attendanceTrend = [
  { day: "Mon", attendance: 312 },
  { day: "Tue", attendance: 289 },
  { day: "Wed", attendance: 401 },
  { day: "Thu", attendance: 356 },
  { day: "Fri", attendance: 428 },
  { day: "Sat", attendance: 612 },
  { day: "Sun", attendance: 540 },
];

export const eventCategoryBreakdown = [
  { category: "Environment", value: 128 },
  { category: "Health", value: 96 },
  { category: "Education", value: 84 },
  { category: "Disaster Relief", value: 71 },
  { category: "Community Kitchen", value: 58 },
  { category: "Sports", value: 45 },
];
