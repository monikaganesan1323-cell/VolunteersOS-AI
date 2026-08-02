"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, CalendarPlus } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { organizations } from "@/components/organizations/organization-table";
import { downloadIcs } from "@/lib/calendar";
import type { VolunteerEvent } from "@/types";

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
 * "Create Event" button + modal. Hands the finished event back through
 * onCreate so the page owning the list decides where it goes.
 */
export function CreateEventDialog({
  onCreate,
}: {
  onCreate: (event: VolunteerEvent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [form, setForm] = useState(emptyForm);

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const today = new Date(new Date().toDateString());
    const event: VolunteerEvent = {
      id: `E-${Date.now().toString(36).toUpperCase()}`,
      title: form.title.trim(),
      organization: form.organization,
      category: form.category,
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      capacity: Number(form.capacity) || 0,
      registered: 0,
      status: new Date(form.date) < today ? "completed" : "upcoming",
      cover: "custom",
      description: form.description.trim(),
    };

    onCreate(event);
    if (addToCalendar) downloadIcs(event);

    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      setForm(emptyForm);
      toast.success(`"${event.title}" created.`);
    }, 400);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus size={15} /> Create Event
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                role="dialog"
                aria-modal="true"
                className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-warm-lg"
              >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 px-6 pb-5 pt-6">
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

              <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
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

                <label className="flex items-center justify-between rounded-xl border border-border p-3.5">
                  <div>
                    <div className="text-sm font-medium text-foreground">Add to my calendar</div>
                    <div className="text-xs text-muted-foreground">
                      Downloads an .ics file you can open in Google, Outlook, or Apple Calendar.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={addToCalendar}
                    onChange={(e) => setAddToCalendar(e.target.checked)}
                    className="h-4 w-4 shrink-0 rounded accent-espresso-600"
                  />
                </label>

                </div>

                <div className="flex gap-3 px-6 pb-6 pt-5">
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
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
