import { Droplet, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

type BadgeType = "launch" | "feature" | "improved" | "fix" | "data";

const BADGE: Record<BadgeType, { label: string; color: string }> = {
  launch:   { label: "Launch",    color: "bg-violet-100 text-violet-700 border-violet-200" },
  feature:  { label: "Feature",   color: "bg-blue-100 text-blue-700 border-blue-200" },
  improved: { label: "Improved",  color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  fix:      { label: "Fix",       color: "bg-amber-100 text-amber-700 border-amber-200" },
  data:     { label: "Daten",     color: "bg-sky-100 text-sky-700 border-sky-200" },
};

type ChangelogItem = {
  date: string;
  version: string;
  badge: BadgeType;
  title: string;
  sections: {
    heading?: string;
    items: string[];
  }[];
};

const ENTRIES: ChangelogItem[] = [
  {
    date: "1. Juni 2026",
    version: "v1.0.0",
    badge: "launch",
    title: "API Launch — GET /v1/water ist live",
    sections: [
      {
        heading: "Neue Endpoints",
        items: [
          "GET /v1/water?plz=<PLZ> — Wasserprofil für eine deutsche PLZ",
          "format=minimal für kompakte Antworten (Härte, pH, Calcium, Magnesium)",
        ],
      },
      {
        heading: "Abdeckung",
        items: [
          "20+ deutsche Städte zum Launch: Hamburg, Berlin, München, Köln, Frankfurt, Stuttgart, Düsseldorf, Hannover, Bremen, Essen, Dortmund, Leipzig, Dresden, Nürnberg, Ulm u.v.m.",
          "~700 Postleitzahlen mit direkter PLZ-Zuordnung",
        ],
      },
      {
        heading: "API Key & Pläne",
        items: [
          "Authentifizierung via X-API-Key Header",
          "Free: 100 Anfragen/Monat — kostenlos, keine Kreditkarte",
          "Starter: 1.000 Anfragen/Monat",
          "Pro: 10.000 Anfragen/Monat",
          "Unlimited: unbegrenzt",
        ],
      },
      {
        heading: "Response-Felder",
        items: [
          "Gesamthärte (°dH), Karbonathärte, Säurekapazität KS4,3",
          "Calcium, Magnesium, Natrium, Chlorid, Sulfat, Hydrogencarbonat",
          "pH-Wert, Leitfähigkeit (µS/cm)",
          "Metadaten: Wasserwerk, Versorger, Datenstand, Quelle, Konfidenz",
        ],
      },
      {
        heading: "Rate Limit Header",
        items: [
          "X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset (ISO 8601)",
          "X-Request-Id für Debugging",
        ],
      },
    ],
  },
];

function Badge({ type }: { type: BadgeType }) {
  const b = BADGE[type];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${b.color}`}>
      {b.label}
    </span>
  );
}

function Entry({ entry }: { entry: ChangelogItem }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[200px_1fr] lg:gap-6">
      {/* Left: date + version — inline on mobile, sidebar on desktop */}
      <div className="flex items-center gap-3 lg:block lg:pt-1">
        <div className="text-sm font-medium text-foreground">{entry.date}</div>
        <div className="font-mono text-xs text-muted-foreground lg:mt-1">{entry.version}</div>
      </div>

      {/* Right: content */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Badge type={entry.badge} />
          <h2 className="text-lg font-semibold text-foreground">{entry.title}</h2>
        </div>

        <div className="space-y-5">
          {entry.sections.map((sec, i) => (
            <div key={i}>
              {sec.heading && (
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  {sec.heading}
                </div>
              )}
              <ul className="space-y-1.5">
                {sec.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-[14px] text-muted-foreground leading-relaxed">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Droplet className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">brewwater</span>
          <span className="ml-1 hidden rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground sm:inline-block">
            API
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm lg:flex">
          <a href="/#getting-started" className="text-muted-foreground hover:text-foreground transition">Docs</a>
          <a href="/changelog" className="text-foreground font-medium">Changelog</a>
          <a
            href="mailto:api@brewwater.de?subject=API Key Anfrage"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            API Key anfordern
          </a>
        </nav>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-background p-0 border-r border-border">
            <div className="flex h-16 items-center gap-2 border-b border-border px-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Droplet className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-tight">brewwater API</span>
            </div>
            <nav className="px-6 py-8 space-y-2 text-sm">
              <a href="/" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent">Dokumentation</a>
              <a href="/changelog" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 font-medium text-foreground bg-accent">Changelog</a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function Changelog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            brewwater API
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Changelog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Alle Änderungen, neuen Features und Bugfixes der brewwater API — immer aktuell.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-8">
          {/* Vertical line — desktop only */}
          <div className="absolute top-0 bottom-0 w-px bg-border hidden lg:block" style={{ left: "200px" }} />

          {ENTRIES.map((entry, i) => (
            <div key={i} className="relative lg:pl-10">
              {/* Dot on timeline — desktop only */}
              <div className="absolute top-[6px] h-2 w-2 rounded-full bg-primary hidden lg:block" style={{ left: "196px" }} />
              <Entry entry={entry} />
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Fragen zu einem Release?{" "}
            <a href="mailto:api@brewwater.de" className="text-foreground underline underline-offset-2 hover:text-primary transition">
              api@brewwater.de
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} brewwater. Alle Rechte vorbehalten.</span>
          <div className="flex gap-5">
            <a href="https://brewwater.de/impressum" className="hover:text-foreground transition">Impressum</a>
            <a href="https://brewwater.de/datenschutz" className="hover:text-foreground transition">Datenschutz</a>
            <a href="https://brewwater.de" className="hover:text-foreground transition">brewwater.de</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
