import { VolunteerEvent } from "@/types";

export const events: VolunteerEvent[] = [
  { id: "E-501", title: "Beach Cleanup Drive — Fort Kochi", organization: "Rotaract Kochi", category: "Environment", date: "2026-08-09", time: "6:30 AM", location: "Fort Kochi Beach, Kochi", capacity: 200, registered: 178, status: "upcoming", cover: "beach-cleanup", description: "A large-scale coastal cleanup covering 3km of shoreline, followed by a waste-segregation workshop." },
  { id: "E-502", title: "Blood Donation Mega Camp", organization: "Red Cross Kollam", category: "Health", date: "2026-08-14", time: "9:00 AM", location: "Town Hall, Kollam", capacity: 150, registered: 132, status: "upcoming", cover: "blood-donation", description: "Quarterly blood donation drive in partnership with Kollam Medical College." },
  { id: "E-503", title: "Rural Literacy Bootcamp", organization: "Teach For Kerala", category: "Education", date: "2026-07-28", time: "10:00 AM", location: "Govt. LP School, Wayanad", capacity: 60, registered: 60, status: "ongoing", cover: "literacy", description: "5-day intensive literacy support program for grade 3-5 students." },
  { id: "E-504", title: "Flood Relief Coordination", organization: "Kerala Disaster Corps", category: "Disaster Relief", date: "2026-07-19", time: "5:00 AM", location: "Aluva Relief Camp", capacity: 300, registered: 297, status: "completed", cover: "flood-relief", description: "Emergency relief material distribution and shelter management for flood-affected families." },
  { id: "E-505", title: "Youth Coding Workshop", organization: "Youth4Change", category: "Youth Programs", date: "2026-08-22", time: "2:00 PM", location: "IEDC Hub, Thrissur", capacity: 80, registered: 41, status: "upcoming", cover: "coding-workshop", description: "Intro-to-programming workshop for underserved high schoolers, laptops provided on-site." },
  { id: "E-506", title: "Elderly Care Companion Day", organization: "Red Cross Kollam", category: "Elderly Care", date: "2026-08-03", time: "11:00 AM", location: "Sunshine Elder Home, Kollam", capacity: 40, registered: 36, status: "upcoming", cover: "elderly-care", description: "A day of companionship activities, health check-ins, and storytelling with residents." },
  { id: "E-507", title: "Community Kitchen — Onam Sadya", organization: "Kannur Seva Samiti", category: "Community Kitchen", date: "2026-08-27", time: "7:00 AM", location: "Community Hall, Kannur", capacity: 120, registered: 88, status: "upcoming", cover: "sadya", description: "Preparing and serving a traditional Onam Sadya to 1,200 families in need." },
  { id: "E-508", title: "Housing Repair Sprint", organization: "Habitat Kerala", category: "Housing", date: "2026-07-05", time: "8:00 AM", location: "Chittoor, Palakkad", capacity: 30, registered: 30, status: "completed", cover: "housing", description: "Weekend sprint to repair roofs and plumbing for 6 households ahead of the monsoon." },
  { id: "E-509", title: "Inter-College Sports Meet Volunteering", organization: "Alappuzha Sports Trust", category: "Sports", date: "2026-08-16", time: "6:00 AM", location: "SD College Ground, Alappuzha", capacity: 100, registered: 54, status: "upcoming", cover: "sports-meet", description: "On-ground support for track events: timing, first aid, and crowd management." },
  { id: "E-510", title: "Mangrove Restoration Drive", organization: "Kerala Disaster Corps", category: "Environment", date: "2026-06-30", time: "6:00 AM", location: "Vypin Backwaters, Kochi", capacity: 90, registered: 90, status: "cancelled", cover: "mangrove", description: "Cancelled due to unfavourable tidal conditions — rescheduled to September." },
];

export const eventStats = {
  total: 512,
  upcoming: 38,
  thisMonth: 14,
  avgFillRate: 82,
};
