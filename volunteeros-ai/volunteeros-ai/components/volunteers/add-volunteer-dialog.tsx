"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { organizations } from "@/components/organizations/organization-table";
import type { Volunteer, VolunteerStatus } from "@/types";

const statuses: VolunteerStatus[] = ["active", "pending", "inactive"];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  organization: organizations[0]?.name ?? "",
  status: "pending" as VolunteerStatus,
  skills: "",
};

/**
 * "Add Volunteer" button + modal. Hands the finished volunteer back through
 * onCreate so the page owning the list decides where it goes.
 */
export function AddVolunteerDialog({
  onCreate,
}: {
  onCreate: (volunteer: Volunteer) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const volunteer: Volunteer = {
      id: `V-${Date.now().toString(36).toUpperCase()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      organization: form.organization,
      status: form.status,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      interests: [],
      hours: 0,
      xp: 0,
      level: 1,
      eventsAttended: 0,
      joinedOn: new Date().toISOString().slice(0, 10),
      badges: ["New Joiner"],
    };

    onCreate(volunteer);

    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      setForm(emptyForm);
      toast.success(`"${volunteer.name}" added.`);
    }, 400);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus size={15} /> Add Volunteer
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
                className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-warm-lg"
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
                  <UserPlus size={18} />
                </span>
                <div>
                  <h2 className="font-display text-base font-semibold text-ink dark:text-crema-50">
                    Add a volunteer
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    They join the roster as soon as you save.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="vol-name">Full name</Label>
                    <Input
                      id="vol-name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Ananya Nair"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="vol-email">Email</Label>
                      <Input
                        id="vol-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="ananya@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="vol-phone">Phone</Label>
                      <Input
                        id="vol-phone"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+91 98470 22001"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="vol-city">City</Label>
                      <Input
                        id="vol-city"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder="Kochi"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="vol-status">Status</Label>
                      <select
                        id="vol-status"
                        value={form.status}
                        onChange={(e) => update("status", e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-white/70 px-4 text-sm capitalize text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="vol-org">Organization</Label>
                    <select
                      id="vol-org"
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
                    <Label htmlFor="vol-skills">Skills</Label>
                    <Input
                      id="vol-skills"
                      value={form.skills}
                      onChange={(e) => update("skills", e.target.value)}
                      placeholder="First Aid, Teaching, Logistics"
                    />
                  </div>
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
                    {saving ? "Saving..." : (<><UserPlus size={15} /> Save volunteer</>)}
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
