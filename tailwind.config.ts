import type { Config } from "tailwindcss";

// ─── VolunteerOS AI — "Roastery" design tokens ───────────────────────────
// A volunteer program is run like a good roastery: a clear origin (the
// volunteer), a process (recruit → brew/train → serve → recognize), and a
// warmth that keeps people coming back. The palette pulls from roasted
// beans, crema, and parchment paper — not the generic blue SaaS default.

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — mapped to CSS variables set per-theme in globals.css
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        ring: "hsl(var(--ring))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",

        // Core roast scale
        espresso: {
          50: "#FAF6F1",
          100: "#F3EAE0",
          200: "#E4D1BC",
          300: "#D0B08C",
          400: "#B98A5E",
          500: "#8C5E3C", // primary — roasted coffee
          600: "#6F4E37", // deep roast
          700: "#54392A",
          800: "#3B271D",
          900: "#241811",
          950: "#160E09",
        },
        crema: {
          50: "#FFFBF5",
          100: "#FDF3E7",
          200: "#F7E3C7",
          300: "#EFCB98", // secondary accent — crema / caramel
          400: "#E3AD65",
          500: "#D68C45",
        },
        sage: {
          400: "#8CA372",
          500: "#6B8E4E", // success — used sparingly, like a mint leaf
          600: "#547239",
        },
        rust: {
          400: "#D9754A",
          500: "#C25A32", // warning / alert — burnt caramel, not red
          600: "#A3462A",
        },
        parchment: "#FAF6F1", // light background
        bark: "#2B1D14", // dark background
        ink: "#241811", // primary text on light
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        warm: "0 8px 30px -8px rgba(43, 29, 20, 0.25)",
        "warm-lg": "0 20px 60px -12px rgba(43, 29, 20, 0.35)",
        glass: "0 4px 24px -4px rgba(43, 29, 20, 0.12)",
      },
      backgroundImage: {
        "roast-gradient":
          "radial-gradient(120% 120% at 10% 0%, #B98A5E 0%, #8C5E3C 45%, #3B271D 100%)",
        "crema-swirl":
          "linear-gradient(135deg, #EFCB98 0%, #D68C45 50%, #8C5E3C 100%)",
        grain:
          "repeating-linear-gradient(0deg, rgba(43,29,20,0.03) 0px, rgba(43,29,20,0.03) 1px, transparent 1px, transparent 3px)",
      },
      keyframes: {
        "steam-rise": {
          "0%": { transform: "translateY(0) scaleX(1)", opacity: "0.5" },
          "50%": { transform: "translateY(-14px) scaleX(1.15)", opacity: "0.2" },
          "100%": { transform: "translateY(-28px) scaleX(0.9)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "steam-1": "steam-rise 3.2s ease-in-out infinite",
        "steam-2": "steam-rise 3.6s ease-in-out 0.6s infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
