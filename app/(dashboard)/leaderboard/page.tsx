"use client";

import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import {
  Trophy, Medal, Flame, Users, Star, Clock, Search, ArrowUpDown,
  ChevronLeft, ChevronRight, ShieldAlert, X, Mail, Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/dashboard/stat-card";
import { leaderboard } from "@/data/misc";
import { volunteers } from "@/data/volunteers";
import { LeaderboardEntry } from "@/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const podiumStyles = [
  "bg-gradient-to-b from-crema-300 to-crema-400 text-espresso-900",
  "bg-gradient-to-b from-espresso-200 to-espresso-300 text-espresso-900",
  "bg-gradient-to-b from-espresso-400 to-espresso-500 text-crema-50",
];

function AdminDetailsTrigger({ entry }: { entry: LeaderboardEntry }) {
  const [open, setOpen] = useState(false);
  const match = volunteers.find((v) => v.name === entry.name);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-espresso-600 hover:underline dark:text-crema-300"
      >
        <ShieldAlert size={12} /> View
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-warm-lg"
            >
              <button onClick={() => setOpen(false)} className="absolute right-4 top-4" aria-label="Close">
                <X size={18} />
              </button>
              <div className="mb-1 flex items-center gap-2">
                <Avatar name={entry.name} size={40} />
                <div>
                  <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">{entry.name}</div>
                  <Badge variant="warning" className="mt-0.5">Admin only</Badge>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {match ? (
                  <>
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail size={14} className="shrink-0 text-muted-foreground" /> {match.email}
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone size={14} className="shrink-0 text-muted-foreground" /> {match.phone}
                    </div>
                    <div className="text-xs text-muted-foreground">{match.organization} · {match.city}</div>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">No matching volunteer record.</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const columnHelper = createColumnHelper<LeaderboardEntry>();

const columns = [
  columnHelper.accessor("rank", {
    header: "Rank",
    cell: (info) => {
      const rank = info.getValue();
      return rank <= 3 ? (
        <Medal size={15} className={rank === 1 ? "text-crema-400" : rank === 2 ? "text-espresso-300" : "text-espresso-500"} />
      ) : (
        <span className="w-[15px] text-center text-xs text-muted-foreground">{rank}</span>
      );
    },
  }),
  columnHelper.accessor("name", {
    header: "Volunteer",
    cell: (info) => (
      <div className="flex items-center gap-3">
        <Avatar name={info.getValue()} size={32} />
        <span className="font-medium text-foreground">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor("level", { header: "Level", cell: (info) => `Lvl ${info.getValue()}` }),
  columnHelper.accessor("hours", { header: "Hours", cell: (info) => `${info.getValue()}h` }),
  columnHelper.accessor("xp", {
    header: "XP",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue().toLocaleString("en-IN")}</span>,
  }),
  columnHelper.accessor("badge", {
    header: "Badge",
    cell: (info) => (
      <Badge variant="secondary" className="gap-1">
        <Flame size={11} /> {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.display({
    id: "admin",
    header: "Admin details",
    cell: (info) => <AdminDetailsTrigger entry={info.row.original} />,
  }),
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [top1, top2, top3] = leaderboard;

  const totalHours = leaderboard.reduce((s, e) => s + e.hours, 0);
  const avgXp = Math.round(leaderboard.reduce((s, e) => s + e.xp, 0) / leaderboard.length);

  const table = useReactTable({
    data: leaderboard,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) =>
      row.original.name.toLowerCase().includes(String(filterValue).toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Ranked by XP earned through verified volunteer hours.</p>
        </div>
        <div className="flex rounded-xl border border-border p-1">
          {(["monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                period === p ? "bg-espresso-600 text-crema-50" : "text-muted-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Ranked Volunteers" value={leaderboard.length.toString()} />
        <StatCard icon={Trophy} label="Top Level" value={`Lvl ${top1.level}`} />
        <StatCard icon={Star} label="Avg XP" value={avgXp.toLocaleString("en-IN")} />
        <StatCard icon={Clock} label="Total Hours Logged" value={totalHours.toLocaleString("en-IN")} />
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 items-end gap-3">
        {[top2, top1, top3].map((entry, i) => {
          const rankIndex = entry.rank - 1;
          const heights = ["h-40", "h-52", "h-32"];
          const order = i === 1 ? 1 : i === 0 ? 2 : 3;
          return (
            <div key={entry.rank} className="flex flex-col items-center" style={{ order }}>
              <Avatar name={entry.name} size={56} />
              <div className="mt-2 text-center text-sm font-semibold text-foreground">{entry.name}</div>
              <div className="text-xs text-muted-foreground">{entry.xp.toLocaleString("en-IN")} XP</div>
              <div
                className={cn(
                  "mt-3 flex w-full items-start justify-center rounded-t-2xl pt-3 font-display text-2xl font-bold",
                  heights[entry.rank - 1] ?? "h-32",
                  podiumStyles[rankIndex] ?? podiumStyles[2]
                )}
              >
                #{entry.rank}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search volunteers..."
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none px-5 py-3"
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

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
    </div>
  );
}
