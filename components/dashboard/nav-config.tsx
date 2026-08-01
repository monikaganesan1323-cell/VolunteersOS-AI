import {
  LayoutDashboard, Users, CalendarDays, Building2, QrCode, Award,
  BarChart3, Trophy, MessageSquareText, Settings,
} from "lucide-react";

// Flat nav list — order and item set match the reference screenshot exactly.
export const adminNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/volunteers", label: "Volunteers", icon: Users },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/organizations", label: "Organizations", icon: Building2 },
  { href: "/attendance", label: "Attendance", icon: QrCode },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/chatbot", label: "Chatbot", icon: MessageSquareText },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Kept for anything still importing the grouped shape.
export const adminNavGroups = [{ label: "", items: adminNavItems }];
