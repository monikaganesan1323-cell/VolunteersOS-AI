"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Organization } from "@/components/organizations/organization-table";

const types: Organization["type"][] = [
  "Service Club",
  "College Program",
  "NGO",
  "Government",
];

const emptyForm = {
  name: "",
  type: types[0],
  region: "",
  contact: "",
  email: "",
  phone: "",
};

/**
 * "Add Organization" button + modal. Hands the finished organization back
 * through onCreate so the page owning the list decides where it goes.
 */
export function AddOrganizationDialog({
  onCreate,
}: {
  onCreate: (org: Organization) => void;
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

    const org: Organization = {
      name: form.name.trim(),
      type: form.type,
      volunteers: 0,
      events: 0,
      region: form.region.trim(),
      contact: form.contact.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    onCreate(org);

    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      setForm(emptyForm);
      toast.success(`"${org.name}" added.`);
    }, 400);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus size={15} /> Add Organization
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
                  <Building2 size={18} />
                </span>
                <div>
                  <h2 className="font-display text-base font-semibold text-ink dark:text-crema-50">
                    Add an organization
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    It appears in the directory as soon as you save.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="org-name">Organization name</Label>
                    <Input
                      id="org-name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Rotaract Kochi"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="org-type">Type</Label>
                      <select
                        id="org-type"
                        value={form.type}
                        onChange={(e) => update("type", e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-white/70 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
                      >
                        {types.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="org-region">Region</Label>
                      <Input
                        id="org-region"
                        value={form.region}
                        onChange={(e) => update("region", e.target.value)}
                        placeholder="Ernakulam"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="org-contact">Contact person</Label>
                    <Input
                      id="org-contact"
                      value={form.contact}
                      onChange={(e) => update("contact", e.target.value)}
                      placeholder="Anjali Suresh"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="org-email">Email</Label>
                      <Input
                        id="org-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="contact@organization.org"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="org-phone">Phone</Label>
                      <Input
                        id="org-phone"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+91 98470 22001"
                        required
                      />
                    </div>
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
                    {saving ? "Saving..." : (<><Plus size={15} /> Save organization</>)}
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
