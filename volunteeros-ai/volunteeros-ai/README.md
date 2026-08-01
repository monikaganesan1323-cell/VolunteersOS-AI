# VolunteerOS AI — "The Intelligent Volunteer Operating System"

Production-style frontend for a national hackathon. Next.js 14 (App Router) +
TypeScript + Tailwind + shadcn-style primitives + Framer Motion + Recharts.
No backend — everything runs on realistic mock data in `/data`.

## Design system: "Roastery"
Volunteering has the same arc as coffee: sourcing (recruitment), roasting
(training/matching), brewing (the event itself), and serving (recognition).
The palette is built from roast tones instead of the default SaaS blue:

| Token | Hex | Use |
|---|---|---|
| `espresso-600` | `#6F4E37` | primary |
| `crema-300` | `#EFCB98` | secondary / accent |
| `sage-500` | `#6B8E4E` | success |
| `rust-500` | `#C25A32` | warning |
| `parchment` | `#FAF6F1` | light background |
| `bark` | `#2B1D14` | dark background |

Display type: Fraunces (warm, roasted-serif personality). Body: Inter.
Data/mono: JetBrains Mono.

## Getting started
```bash
npm install
npm run dev
```

## Structure
```
app/
  (marketing)/        landing page
  (auth)/              login, register, forgot-password, otp, reset
  (dashboard)/          sidebar + topbar app shell and all modules
components/
  ui/                  shadcn-style primitives (button, card, badge, table…)
  marketing/            landing page sections
  dashboard/             shell, charts, widgets
  volunteers/ events/     feature-specific pieces
data/                   mock data (volunteers, events, certs, leaderboard…)
types/                  shared TS types
lib/                    utils, mock query client
```
