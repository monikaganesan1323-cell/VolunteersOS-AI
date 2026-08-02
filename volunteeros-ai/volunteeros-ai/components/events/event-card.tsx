"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RegisterButton } from "@/components/events/register-button";
import { VolunteerEvent } from "@/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusVariant: Record<VolunteerEvent["status"], "success" | "secondary" | "warning" | "outline"> = {
  upcoming: "secondary",
  ongoing: "success",
  completed: "outline",
  cancelled: "warning",
};

const categoryGradients: Record<string, string> = {
  Environment: "from-sage-500 to-espresso-500",
  Health: "from-rust-500 to-crema-400",
  Education: "from-espresso-500 to-crema-300",
  "Disaster Relief": "from-espresso-700 to-rust-500",
  "Youth Programs": "from-crema-400 to-espresso-400",
  "Elderly Care": "from-espresso-400 to-sage-400",
  "Community Kitchen": "from-crema-300 to-rust-400",
  Housing: "from-espresso-600 to-espresso-300",
  Sports: "from-sage-500 to-crema-400",
};

export function EventCard({ event }: { event: VolunteerEvent }) {
  const router = useRouter();
  const fillRate = (event.registered / event.capacity) * 100;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/events/${event.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push(`/events/${event.id}`);
      }}
      className="group h-full cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-warm"
    >
        <div
          className={cn(
            "flex h-32 items-end bg-gradient-to-br p-4",
            categoryGradients[event.category] ?? "from-espresso-500 to-crema-300"
          )}
        >
          <Badge variant={statusVariant[event.status]} className="capitalize backdrop-blur">
            {event.status}
          </Badge>
        </div>
        <CardContent className="p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-espresso-500">
            {event.category}
          </span>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink dark:text-crema-50">
            {event.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{event.organization}</p>

          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={13} /> {formatDate(event.date)} · {event.time}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} /> {event.location}
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users size={12} /> {event.registered}/{event.capacity}</span>
              <span>{Math.round(fillRate)}% full</span>
            </div>
            <Progress value={fillRate} />
          </div>

          <RegisterButton event={event} className="mt-4 w-full" />
        </CardContent>
      </Card>
  );
}
