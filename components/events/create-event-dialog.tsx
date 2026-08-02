"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, CalendarPlus, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { organizations } from "@/components/organizations/organization-table";

const categories = [
  "Environment",
  "Health",
  "Education",
  "Disaster Relief",
  "Youth Programs",
  "Elderly Care",
  "Community Kitchen",
  "Housing",
  "Sports",
];

const emptyForm = {
  title: "",
  organization: organizations[0]?.name ?? "",
  category: categories[0],
  date: "",
  time: "",
  location: "",
  capacity: "50",
  description: "",
};

/**
 * The Create Event button + modal. Drop it anywhere; it wires straight into
 * the app store so new events show up on /events and the dashboard instantly.
 */
export function CreateEventDialog({
  label = "Create Event",
  icon = "plus",
  variant = "default",
  className,
}: {
  label?: string;
  icon?: "plus" | "arrow";
  variant?: "default" | "secondary" | "outline" | "ghost";
  className?: string;
}) {
  const { addEvent } = useStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const created = addEvent({
      title: form.title,
      organization: form.organization,
      category: form.category,
      date: form.date,
      time: form.time,
      location: form.location,
      capacity: Number(form.capacity),
      description: form.description,
    });

    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      setForm(emptyForm);
      toast.success(`"${created.title}" created and published to volunteers.`);
    }, 500);
  }

  return (
    <>
      <Button variant={variant} className={className} onClick={() => setOpen(true)}>
        {icon === "plus" ? <Plus size={15} /> : null}
        {label}
        {icon === "arrow" ? <ArrowRight size={15} /> : null}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setOpen(false)}
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              role="dialog"
              aria-modal="true"
              className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[94%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-warm-lg scrollbar-thin"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-espresso-50 text-espresso-600 dark:bg-white/5 dark:text-crema-300">
                  <CalendarPlus size={18} />
                </span>
                <div>
                  <h2 className="font-display text-base font-semibold text-ink dark:text-crema-50">
                    Create a new event
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    It goes live on the events board as soon as you save.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ev-title">Event title</Label>
                  <Input
                    id="ev-title"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="Beach Cleanup Drive - Fort Kochi"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-org">Organization</Label>
                    <select
                      id="ev-org"
                      value={form.organization}
                      onChange={(e) => update("organization", e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-white/70 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
                    >
                      {organizations.map((o) => (
                        <option key={o.name} value={o.name}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-category">Category</Label>
                    <select
                      id="ev-category"
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-white/70 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-date">Date</Label>
                    <Input
                      id="ev-date"
                      type="date"
                      value={form.date}
                      onChange={(e) => update("date", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-time">Start time</Label>
                    <Input
                      id="ev-time"
                      type="time"
                      value={form.time}
                      onChange={(e) => update("time", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label htmlFor="ev-location">Location</Label>
                    <Input
                      id="ev-location"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="Fort Kochi Beach, Kochi"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-capacity">Capacity</Label>
                    <Input
                      id="ev-capacity"
                      type="number"
                      min={1}
                      value={form.capacity}
                      onChange={(e) => update("capacity", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ev-desc">Description</Label>
                  <textarea
                    id="ev-desc"
                    rows={3}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="What volunteers will be doing, what to bring, who to report to..."
                    className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Creating..." : (<><Plus size={15} /> Create event</>)}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
