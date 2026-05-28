import { useEffect, useRef, useState } from "react";
import {
  Droplet,
  Github,
  Key,
  ArrowRight,
  Check,
  Copy,
  Menu,
  Zap,
  ShieldCheck,
  Globe2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LoginModal } from "@/components/login/LoginModal";

const NAV = [
  { id: "getting-started", label: "Getting Started" },
  { id: "authentication", label: "Authentication" },
  { id: "endpoints", label: "Endpoints" },
  { id: "schema", label: "Response Schema" },
  { id: "errors", label: "Error Codes" },
  { id: "rate-limits", label: "Rate Limits" },
];

const CURL = `curl https://api.brewwater.de/v1/water-profile?city=Berlin \\
  -H "Authorization: Bearer bw_live_sk_..."`;

const JS = `const res = await fetch(
  "https://api.brewwater.de/v1/water-profile?city=Berlin",
  { headers: { Authorization: "Bearer bw_live_sk_..." } }
);
const data = await res.json();
console.log(data.ph, data.total_hardness_dh);`;

const PY = `import requests

r = requests.get(
    "https://api.brewwater.de/v1/water-profile",
    params={"city": "Berlin"},
    headers={"Authorization": "Bearer bw_live_sk_..."},
)
data = r.json()
print(data["ph"], data["total_hardness_dh"])`;

const RESPONSE = `{
  "city": "Berlin",
  "plz": "10115",
  "supplier": "Berliner Wasserbetriebe",
  "measured_at": "2026-04-12T08:00:00Z",
  "ph": 7.6,
  "total_hardness_dh": 18.4,
  "hardness_class": "hard",
  "calcium_mgl": 105,
  "magnesium_mgl": 9.2,
  "sodium_mgl": 38,
  "chloride_mgl": 56,
  "sulfate_mgl": 120,
  "nitrate_mgl": 6.1,
  "bicarbonate_mgl": 198,
  "residual_alkalinity_dh": 4.8
}`;

const PARAMS = [
  { name: "plz", type: "string", req: "optional", desc: "5-digit German postal code. Either plz or city is required." },
  { name: "city", type: "string", req: "optional", desc: "City name (e.g. \"Berlin\"). Case-insensitive." },
  { name: "include", type: "string[]", req: "optional", desc: "Comma-separated extras: minerals, history, brewing." },
];

const SCHEMA = [
  { f: "city", t: "string", d: "City name the profile applies to." },
  { f: "plz", t: "string", d: "Representative postal code for the supply area." },
  { f: "supplier", t: "string", d: "Water utility operating the network." },
  { f: "measured_at", t: "ISO 8601", d: "Timestamp of the most recent measurement." },
  { f: "ph", t: "number", d: "pH value of the drinking water (0–14)." },
  { f: "total_hardness_dh", t: "number", d: "Total hardness in German degrees (°dH)." },
  { f: "hardness_class", t: "enum", d: "One of soft, medium, hard." },
  { f: "calcium_mgl", t: "number", d: "Calcium concentration in mg/L." },
  { f: "magnesium_mgl", t: "number", d: "Magnesium concentration in mg/L." },
  { f: "sodium_mgl", t: "number", d: "Sodium concentration in mg/L." },
  { f: "chloride_mgl", t: "number", d: "Chloride concentration in mg/L." },
  { f: "sulfate_mgl", t: "number", d: "Sulfate concentration in mg/L." },
  { f: "nitrate_mgl", t: "number", d: "Nitrate concentration in mg/L." },
  { f: "bicarbonate_mgl", t: "number", d: "Bicarbonate (HCO₃⁻) concentration in mg/L." },
  { f: "residual_alkalinity_dh", t: "number", d: "Residual alkalinity in °dH — useful for brewing." },
];

const ERRORS = [
  { code: "400", name: "bad_request", desc: "Missing or invalid query parameters." },
  { code: "401", name: "unauthorized", desc: "API key missing, malformed, or revoked." },
  { code: "404", name: "not_found", desc: "No profile available for the given plz or city." },
  { code: "429", name: "rate_limited", desc: "You exceeded your plan's request quota." },
  { code: "500", name: "server_error", desc: "Unexpected error — please retry with backoff." },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-[var(--code-bg)] shadow-sm">
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-3 top-3 inline-flex h-7 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 text-xs text-[var(--code-fg)] opacity-0 transition group-hover:opacity-100 hover:bg-white/10"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-[var(--code-fg)] font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Tabs({ tabs }: { tabs: { label: string; code: string }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition whitespace-nowrap ${
              active === i
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <CodeBlock code={tabs[active].code} />
      </div>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <div>
          {eyebrow && (
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </div>
          )}
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <div className="space-y-7 text-[16px] leading-relaxed text-muted-foreground max-w-2xl">
          {children}
        </div>
      </div>
    </section>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-background p-0 border-r border-border">
        <div className="flex h-20 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Droplet className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">brewwater</span>
        </div>
        <nav className="px-6 py-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            API Reference
          </div>
          <ul className="mt-4 space-y-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-[15px] text-foreground/80 transition hover:bg-accent hover:text-accent-foreground"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-6xl px-4 sm:mt-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]" style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, oklch(0.62 0.28 264) 0%, oklch(0.45 0.3 264) 55%, oklch(0.32 0.28 264) 100%)",
      }}>
        <div className="relative grid gap-6 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10 lg:px-16 lg:py-24">
          {/* Left cards */}
          <div className="hidden flex-col gap-6 lg:flex">
            {[
              { label: "GET /water-profile", icon: Globe2 },
              { label: "ph: 7.6 · °dH 18.4", icon: Activity },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-4 w-4" />
                </div>
                <div className="font-mono text-xs text-foreground/80">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Center device */}
          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-3xl bg-white/95 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-muted-foreground">Live</span>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">200 OK</span>
              </div>
              <div className="mt-4 rounded-xl bg-foreground/[0.04] p-3 font-mono text-[11px] leading-relaxed text-foreground/80">
{`{
  "city": "Berlin",
  "ph": 7.6,
  "total_hardness_dh": 18.4,
  "hardness_class": "hard"
}`}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["pH", "°dH", "Ca"].map((m) => (
                  <div key={m} className="rounded-lg bg-foreground/[0.04] py-2 text-center">
                    <div className="text-[10px] text-muted-foreground">{m}</div>
                    <div className="font-mono text-xs font-semibold text-foreground">
                      {m === "pH" ? "7.6" : m === "°dH" ? "18.4" : "105"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right cards */}
          <div className="hidden flex-col gap-6 lg:flex lg:items-end">
            {[
              { label: "supplier: Berliner Wasser", icon: ShieldCheck },
              { label: "12ms response · EU", icon: Zap },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-4 w-4" />
                </div>
                <div className="font-mono text-xs text-foreground/80">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: "Welche Städte sind über die API verfügbar?",
    a: "Aktuell sind über 50 deutsche Städte abgedeckt, darunter Berlin, Hamburg, München, Köln, Frankfurt, Stuttgart, Düsseldorf, Leipzig und viele mehr. Die Liste wird laufend erweitert.",
  },
  {
    q: "Wie authentifiziere ich mich bei der API?",
    a: "Jede Anfrage benötigt einen Bearer-Token im Authorization-Header. API-Keys erhalten Sie nach der Registrierung in Ihrem brewwater-Dashboard unter Settings → API Keys.",
  },
  {
    q: "Wie aktuell sind die Wasserdaten?",
    a: "Die Daten werden direkt von den offiziellen Wasserversorgern bezogen und regelmäßig aktualisiert — in der Regel monatlich oder bei Änderungen durch den Versorger.",
  },
  {
    q: "Gibt es einen kostenlosen Tarif?",
    a: "Ja — der Free-Tarif erlaubt 60 Anfragen pro Minute und 10.000 Anfragen pro Monat. Keine Kreditkarte erforderlich. Für höhere Volumen bieten wir kostenpflichtige Tarife an.",
  },
  {
    q: "Kann ich die API in meine Brauerei-Software integrieren?",
    a: "Absolut. Die REST-API liefert alle brauereitauglichen Parameter wie pH, Gesamthärte, Restalkalität, Calcium, Magnesium und weitere Mineralien direkt als JSON — kompatibel mit allen gängigen Brauerei-Tools.",
  },
];

function FaqItem({ num, q, a }: { num: string; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-[#f4f4f5]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-6 px-8 py-10 text-left"
      >
        <span className="shrink-0 w-8 pt-0.5 text-sm font-medium tabular-nums text-foreground/30 select-none">{num}</span>
        <span className="flex-1 text-[17px] font-semibold text-foreground leading-snug">{q}</span>
        <span className="shrink-0 mt-0.5 text-2xl font-thin text-foreground/40 select-none leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-8 pb-8 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
      </div>
    </div>
  );
}

function FaqList() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {FAQS.map((f, i) => (
        <FaqItem
          key={i}
          num={String(i + 1).padStart(2, "0")}
          q={f.q}
          a={f.a}
        />
      ))}
    </div>
  );
}

export function ApiDocs() {
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const loginBtnRef = useRef<HTMLButtonElement>(null);


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Droplet className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">brewwater</span>
            <span className="ml-2 hidden rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground sm:inline-block">
              API
            </span>
          </div>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.slice(0, 4).map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="text-sm font-medium text-foreground/70 transition hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:inline-flex">
              <Github className="h-4 w-4" /> GitHub
            </Button>
            <div
              className="relative"
              onMouseEnter={() => setLoginOpen(true)}
              onMouseLeave={() => setLoginOpen(false)}
            >
              <Button
                ref={loginBtnRef}
                size="sm"
                className="rounded-full px-4"
              >
                Log in
              </Button>
              {loginOpen && (
                <div
                  ref={loginRef}
                  className="absolute right-0 top-[calc(100%+8px)] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <LoginModal />
                </div>
              )}
            </div>
            <MobileNav />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 pb-4 pt-20 text-center sm:px-6 sm:pt-32 lg:pt-40">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              REST API · JSON · 50+ deutsche Städte
            </div>
            <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl xl:text-[88px] xl:leading-[0.95]">
              Wasserdaten,{" "}
              <span className="text-primary">direkt in Ihre Systeme.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Eine einzige Schnittstelle für pH, Härte, Mineralien und brauereitaugliche
              Wasserchemie — verlässlich, dokumentiert, sofort einsatzbereit.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="h-12 gap-2 rounded-full px-6 text-base">
                <Key className="h-4 w-4" /> API Key anfordern
              </Button>
              <Button size="lg" variant="outline" className="h-12 gap-2 rounded-full border-foreground/15 px-6 text-base">
                Dokumentation lesen <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <HeroIllustration />
        </section>

        {/* Browser Mockup — Code Playground */}
        <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6 sm:mt-32 lg:px-10">
          <div className="text-center mb-12">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live Playground
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Eine Anfrage — alle Wasserdaten.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Einfache REST-API, sofort einsatzbereit. Kein SDK, keine Konfiguration.
            </p>
          </div>

          {/* Browser frame */}
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="rounded-md bg-background border border-border px-3 py-1 text-xs text-muted-foreground font-mono">
                  api.brewwater.de/v1/water-profile?city=Hamburg
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-muted-foreground">200 OK · 14ms</span>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="grid lg:grid-cols-[260px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-border bg-white min-h-[540px]">
              {/* Sidebar */}
              <div className="bg-[#f8f9fa] p-5 overflow-hidden">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-2 mb-4">Hamburg · 5 Werke</div>
                <div className="space-y-1.5">
                  {[
                    { name: "Baursberg", sub: "Wasserwerk", plz: "5 PLZ", active: false },
                    { name: "Billbrook", sub: "Wasserwerk", plz: "8 PLZ", active: false },
                    { name: "Langenhorn", sub: "Wasserwerk", plz: "1 PLZ", active: false },
                    { name: "Rothenburgsort", sub: "Wasserwerk", plz: "20 PLZ", active: true },
                    { name: "Stellingen", sub: "Wasserwerk", plz: "6 PLZ", active: false },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className={`rounded-xl px-3 py-3 ${item.active ? "bg-white shadow-sm border border-border" : "hover:bg-white/60"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[13px] font-medium ${item.active ? "text-foreground" : "text-slate-500"}`}>{item.name}</span>
                        {item.plz && <span className="text-[11px] text-slate-400">{item.plz}</span>}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="bg-white p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Rothenburgsort</h3>
                    <p className="text-[12px] text-slate-400 mt-1">HAMBURG WASSER · Wasserwerk</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-600 border border-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Aktuell
                  </span>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                  {[
                    { label: "Gesamthärte", value: "8.7", unit: "°dH" },
                    { label: "pH-Wert", value: "7.6", unit: "" },
                    { label: "Calcium", value: "50", unit: "mg/L" },
                    { label: "Datenstand", value: "2025", unit: "" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-[#f8f9fa] px-4 py-4">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{s.label}</div>
                      <div className="text-2xl font-semibold text-foreground tracking-tight">
                        {s.value}<span className="text-sm font-normal text-slate-400 ml-1">{s.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Values grid */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">Alle Wasserwerte</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
                    {[
                      { l: "Gesamthärte", v: "8.7 °dH" },
                      { l: "Karbonathärte", v: "5.4 °dH" },
                      { l: "Säurekapazität", v: "1.93 mmol/L" },
                      { l: "Calcium", v: "50 mg/L" },
                      { l: "Magnesium", v: "6 mg/L" },
                      { l: "Natrium", v: "18 mg/L" },
                      { l: "Chlorid", v: "32 mg/L" },
                      { l: "Sulfat", v: "44 mg/L" },
                      { l: "Nitrat", v: "3.1 mg/L" },
                      { l: "Hydrogencarbonat", v: "119 mg/L" },
                      { l: "Restalkalität", v: "2.6 °dH" },
                      { l: "pH-Wert", v: "7.6" },
                    ].map((item) => (
                      <div key={item.l} className="flex flex-col">
                        <div className="text-[11px] text-slate-400">{item.l}</div>
                        <div className="text-[14px] font-medium text-foreground mt-0.5">{item.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6 sm:mt-32">
          <div className="grid grid-cols-2 gap-y-10 border-y border-border py-12 sm:grid-cols-4">
            {[
              { k: "50+", v: "Städte abgedeckt" },
              { k: "99.98%", v: "Uptime SLA" },
              { k: "<20ms", v: "Median Latenz" },
              { k: "v1.4.2", v: "Stabile API" },
            ].map((s) => (
              <div key={s.k} className="px-4 text-center sm:border-r sm:border-border sm:last:border-r-0">
                <div className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {s.k}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <Section id="getting-started" eyebrow="01" title="Getting Started">
            <p>
              In unter einer Minute zur ersten erfolgreichen Anfrage. Erstellen Sie einen API-Key
              in Ihrem Dashboard und senden Sie eine GET-Anfrage mit einer PLZ oder Stadt.
            </p>
            <ol className="space-y-6">
              {[
                { t: "API-Key erstellen", d: "Melden Sie sich bei brewwater.de an und erzeugen Sie einen Key unter Settings → API." },
                { t: "Anfrage authentifizieren", d: "Übergeben Sie den Key als Bearer-Token im Authorization-Header." },
                { t: "Stadt abfragen", d: "Senden Sie eine GET-Anfrage mit einem plz- oder city-Parameter." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-5">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">{s.t}</div>
                    <div className="mt-1 text-[15px] text-muted-foreground">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <CodeBlock code={CURL} />
          </Section>

          <Section id="authentication" eyebrow="02" title="Authentication">
            <p>
              Jede Anfrage benötigt einen{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">Authorization</code>{" "}
              Header mit einem Bearer-Token. Es gibt zwei Key-Typen:{" "}
              <strong className="text-foreground">test</strong> (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">bw_test_sk_</code>
              ) und <strong className="text-foreground">live</strong> (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">bw_live_sk_</code>
              ).
            </p>
            <CodeBlock code={`Authorization: Bearer bw_live_sk_4f8a...c91d`} />
          </Section>

          <Section id="endpoints" eyebrow="03" title="Endpoints">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 font-mono text-sm overflow-x-auto">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary whitespace-nowrap">GET</span>
              <span className="text-foreground whitespace-nowrap">/api/v1/water-profile</span>
            </div>
            <p>Liefert die zuletzt gemessene Wasserchemie für eine deutsche Stadt oder PLZ.</p>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Query parameters</h3>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Required</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {PARAMS.map((p) => (
                      <tr key={p.name}>
                        <td className="px-4 py-3 font-mono text-[13px] text-foreground">{p.name}</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{p.type}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.req}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Example request</h3>
              <Tabs
                tabs={[
                  { label: "cURL", code: CURL },
                  { label: "JavaScript", code: JS },
                  { label: "Python", code: PY },
                ]}
              />
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Example response</h3>
              <CodeBlock code={RESPONSE} />
            </div>
          </Section>

          <Section id="schema" eyebrow="04" title="Response Schema">
            <p>Jede erfolgreiche Antwort liefert ein flaches JSON-Objekt mit den folgenden Feldern.</p>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {SCHEMA.map((s) => (
                    <tr key={s.f}>
                      <td className="px-4 py-3 font-mono text-[13px] text-foreground">{s.f}</td>
                      <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{s.t}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="errors" eyebrow="05" title="Error Codes">
            <p>
              brewwater nutzt konventionelle HTTP-Status-Codes. Fehler liefern ein JSON-Objekt mit{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">error</code> und{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">message</code>.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[420px] text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {ERRORS.map((e) => (
                    <tr key={e.code}>
                      <td className="px-4 py-3 font-mono text-[13px] text-foreground">{e.code}</td>
                      <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{e.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="rate-limits" eyebrow="06" title="Rate Limits">
            <p>
              Der kostenlose Tarif erlaubt 60 Anfragen/Minute und 10.000 Anfragen/Monat. Bezahlte
              Tarife skalieren bis 10.000 Anfragen/Minute. Jede Antwort enthält die aktuellen
              Limits in den Headern:
            </p>
            <CodeBlock
              code={`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1716831600`}
            />
            <p>
              Beim Überschreiten erhalten Sie{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">429 rate_limited</code>.
              Wiederholen Sie nach dem Zeitstempel in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">X-RateLimit-Reset</code>.
            </p>
          </Section>

          {/* FAQ */}
          <div className="py-20 sm:py-28">
            <div className="text-center mb-14">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Brauchen Sie Hilfe?
              </div>
              <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Fragen und Antworten</h2>
            </div>
            <FaqList />
          </div>

          {/* CTA */}
          <div className="py-20 sm:py-28">
            <div
              className="relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16 sm:py-24"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 0%, oklch(0.62 0.28 264) 0%, oklch(0.4 0.3 264) 100%)",
              }}
            >
              <h3 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Bereit, Wasserdaten zu integrieren?
              </h3>
              <p className="mx-auto mt-5 max-w-xl text-white/80 sm:text-lg">
                Kostenloser Tarif — keine Kreditkarte erforderlich. In wenigen Minuten live.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" variant="secondary" className="h-12 gap-2 rounded-full bg-white px-6 text-base text-foreground hover:bg-white/90">
                  API Key anfordern <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 gap-2 rounded-full border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white">
                  Vertrieb kontaktieren
                </Button>
              </div>
            </div>
          </div>
        </div>

        <footer
          style={{
            background: "linear-gradient(135deg, oklch(0.45 0.28 264) 0%, oklch(0.32 0.3 264) 100%)",
          }}
          className="mt-0 overflow-hidden"
        >
          {/* Main footer links */}
          <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 lg:px-10">
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
              {/* Logo */}
              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white">
                    <Droplet className="h-4 w-4" />
                  </div>
                  <span className="text-base font-semibold text-white tracking-tight">brewwater</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Wasserdaten für Entwickler und Brauer.
                </p>
              </div>

              {/* API */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">API</div>
                <ul className="space-y-3 text-sm text-white/75">
                  {["Getting Started", "Authentication", "Endpoints", "Rate Limits"].map((l) => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>

              {/* Ressourcen */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Ressourcen</div>
                <ul className="space-y-3 text-sm text-white/75">
                  {["Changelog", "Status", "GitHub", "brewwater.de"].map((l) => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Support</div>
                <ul className="space-y-3 text-sm text-white/75">
                  {["Kontakt", "Impressum", "Datenschutz"].map((l) => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Divider + copyright */}
            <div className="mt-12 border-t border-white/15 pt-6 flex flex-col gap-2 sm:flex-row sm:justify-between text-xs text-white/40">
              <span>Copyright © {new Date().getFullYear()} brewwater. All Rights Reserved.</span>
              <div className="flex gap-5">
                <a href="#" className="hover:text-white/70 transition-colors">Datenschutzerklärung</a>
                <a href="#" className="hover:text-white/70 transition-colors">Impressum</a>
              </div>
            </div>
          </div>

          {/* Large wordmark */}
          <div className="select-none overflow-hidden px-4 pb-0 text-center">
            <span
              className="inline-block text-[clamp(4rem,18vw,14rem)] font-extrabold leading-none tracking-tight"
              style={{ color: "rgba(255,255,255,0.15)" }}
            >
              brewwater
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
