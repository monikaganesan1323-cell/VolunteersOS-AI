"use client";

import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, X, Mail, Phone, Briefcase, FileText, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { volunteers } from "@/data/volunteers";
import { Volunteer, VolunteerStatus } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const columnHelper = createColumnHelper<Volunteer>();

const statusVariant: Record<VolunteerStatus, "success" | "secondary" | "warning"> = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};

const columns = [
  columnHelper.accessor("name", {
    header: "Volunteer",
    cell: (info) => {
      const v = info.row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar name={v.name} size={36} />
          <div>
            <div className="text-sm font-medium text-foreground">{v.name}</div>
            <div className="text-xs text-muted-foreground">{v.city}</div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("organization", { header: "Organization" }),
  columnHelper.accessor("hours", {
    header: "Hours",
    cell: (info) => `${info.getValue()}h`,
  }),
  columnHelper.accessor("eventsAttended", { header: "Events" }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Badge variant={statusVariant[info.getValue()]} className="capitalize">
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.display({
    id: "admin",
    header: "Admin details",
    cell: (info) => (
      <AdminDetailsTrigger volunteer={info.row.original} />
    ),
  }),
];

function AdminDetailsTrigger({ volunteer }: { volunteer: Volunteer }) {
  const [open, setOpen] = useState(false);
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-warm-lg"
              >
              <button onClick={() => setOpen(false)} className="absolute right-4 top-4" aria-label="Close">
                <X size={18} />
              </button>
              <div className="mb-1 flex items-center gap-2">
                <Avatar name={volunteer.name} size={40} />
                <div>
                  <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">{volunteer.name}</div>
                  <Badge variant="warning" className="mt-0.5">Admin only</Badge>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <Mail size={14} className="shrink-0 text-muted-foreground" /> {volunteer.email}
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Phone size={14} className="shrink-0 text-muted-foreground" /> {volunteer.phone}
                </div>
                {volunteer.previousOrganization && (
                  <div className="flex items-start gap-2 text-foreground">
                    <Briefcase size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <div>{volunteer.previousOrganization}</div>
                      <div className="text-xs text-muted-foreground">
                        {volunteer.previousPosition}
                        {volunteer.previousJoinedOn && ` · joined ${formatDate(volunteer.previousJoinedOn)}`}
                      </div>
                    </div>
                  </div>
                )}
                {volunteer.certificationProofs && volunteer.certificationProofs.length > 0 && (
                  <div className="flex items-start gap-2 text-foreground">
                    <FileText size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                    <ul className="space-y-1">
                      {volunteer.certificationProofs.map((f) => (
                        <li key={f} className="text-xs text-espresso-600 dark:text-crema-300">{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function VolunteerTable({ volunteers: rows }: { volunteers?: Volunteer[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<VolunteerStatus | "all">("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Falls back to the seeded list when no rows are passed in.
  const source = rows ?? volunteers;

  const data = useMemo(
    () => (statusFilter === "all" ? source : source.filter((v) => v.status === statusFilter)),
    [source, statusFilter]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search volunteers..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(["all", "active", "pending", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
                statusFilter === s
                  ? "border-espresso-600 bg-espresso-600 text-crema-50"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No volunteers match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
