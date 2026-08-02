"use client";

import toast from "react-hot-toast";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadIcs, type CalendarEvent } from "@/lib/calendar";

/**
 * Client-side wrapper so the (server-rendered) event detail page can offer
 * an .ics download without becoming a client component itself.
 */
export function AddToCalendarButton({ event }: { event: CalendarEvent }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        downloadIcs(event);
        toast.success("Added to calendar.");
      }}
    >
      <CalendarPlus size={14} /> Add to calendar
    </Button>
  );
}
