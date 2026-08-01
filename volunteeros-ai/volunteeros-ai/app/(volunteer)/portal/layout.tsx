"use client";

import { useState } from "react";
import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalMobileSidebar } from "@/components/portal/mobile-sidebar";
import { PortalTopbar } from "@/components/portal/topbar";
import { AIChatWidget } from "@/components/dashboard/ai-chat-widget";

export default function VolunteerPortalLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <PortalSidebar />
      <PortalMobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <PortalTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      <AIChatWidget />
    </div>
  );
}
