"use client";

import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { volunteers } from "@/data/volunteers";
import { Volunteer } from "@/types";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<Volunteer>();

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
  columnHelper.accessor("skills", {
    header: "Skills",
    cell: (info) => (
      <div className="flex flex-wrap gap-1">
        {info.getValue().slice(0, 2).map((s) => (
          <span key={s} className="rounded-full bg-sage-500/10 px-2 py-0.5 text-[11px] text-sage-700 dark:text-sage-400">
            {s}
          </span>
        ))}
      </div>
    ),
  }),
  columnHelper.accessor("hours", {
    header: "Hours",
    cell: (info) => `${info.getValue()}h`,
  }),
  columnHelper.accessor("level", {
    header: "Level",
    cell: (info) => <Badge variant="secondary">Lv.{info.getValue()}</Badge>,
  }),
  columnHelper.accessor("badges", {
    header: "Badges",
    cell: (info) =>
      info.getValue().length > 0 ? (
        <span className="text-xs text-muted-foreground">🏅 {info.getValue().length}</span>
      ) : (
        <span className="text-xs text-muted-foreground/50">—</span>
      ),
  }),
];

export function DirectoryTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => volunteers, []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const v = row.original;
      const q = String(filterValue).toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.skills.some((s) => s.toLowerCase().includes(q))
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search by name, city, or skill..."
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
              <tr key={row.id} className={cn("border-b border-border last:border-0 hover:bg-sage-500/5")}>
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
                  No volunteers match your search.
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
