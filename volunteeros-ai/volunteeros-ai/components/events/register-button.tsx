"use client";

import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { currentVolunteer } from "@/components/portal/sidebar";
import { useRegistrations } from "@/lib/registration-store";
import { useNotifications } from "@/lib/notification-store";
import type { VolunteerEvent } from "@/types";

/**
 * Register action for an event, usable from any admin or portal surface.
 * Registers the app's current demo volunteer identity (see
 * components/portal/sidebar.tsx) and notifies the organizer, mirroring the
 * flow already used on the volunteer portal's Browse Events page.
 */
export function RegisterButton({
  event,
  size = "sm",
  variant,
  className,
  stopPropagation = true,
}: {
  event: VolunteerEvent;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  stopPropagation?: boolean;
}) {
  const { isRegistered, register } = useRegistrations(currentVolunteer.id);
  const { addNotification } = useNotifications();
  const registered = isRegistered(event.id);

  function handleClick(e: React.MouseEvent) {
    if (stopPropagation) e.stopPropagation();
    if (registered || event.status === "completed") return;

    register(event.id, currentVolunteer.name);
    addNotification({
      type: "registration",
      title: `${currentVolunteer.name} registered for ${event.title}`,
      body: `${currentVolunteer.city} · ${currentVolunteer.organization} · contact ${currentVolunteer.phone}`,
    });
    toast.success(`Registered for ${event.title}.`);
  }

  return (
    <Button
      size={size}
      variant={variant ?? (registered ? "secondary" : "default")}
      disabled={registered || event.status === "completed"}
      className={className}
      onClick={handleClick}
    >
      {registered ? (
        <>
          <UserCheck size={14} /> Registered
        </>
      ) : (
        <>
          <UserPlus size={14} /> Register
        </>
      )}
    </Button>
  );
}
