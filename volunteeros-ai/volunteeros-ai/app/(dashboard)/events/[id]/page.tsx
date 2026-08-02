import { EventDetail } from "@/components/events/event-detail";
import { events } from "@/data/events";

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return <EventDetail id={params.id} />;
}
