"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserPlus, Camera, FileText, X } from "lucide-react";
import { AuthShell } from "@/components/shared/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { organizations } from "@/components/organizations/organization-table";
import { useVolunteers } from "@/lib/volunteer-store";
import type { PreviousPosition, Volunteer } from "@/types";

const positions: PreviousPosition[] = ["Member", "President", "Secretary", "Treasurer", "Other"];

const emptyForm = {
  name: "",
  city: "",
  email: "",
  phone: "",
  organization: organizations[0]?.name ?? "",
  prevOrg: "",
  prevPosition: positions[0] as PreviousPosition,
  prevJoined: "",
  eventsParticipated: "",
  skills: "",
  interests: "",
};

export default function VolunteerRegisterPage() {
  const router = useRouter();
  const { addVolunteer } = useVolunteers();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [proofFiles, setProofFiles] = useState<string[]>([]);
  const [form, setForm] = useState(emptyForm);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  }

  function handleProofChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setProofFiles((prev) => [...prev, ...files.map((f) => f.name)]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const volunteer: Volunteer = {
      id: `V-${Date.now().toString(36).toUpperCase()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      organization: form.organization,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      interests: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
      hours: 0,
      xp: 0,
      level: 1,
      eventsAttended: 0,
      status: "pending",
      joinedOn: new Date().toISOString().slice(0, 10),
      badges: ["New Joiner"],
      photoUrl: photoPreview ?? undefined,
      previousOrganization: form.prevOrg.trim() || undefined,
      previousPosition: form.prevPosition,
      previousJoinedOn: form.prevJoined || undefined,
      previousEventsParticipated: form.eventsParticipated.trim() || undefined,
      certificationProofs: proofFiles.length > 0 ? proofFiles : undefined,
    };

    setTimeout(() => {
      addVolunteer(volunteer);
      setLoading(false);
      toast.success("Volunteer profile created — welcome aboard!");
      router.push("/portal");
    }, 900);
  }

  return (
    <AuthShell title="Join as a volunteer" subtitle="Your public profile appears on the directory — a few details stay visible to admins only.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-4">
          <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-espresso-300 bg-espresso-50 text-espresso-500 dark:border-white/15 dark:bg-white/5"
          >
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="" className="h-full w-full object-cover" />
            ) : (
              <Camera size={20} />
            )}
          </button>
          <div className="text-xs text-muted-foreground">
            <div className="font-medium text-foreground">Profile photo</div>
            Shown on your public volunteer card.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ananya Krishnan" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="area">Area / City</Label>
            <Input id="area" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Kochi" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98470 22314" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="organization">Organization you're joining</Label>
          <select
            id="organization"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-white/70 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
          >
            {organizations.map((o) => (
              <option key={o.name} value={o.name}>{o.name}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-border p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-espresso-600/70 dark:text-crema-300/60">
            Previous experience <span className="normal-case text-muted-foreground">(admin-only, not shown publicly)</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prevOrg">Previous club / organization</Label>
              <Input id="prevOrg" value={form.prevOrg} onChange={(e) => update("prevOrg", e.target.value)} placeholder="e.g. Kochi Lions Youth Wing" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prevPosition">Position held</Label>
              <select
                id="prevPosition"
                value={form.prevPosition}
                onChange={(e) => update("prevPosition", e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-white/70 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
              >
                {positions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prevJoined">Date of joining (previous org)</Label>
              <Input id="prevJoined" type="date" value={form.prevJoined} onChange={(e) => update("prevJoined", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="eventsParticipated">Events participated in before</Label>
              <Input
                id="eventsParticipated"
                value={form.eventsParticipated}
                onChange={(e) => update("eventsParticipated", e.target.value)}
                placeholder="e.g. Beach cleanup, blood donation camp"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-espresso-600/70 dark:text-crema-300/60">
            Skills &amp; interests <span className="normal-case text-muted-foreground">(helps us match you to the right events)</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="skills">Skills</Label>
              <Input id="skills" value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="First Aid, Teaching, Logistics" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="interests">Interests</Label>
              <Input id="interests" value={form.interests} onChange={(e) => update("interests", e.target.value)} placeholder="Environment, Health, Education" />
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-1.5 block">Past event certification proofs</Label>
          <input ref={proofInputRef} type="file" accept=".pdf,image/*" multiple onChange={handleProofChange} className="hidden" />
          <button
            type="button"
            onClick={() => proofInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-espresso-300 py-3 text-xs font-medium text-espresso-600 hover:bg-espresso-50 dark:border-white/15 dark:text-crema-300 dark:hover:bg-white/5"
          >
            <FileText size={14} /> Upload certificates (PDF or image)
          </button>
          {proofFiles.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {proofFiles.map((name, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5 text-xs text-foreground">
                  <span className="truncate">{name}</span>
                  <button type="button" onClick={() => setProofFiles((f) => f.filter((_, idx) => idx !== i))} aria-label="Remove file">
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating profile..." : (<><UserPlus size={16} /> Create volunteer profile</>)}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-espresso-700/70 dark:text-crema-100/60">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-espresso-700 hover:underline dark:text-crema-200">
          Sign in
        </Link>
        {" "}·{" "}
        <Link href="/register" className="font-medium text-espresso-700 hover:underline dark:text-crema-200">
          Registering an organization instead?
        </Link>
      </p>
    </AuthShell>
  );
}
