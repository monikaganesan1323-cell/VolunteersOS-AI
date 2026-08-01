import Link from "next/link";
import { Coffee, Quote } from "lucide-react";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso-600 text-crema-100">
            <Coffee size={16} />
          </span>
          <span className="font-display text-lg font-semibold text-ink dark:text-crema-50">
            VolunteerOS AI
          </span>
        </Link>

        <div className="mx-auto w-full max-w-sm py-16">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50">
            {title}
          </h1>
          <p className="mt-2 text-sm text-espresso-700/70 dark:text-crema-100/60">
            {subtitle}
          </p>
          <div className="mt-8">{children}</div>
        </div>

        <p className="text-center text-xs text-espresso-600/50 dark:text-crema-300/40">
          © 2026 VolunteerOS AI. All rights reserved.
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-roast-gradient lg:block">
        <div className="absolute inset-0 bg-grain opacity-40" />
        <div className="relative flex h-full flex-col justify-end p-16">
          <Quote size={36} className="text-crema-200/50" />
          <p className="mt-4 font-display text-2xl italic leading-relaxed text-crema-50">
            &ldquo;We went from three spreadsheets and a WhatsApp group to one
            dashboard. Attendance reconciliation used to take a full day —
            now it&apos;s instant.&rdquo;
          </p>
          <div className="mt-6">
            <div className="text-sm font-semibold text-crema-50">Anjali Suresh</div>
            <div className="text-xs text-crema-100/60">Program Director, Rotaract Kochi</div>
          </div>
        </div>
      </div>
    </div>
  );
}
