"use client";

import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import {
  Search, ChevronLeft, ChevronRight, ArrowUpDown, X, Mail, Phone,
  Building2, ShieldAlert, Send, CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export interface Organization {
  name: string;
  type: "Service Club" | "College Program" | "NGO" | "Government";
  volunteers: number;
  events: number;
  region: string;
  contact: string;
  email: string;
  phone: string;
}

export const organizations: Organization[] = [
  { name: "Rotaract Kochi", type: "Service Club", volunteers: 1842, events: 64, region: "Ernakulam", contact: "Anjali Suresh", email: "anjali.suresh@rotaractkochi.org", phone: "+91 98470 22001" },
  { name: "NSS Thiruvananthapuram", type: "College Program", volunteers: 2310, events: 88, region: "Thiruvananthapuram", contact: "Thomas George", email: "thomas.george@nsskerala.gov.in", phone: "+91 94470 33112" },
  { name: "Teach For Kerala", type: "NGO", volunteers: 968, events: 41, region: "Statewide", contact: "Fathima Zahra", email: "fathima@teachforkerala.org", phone: "+91 87560 44521" },
  { name: "Kerala Disaster Corps", type: "Government", volunteers: 3120, events: 52, region: "Statewide", contact: "Vishnu Menon", email: "coordination@kdc.kerala.gov.in", phone: "+91 90480 55223" },
  { name: "Red Cross Kollam", type: "NGO", volunteers: 1204, events: 37, region: "Kollam", contact: "Meera Pillai", email: "meera.pillai@redcrosskollam.org", phone: "+91 96330 78214" },
  { name: "Habitat Kerala", type: "NGO", volunteers: 540, events: 22, region: "Palakkad", contact: "Bino Mathew", email: "bino.mathew@habitatkerala.org", phone: "+91 89430 66210" },
];

const typeVariant: Record<Organization["type"], "success" | "secondary" | "warning" | "default"> = {
  "Service Club": "default",
  "College Program": "secondary",
  NGO: "success",
  Government: "warning",
};

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor("name", {
    header: "Organization",
    cell: (info) => {
      const org = info.row.original;
      return (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-espresso-50 text-espresso-600 dark:bg-white/5 dark:text-crema-300">
            <Building2 size={16} />
          </span>
          <div>
            <div className="text-sm font-medium text-foreground">{org.name}</div>
            <div className="text-xs text-muted-foreground">{org.region}</div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => (
      <Badge variant={typeVariant[info.getValue()]}>{info.getValue()}</Badge>
    ),
  }),
  columnHelper.accessor("volunteers", {
    header: "Volunteers",
    cell: (info) => info.getValue().toLocaleString("en-IN"),
  }),
  columnHelper.accessor("events", { header: "Events" }),
  columnHelper.display({
    id: "admin",
    header: "Admin details",
    cell: (info) => <AdminDetailsTrigger org={info.row.original} />,
  }),
];

function AdminDetailsTrigger({ org }: { org: Organization }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setOpen(false);
      setSent(false);
      setMessage("");
    }, 1400);
  }

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
              onClick={() => !sent && setOpen(false)}
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-warm-lg"
              >
              {!sent && (
                <button onClick={() => setOpen(false)} className="absolute right-4 top-4" aria-label="Close">
                  <X size={18} />
                </button>
              )}

              {sent ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <CheckCircle2 size={30} className="text-sage-500" />
                  <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
                    Message sent to {org.contact}
                  </div>
                  <p className="text-xs text-muted-foreground">They&apos;ll respond via {org.email}.</p>
                </div>
              ) : (
                <>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-espresso-50 text-espresso-600 dark:bg-white/5 dark:text-crema-300">
                      <Building2 size={18} />
                    </span>
                    <div>
                      <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">{org.name}</div>
                      <Badge variant="warning" className="mt-0.5">Admin only</Badge>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 rounded-xl border border-border bg-muted/40 p-3 text-xs">
                    <div className="text-foreground">Contact: {org.contact}</div>
                    <a href={`mailto:${org.email}`} className="flex items-center gap-2 text-espresso-700 hover:underline dark:text-crema-200">
                      <Mail size={13} /> {org.email}
                    </a>
                    <a href={`tel:${org.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-espresso-700 hover:underline dark:text-crema-200">
                      <Phone size={13} /> {org.phone}
                    </a>
                  </div>

                  <form onSubmit={handleSend} className="mt-4">
                    <label className="mb-1.5 block text-xs font-medium text-espresso-700 dark:text-crema-200">
                      Contact about event needs
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder="e.g. Need 15 volunteers with first-aid training for the Aug 14 blood donation camp..."
                      className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
                    />
                    <Button type="submit" className="mt-3 w-full">
                      <Send size={14} /> Send message
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const types = ["all", "Service Club", "College Program", "NGO", "Government"] as const;

export function OrganizationTable({ organizations: rows }: { organizations?: Organization[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<(typeof types)[number]>("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Falls back to the seeded list when no rows are passed in.
  const source = rows ?? organizations;

  const data = useMemo(
    () => (typeFilter === "all" ? source : source.filter((o) => o.type === typeFilter)),
    [source, typeFilter]
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
            placeholder="Search organizations..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
                typeFilter === t
                  ? "border-espresso-600 bg-espresso-600 text-crema-50"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {t}
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
                  No organizations match your filters.
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
