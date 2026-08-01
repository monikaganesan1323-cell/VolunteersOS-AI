"use client";

import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import {
  Award, Download, QrCode, CheckCircle2, X, Share2, Sparkles, Loader2,
  Search, ChevronLeft, ChevronRight, ArrowUpDown, Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/dashboard/stat-card";
import { certificates as seedCertificates } from "@/data/misc";
import { Certificate } from "@/types";
import { formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const columnHelper = createColumnHelper<Certificate>();

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>(seedCertificates);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ volunteerName: "", eventTitle: "", hours: "" });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const verifiedCount = certificates.filter((c) => c.verified).length;

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.volunteerName.trim() || !form.eventTitle.trim() || !form.hours.trim()) return;

    setGenerating(true);
    setTimeout(() => {
      const newCert: Certificate = {
        id: `C-${Math.floor(9000 + Math.random() * 999)}`,
        volunteerName: form.volunteerName.trim(),
        eventTitle: form.eventTitle.trim(),
        issuedOn: new Date().toISOString().slice(0, 10),
        hours: Number(form.hours) || 0,
        verified: true,
      };
      setCertificates((prev) => [newCert, ...prev]);
      setGenerating(false);
      setFormOpen(false);
      setForm({ volunteerName: "", eventTitle: "", hours: "" });
      setSelected(newCert);
    }, 1100);
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("volunteerName", {
        header: "Volunteer",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-crema-swirl text-espresso-800">
              <Award size={15} />
            </span>
            <span className="text-sm font-medium text-foreground">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("eventTitle", { header: "Event" }),
      columnHelper.accessor("hours", {
        header: "Hours",
        cell: (info) => `${info.getValue()}h`,
      }),
      columnHelper.accessor("issuedOn", {
        header: "Issued On",
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor("verified", {
        header: "Status",
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="success" className="gap-1"><CheckCircle2 size={11} /> Verified</Badge>
          ) : (
            <Badge variant="outline">Pending</Badge>
          ),
      }),
      columnHelper.display({
        id: "view",
        header: "Certificate",
        cell: (info) => (
          <button
            onClick={() => setSelected(info.row.original)}
            className="flex items-center gap-1.5 text-xs font-medium text-espresso-600 hover:underline dark:text-crema-300"
          >
            <Eye size={12} /> View
          </button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: certificates,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const c = row.original;
      const q = String(filterValue).toLowerCase();
      return c.volunteerName.toLowerCase().includes(q) || c.eventTitle.toLowerCase().includes(q);
    },
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
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Certificates</h1>
          <p className="text-sm text-muted-foreground">Auto-generated, digitally signed, and verifiable.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Sparkles size={15} /> Generate Certificate
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Award} label="Total Issued" value="25,640" />
        <StatCard icon={CheckCircle2} label="Verified This Batch" value={verifiedCount.toString()} />
        <StatCard icon={QrCode} label="QR Verifications Today" value="318" delta="+9%" />
        <StatCard icon={Share2} label="Shared to LinkedIn" value="1,204" delta="+21%" />
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by volunteer or event..."
            className="pl-10"
          />
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
                    No certificates match your search.
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

      {/* Generate certificate form */}
      <AnimatePresence>
        {formOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !generating && setFormOpen(false)}
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-warm-lg"
            >
              {!generating && (
                <button onClick={() => setFormOpen(false)} className="absolute right-4 top-4" aria-label="Close">
                  <X size={18} />
                </button>
              )}

              {generating ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                  <Loader2 size={30} className="animate-spin text-espresso-500" />
                  <div>
                    <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
                      AI is drafting the certificate…
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Verifying hours, applying the digital signature.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso-50 text-espresso-600 dark:bg-white/5 dark:text-crema-300">
                      <Sparkles size={16} />
                    </span>
                    <div>
                      <div className="font-display text-base font-semibold text-ink dark:text-crema-50">
                        Generate Certificate
                      </div>
                      <p className="text-xs text-muted-foreground">Fill in the basics — AI does the rest.</p>
                    </div>
                  </div>

                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-espresso-700 dark:text-crema-200">
                        Volunteer name
                      </label>
                      <Input
                        value={form.volunteerName}
                        onChange={(e) => setForm((f) => ({ ...f, volunteerName: e.target.value }))}
                        placeholder="e.g. Ananya Krishnan"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-espresso-700 dark:text-crema-200">
                        Event / reason for service
                      </label>
                      <Input
                        value={form.eventTitle}
                        onChange={(e) => setForm((f) => ({ ...f, eventTitle: e.target.value }))}
                        placeholder="e.g. Beach Cleanup Drive — Fort Kochi"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-espresso-700 dark:text-crema-200">
                        Hours completed
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={form.hours}
                        onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
                        placeholder="e.g. 6"
                        required
                      />
                    </div>
                    <Button type="submit" className="mt-2 w-full">
                      <Sparkles size={15} /> Generate with AI
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Certificate preview */}
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

              <div className="rounded-2xl border-4 border-double border-espresso-300 bg-crema-50 p-6 text-center dark:bg-white/5">
                <Award size={32} className="mx-auto text-espresso-600" />
                <div className="mt-3 font-display text-lg font-semibold text-espresso-800 dark:text-crema-100">
                  Certificate of Volunteer Service
                </div>
                <p className="mt-2 text-sm text-espresso-700/70 dark:text-crema-100/60">This certifies that</p>
                <div className="mt-1 font-display text-2xl italic text-ink dark:text-crema-50">
                  {selected.volunteerName}
                </div>
                <p className="mt-2 text-sm text-espresso-700/70 dark:text-crema-100/60">
                  completed {selected.hours} hours of service at
                </p>
                <div className="mt-1 text-sm font-medium text-foreground">{selected.eventTitle}</div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Issued {formatDate(selected.issuedOn)}</span>
                  {selected.verified && (
                    <span className="flex items-center gap-1 text-sage-600 dark:text-sage-400">
                      <CheckCircle2 size={12} /> Digitally signed
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Button className="flex-1"><Download size={15} /> Download PDF</Button>
                <Button variant="outline" className="flex-1"><Share2 size={15} /> Share</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
