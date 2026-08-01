import {
  LayoutDashboard, Contact, Users, CalendarDays, Award, MessageSquareText,
} from "lucide-react";

export const portalNavGroups = [
  {
    label: "Me",
    items: [
      { href: "/portal", label: "My Overview", icon: LayoutDashboard },
      { href: "/portal/passport", label: "My Passport", icon: Contact },
    ],
  },
  {
    label: "Community",
    items: [{ href: "/portal/directory", label: "Volunteer Directory", icon: Users }],
  },
  {
    label: "Activity",
    items: [
      { href: "/portal/events", label: "Browse Events", icon: CalendarDays },
      { href: "/portal/certificates", label: "My Certificates", icon: Award },
    ],
  },
  {
    label: "Support",
    items: [{ href: "/portal/chatbot", label: "Ask AI", icon: MessageSquareText }],
  },
];
