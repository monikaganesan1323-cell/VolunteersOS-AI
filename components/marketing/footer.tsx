import Link from "next/link";
import { Coffee, Twitter, Linkedin, Github } from "lucide-react";

const columns = [
  { title: "Product", links: ["Features", "Pricing", "Changelog", "Integrations"] },
  { title: "Solutions", links: ["NGOs", "Colleges & NSS", "CSR Programs", "Government"] },
  { title: "Resources", links: ["Documentation", "API Reference", "Case Studies", "Blog"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Privacy Policy"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bark text-crema-100">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crema-300 text-espresso-800">
                <Coffee size={16} />
              </span>
              <span className="font-display text-lg font-semibold">
                VolunteerOS AI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-crema-100/60">
              The AI-powered platform that automates volunteer management from
              recruitment to recognition.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-crema-100/70 transition-colors hover:bg-white/10 hover:text-crema-50"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-crema-50">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-crema-100/60 transition-colors hover:text-crema-50">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-crema-100/50 sm:flex-row">
          <p>© 2026 VolunteerOS AI. Built for the GENESIS NextGen Startup Summit hackathon.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-crema-50">Terms</a>
            <a href="#" className="hover:text-crema-50">Privacy</a>
            <a href="#" className="hover:text-crema-50">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
