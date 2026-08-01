"use client";

import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import { Plus, Search, LayoutGrid, Table2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { EventCard } from "@/components/events/event-card";
import { EventTable } from "@/components/events/event-table";
import { SimilarityRecommendations } from "@/components/events/similarity-recommendations";
import { events, eventStats } from "@/data/events";
import { VolunteerEvent } from "@/types";
import { CalendarDays, CalendarClock, TrendingUp, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const statuses = ["all", "upcoming", "ongoing", "completed", "cancelled"] as const;
const columnHelper = createColumnHelper<VolunteerEvent>();

// Column defs only drive filtering/sorting here — EventTable renders its own cells.
const columns = [
  columnHelper.accessor("title", { header: "Event" }),
  columnHelper.accessor("category", { header: "Category" }),
  columnHelper.accessor("date", { header: "Date" }),
  columnHelper.accessor("location", { header: "Location" }),
  columnHelper.accessor((row) => row.registered / row.capacity, { id: "fill", header: "Fill" }),
  columnHelper.accessor("status", { header: "Status" }),
];

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [sorting, setSorting] = useState<SortingState>([]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesStatus = status === "all" || e.status === status;
      const matchesQuery =
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.organization.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Events</h1>
          <p className="text-sm text-muted-foreground">{eventStats.total} events run to date.</p>
        </div>
        <Button>
          <Plus size={15} /> Create Event
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Total Events" value={eventStats.total.toString()} />
        <StatCard icon={CalendarClock} label="Upcoming" value={eventStats.upcoming.toString()} />
        <StatCard icon={TrendingUp} label="This Month" value={eventStats.thisMonth.toString()} delta="+5" />
        <StatCard icon={PieChart} label="Avg Fill Rate" value={`${eventStats.avgFillRate}%`} />
      </div>

      <SimilarityRecommendations />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events..." className="pl-10" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
                  status === s
                    ? "border-espresso-600 bg-espresso-600 text-crema-50"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl border border-border p-0.5">
            <button
              onClick={() => setView("table")}
              className={cn("rounded-lg p-1.5", view === "table" ? "bg-espresso-600 text-crema-50" : "text-muted-foreground")}
              aria-label="Table view"
            >
              <Table2 size={15} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={cn("rounded-lg p-1.5", view === "grid" ? "bg-espresso-600 text-crema-50" : "text-muted-foreground")}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {view === "table" ? (
        <>
          <EventTable table={table} />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft size={14} /> Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No events match your filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
