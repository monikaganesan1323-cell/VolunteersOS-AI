"use client";

import { useState } from "react";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import {
  ArrowUpDown, X, MapPin, CalendarDays, Users, Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VolunteerEvent } from "@/types";
import { formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const statusVariant: Record<VolunteerEvent["status"], "success" | "secondary" | "warning" | "outline"> = {
  upcoming: "secondary",
  ongoing: "success",
  completed: "outline",
  cancelled: "warning",
};

export function EventTable({ table }: { table: TanstackTable<VolunteerEvent> }) {
  const [selected, setSelected] = useState<VolunteerEvent | null>(null);
  const columnCount = table.getAllColumns().length;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-muted/50">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <ArrowUpDown size={11} />}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const e = row.original;
              const fillRate = (e.registered / e.capacity) * 100;
              return (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="min-w-[180px]">
                      <div className="text-sm font-medium text-foreground">{e.title}</div>
                      <div className="text-xs text-muted-foreground">{e.organization}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(e.date)} · {e.time}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.location.split(",")[0]}</td>
                  <td className="px-4 py-3">
                    <div className="w-28">
                      <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                        <span>{e.registered}/{e.capacity}</span>
                        <span>{Math.round(fillRate)}%</span>
                      </div>
                      <Progress value={fillRate} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[e.status]} className="capitalize">{e.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(e)}
                      className="flex items-center gap-1.5 text-xs font-medium text-espresso-600 hover:underline dark:text-crema-300"
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columnCount + 1} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No events match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-warm-lg"
            >
              <button onClick={() => setSelected(null)} className="absolute right-4 top-4" aria-label="Close">
                <X size={18} />
              </button>

              <span className="text-xs font-medium uppercase tracking-wide text-espresso-500">
                {selected.category}
              </span>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink dark:text-crema-50">
                {selected.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{selected.organization}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{selected.description}</p>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={13} /> {formatDate(selected.date)} · {selected.time}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} /> {selected.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} /> {selected.registered}/{selected.capacity} registered
                </div>
              </div>

              <Button className="mt-5 w-full">Manage event</Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
