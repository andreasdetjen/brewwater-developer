import { useEffect, useRef, useState } from "react";
import {
  Droplet,

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

const NAV = [
  { id: "getting-started", label: "Getting Started" },
  { id: "authentication", label: "Authentication" },
  { id: "endpoints", label: "Endpoints" },
  { id: "schema", label: "Response Schema" },
  { id: "errors", label: "Error Codes" },
  { id: "rate-limits", label: "Rate Limits" },
  { id: "pricing", label: "Preise" },
];

const CURL = `curl "https://api.brewwater.de/v1/water?plz=20095" \\
  -H "X-API-Key: bw_live_..."`;

const JS = `const res = await fetch(
  "https://api.brewwater.de/v1/water?plz=20095",
  { headers: { "X-API-Key": "bw_live_..." } }
);
const data = await res.json();
console.log(data.values.ph, data.values.total_hardness_dH);`;

const PY = `import requests

r = requests.get(
    "https://api.brewwater.de/v1/water",
    params={"plz": "20095"},
    headers={"X-API-Key": "bw_live_..."},
)
data = r.json()
print(data["values"]["ph"], data["values"]["total_hardness_dH"])`;

const RESPONSE = `{
  "plz": "20095",
  "city": "Hamburg",
  "district": "Rothenburgsort",
  "waterworks": "HAMBURG WASSER",
  "provider": "HAMBURG WASSER",
  "precision": "waterworks",
  "confidence": "high",
  "data_date": "2025-01-01",
  "source": {
    "name": "HAMBURG WASSER Jahresbericht 2024",
    "url": "https://www.hamburgwasser.de"
  },
  "values": {
    "total_hardness_dH": 8.7,
    "carbonate_hardness_dH": 5.4,
    "acid_capacity_KS43_mmolL": 1.93,
    "calcium_mgL": 50,
    "magnesium_mgL": 6,
    "sodium_mgL": 18,
    "chloride_mgL": 32,
    "sulfate_mgL": 44,
    "hydrogencarbonate_mgL": 119,
    "ph": 7.6,
    "conductivity_uScm": 320
  }
}`;

const PARAMS = [
  { name: "plz", type: "string", req: "required", desc: "5-stellige deutsche Postleitzahl. Beispiel: 20095" },
  { name: "format", type: "string", req: "optional", desc: "\"full\" (Standard) oder \"minimal\" — minimal liefert nur Härte, Calcium, Magnesium und pH." },
];

const SCHEMA = [
  { f: "plz", t: "string", d: "Abgefragte Postleitzahl." },
  { f: "city", t: "string", d: "Stadtname des Versorgungsgebiets." },
  { f: "district", t: "string|null", d: "Stadtteil oder Versorgungszone, falls bekannt." },
  { f: "waterworks", t: "string", d: "Name des Wasserwerks." },
  { f: "provider", t: "string", d: "Name des Wasserversorgers." },
  { f: "precision", t: "string", d: "Genauigkeit der PLZ-Zuordnung: waterworks, supply_area oder city." },
  { f: "confidence", t: "string", d: "Vertrauensniveau: high, medium oder low." },
  { f: "data_date", t: "string", d: "Datum des Analysedatenstands (YYYY-MM-DD)." },
  { f: "source.name", t: "string", d: "Quellenbezeichnung (z. B. Jahresbericht des Versorgers)." },
  { f: "source.url", t: "string|null", d: "URL zur Originalquelle, sofern verfügbar." },
  { f: "values.total_hardness_dH", t: "number|null", d: "Gesamthärte in °dH. SCA-Zielbereich für Espresso: 3–8 °dH." },
  { f: "values.carbonate_hardness_dH", t: "number|null", d: "Karbonathärte in °dH." },
  { f: "values.acid_capacity_KS43_mmolL", t: "number|null", d: "Säurekapazität KS4,3 in mmol/L." },
  { f: "values.calcium_mgL", t: "number|null", d: "Calcium in mg/L — beeinflusst Extraktion und Körper." },
  { f: "values.magnesium_mgL", t: "number|null", d: "Magnesium in mg/L — verstärkt Aroma und Löslichkeit der Kaffeeöle." },
  { f: "values.sodium_mgL", t: "number|null", d: "Natrium in mg/L — zu hoch wirkt flach und süßlich." },
  { f: "values.chloride_mgL", t: "number|null", d: "Chlorid in mg/L — betont Süße und Vollmundigkeit." },
  { f: "values.sulfate_mgL", t: "number|null", d: "Sulfat in mg/L — betont Trockenheit und Bitterkeit." },
  { f: "values.hydrogencarbonate_mgL", t: "number|null", d: "Hydrogencarbonat in mg/L — Pufferwirkung, beeinflusst den pH im Brühvorgang." },
  { f: "values.ph", t: "number|null", d: "pH-Wert des Wassers (0–14). Ideal für Espresso: 6.5–7.5." },
  { f: "values.conductivity_uScm", t: "number|null", d: "Leitfähigkeit in µS/cm." },
];

const ERRORS = [
  { code: "400", name: "missing_parameter", desc: "Parameter 'plz' fehlt. Beispiel: ?plz=20095" },
  { code: "401", name: "missing_api_key", desc: "Kein API-Key übergeben. Header: X-API-Key: bw_live_..." },
  { code: "401", name: "invalid_api_key", desc: "API-Key unbekannt oder falsches Format." },
  { code: "403", name: "api_key_disabled", desc: "Der API-Key wurde deaktiviert." },
  { code: "422", name: "invalid_plz", desc: "Ungültige PLZ — muss genau 5 Ziffern haben." },
  { code: "404", name: "not_found", desc: "Keine Daten für diese PLZ. Abdeckung: ~700 PLZ in 20+ deutschen Städten." },
  { code: "429", name: "rate_limit_exceeded", desc: "Monatliches Limit erreicht. Reset-Datum steht im Header X-RateLimit-Reset." },
  { code: "500", name: "database_error", desc: "Interner Fehler — bitte mit Backoff wiederholen." },
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
    <section id={id} className="scroll-mt-32 py-20 sm:py-28 reveal">
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
            <li>
              <a
                href="/changelog"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-[15px] text-foreground/80 transition hover:bg-accent hover:text-accent-foreground"
              >
                Changelog
              </a>
            </li>
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
              { label: "GET /v1/water?plz=10115", icon: Globe2 },
              { label: "RA: 4.8 · pH 7.2 · °dH 14.1", icon: Activity },
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
              { label: "Eignung: Espresso ✓", icon: ShieldCheck },
              { label: "12ms · SCA-konform geprüft", icon: Zap },
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
    q: "Für welche Kaffeezubereitungen sind die Daten geeignet?",
    a: "Die API liefert alle Parameter, die für Espresso, Filterkaffee, Pour-over und Cold Brew relevant sind — pH, Restalkalität, Gesamthärte, Calcium, Magnesium, Sulfat und Hydrogencarbonat. Die Werte lassen sich direkt gegen SCA-Empfehlungen abgleichen.",
  },
  {
    q: "Was ist Restalkalität und warum ist sie für Espresso wichtig?",
    a: "Die Restalkalität (RA) beschreibt, wie stark das Wasser den pH-Abfall beim Brühvorgang abpuffert. Zu hohe RA macht Espresso flach und unterextrahiert, zu niedrige lässt ihn sauer wirken. Der optimale Bereich für Espresso liegt bei 1–4 °dH.",
  },
  {
    q: "Wie aktuell sind die Wasserwerte?",
    a: "Die Daten stammen direkt von den offiziellen Wasserversorgern und werden bei jeder Aktualisierung durch den Versorger neu eingespeist — in der Regel monatlich oder bei Änderungen im Netz.",
  },
  {
    q: "Gibt es einen kostenlosen Tarif?",
    a: "Ja — der Free-Tarif erlaubt 100 Anfragen pro Monat, komplett kostenlos und ohne Kreditkarte. Für Röstereien, Apps und höhere Volumen gibt es Starter (1.000/Monat), Pro (10.000/Monat) und Unlimited. Einfach anfragen.",
  },
  {
    q: "Kann ich die API in meine Kaffee-App oder Rösterei-Software integrieren?",
    a: "Absolut. Die REST-API gibt ein sauberes JSON zurück, das direkt für Extraktionsberechnungen, Wasserrezepte oder PLZ-basierte Empfehlungen genutzt werden kann — ohne SDK, ohne Konfiguration.",
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

const TEST_KEY = "bw_live_test1234567890abcdef1234567890ab";

const DEMO_CITIES = [
  { label: "Hamburg", plz: "20095" },
  { label: "Berlin", plz: "10115" },
  { label: "Hannover", plz: "30159" },
  { label: "Stuttgart", plz: "70173" },
];

type ApiResult = {
  status: number;
  ms: number;
  data: Record<string, unknown>;
} | null;

// Triggers count-up when element scrolls into view
function useScrollCountUp(target: number, duration = 1400) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      function tick(now: number) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(target * ease * 100) / 100);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { ref, display };
}

function StatCard({ prefix = "", num, suffix = "", label }: { prefix?: string; num?: number; suffix?: string; label: string }) {
  const { ref, display } = useScrollCountUp(num ?? 0);
  const formatted = num !== undefined
    ? (Number.isInteger(num) ? display.toFixed(0) : display.toFixed(2))
    : "";
  return (
    <div ref={ref} className="px-4 text-center sm:border-r sm:border-border sm:last:border-r-0">
      <div className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl tabular-nums">
        {num !== undefined ? `${prefix}${formatted}${suffix}` : `${prefix}${suffix}`}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function useCountUp(target: number | null, duration = 600) {
  const [display, setDisplay] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === null) { setDisplay(null); return; }
    const finalTarget = target;
    const start = performance.now();
    const from = 0;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = from + (finalTarget - from) * ease;
      setDisplay(Math.round(val * 100) / 100);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return display;
}

function AnimatedStat({ value, unit, label }: { value: unknown; unit: string; label: string }) {
  const num = typeof value === "number" ? value : null;
  const displayed = useCountUp(num);
  return (
    <div className="rounded-xl border border-border bg-[#f8f9fa] px-3 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</div>
      <div className="text-xl font-semibold text-foreground tracking-tight">
        {displayed != null ? displayed : (value != null ? String(value) : "—")}
        <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>
      </div>
    </div>
  );
}

function LivePlayground() {
  const [plz, setPlz] = useState("");
  const [typingPlz, setTypingPlz] = useState(""); // animated display value
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const didAutoDemo = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  async function fetchWater(targetPlz: string) {
    if (!/^\d{5}$/.test(targetPlz.trim())) {
      setError("Bitte eine gültige 5-stellige PLZ eingeben.");
      return;
    }
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    // Keep previous result visible while loading — don't flash empty
    const start = Date.now();
    try {
      const res = await fetch(
        `https://api.brewwater.de/v1/water?plz=${targetPlz.trim()}`,
        { headers: { "X-API-Key": TEST_KEY }, signal: controller.signal },
      );
      const ms = Date.now() - start;
      const data = await res.json();
      // Remove external source URL — we don't link away from our portal
      if (data?.source) delete data.source.url;
      setResult({ status: res.status, ms, data });
      setResultKey((k) => k + 1);
      setError(null);
    } catch (err) {
      // Ignore AbortError — it's intentional when a new request starts
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Verbindung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-demo on mount: type PLZ character by character, then fire
  useEffect(() => {
    if (didAutoDemo.current) return;
    didAutoDemo.current = true;
    const target = "20095";
    let i = 0;
    const interval = setInterval(() => {
      i++;
      const current = target.slice(0, i);
      setPlz(current);
      setTypingPlz(current);
      if (i === target.length) {
        clearInterval(interval);
        setTimeout(() => fetchWater(target), 400);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchWater(plz);
  }

  function handleChip(chipPlz: string) {
    setPlz(chipPlz);
    setTypingPlz(chipPlz);
    fetchWater(chipPlz);
  }

  const values = result?.data?.values as Record<string, unknown> | undefined;

  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6 sm:mt-32 lg:px-10">
      <div className="text-center mb-12">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Playground
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Echte Daten — PLZ eingeben, fertig.
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
          Gib eine deutsche PLZ ein und sieh die echten Wasserwerte direkt aus der API.
        </p>
      </div>

      {/* Browser frame */}
      <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Browser chrome */}
        <div className="border-b border-border bg-muted/40 px-3 py-2.5 sm:px-4 sm:py-3">
          {/* Top row: dots + status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            {result && (
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${result.status === 200 ? "bg-emerald-400" : "bg-red-400"}`} />
                <span className="text-[10px] text-muted-foreground">{result.status} · {result.ms}ms</span>
              </div>
            )}
          </div>
          {/* URL bar + button */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div
              className="flex flex-1 items-center rounded-md bg-background border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground cursor-text min-w-0"
              onClick={() => inputRef.current?.focus()}
            >
              <span className="hidden sm:inline shrink-0">api.brewwater.de/v1/water?plz=</span>
              <span className="sm:hidden shrink-0 text-muted-foreground/60">…/water?plz=</span>
              <input
                ref={inputRef}
                value={plz}
                onChange={(e) => { setPlz(e.target.value); setTypingPlz(e.target.value); }}
                maxLength={5}
                className="w-[3.5rem] bg-transparent text-foreground outline-none font-mono caret-primary"
                placeholder="00000"
                aria-label="PLZ eingeben"
              />
              {loading && (
                <span className="ml-2 h-3 w-3 rounded-full border-2 border-primary/30 border-t-primary animate-spin shrink-0" />
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "…" : "↵"}
            </button>
          </form>
        </div>

        {/* City chips */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-3 py-2 overflow-x-auto sm:px-4">
          <span className="text-[10px] text-muted-foreground shrink-0">Schnell:</span>
          {DEMO_CITIES.map((c) => (
            <button
              key={c.plz}
              onClick={() => handleChip(c.plz)}
              disabled={loading}
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition ${
                plz === c.plz
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              } disabled:opacity-40`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Content — JSON top, visual bottom on mobile; side-by-side on desktop */}
        <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border min-h-[420px]">
          {/* Left: JSON */}
          <div className="bg-[#1e1e2e] p-4 sm:p-6 overflow-auto max-h-[320px] lg:max-h-none">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-3">JSON Response</div>
            {!result && !loading && !error && (
              <div className="text-white/20 text-sm font-mono">{`// Warte auf Antwort…`}</div>
            )}
            {loading && !result && (
              <div className="space-y-2">
                {[80, 60, 90, 50, 70].map((w, i) => (
                  <div key={i} className={`h-3 rounded bg-white/10 animate-pulse`} style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            )}
            {error && !loading && <div className="text-red-400 text-sm font-mono">{`// ${error}`}</div>}
            {result && (
              <pre
                key={resultKey}
                className="text-[12px] leading-relaxed font-mono overflow-x-auto whitespace-pre-wrap"
                style={{ animation: "fadeIn 0.3s ease" }}
              >
                {JSON.stringify(result.data, null, 2)
                  .split("\n")
                  .map((line, i) => {
                    const isKey = /^\s+"[^"]+":/.test(line);
                    const isStr = /:\s+"/.test(line);
                    const isNum = /:\s+[\d.]+/.test(line) && !isStr;
                    return (
                      <span key={i} className={isNum ? "text-amber-300" : isStr ? "text-emerald-300" : isKey ? "text-sky-300" : "text-white/50"}>
                        {line}{"\n"}
                      </span>
                    );
                  })}
              </pre>
            )}
          </div>

          {/* Right: Visual */}
          <div className="bg-white p-5 sm:p-8">
            {!result && !loading && (
              <div className="flex h-full items-center justify-center text-sm text-slate-300">
                Ergebnis erscheint hier
              </div>
            )}
            {loading && !result && (
              <div className="flex h-full items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              </div>
            )}
            {result && result.status === 200 && values && (
              <div key={resultKey} style={{ animation: "fadeIn 0.4s ease" }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{result.data.city as string}</h3>
                    <p className="text-[12px] text-slate-400 mt-1">
                      {result.data.waterworks as string} · PLZ {result.data.plz as string}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-600 border border-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {result.data.data_date as string}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
                  <AnimatedStat label="Gesamthärte" value={values.total_hardness_dH} unit="°dH" />
                  <AnimatedStat label="pH-Wert" value={values.ph} unit="" />
                  <AnimatedStat label="Calcium" value={values.calcium_mgL} unit="mg/L" />
                  <AnimatedStat label="Magnesium" value={values.magnesium_mgL} unit="mg/L" />
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Alle Werte</div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      { l: "Karbonathärte", v: values.carbonate_hardness_dH, u: "°dH" },
                      { l: "Säurekapazität", v: values.acid_capacity_KS43_mmolL, u: "mmol/L" },
                      { l: "Natrium", v: values.sodium_mgL, u: "mg/L" },
                      { l: "Chlorid", v: values.chloride_mgL, u: "mg/L" },
                      { l: "Sulfat", v: values.sulfate_mgL, u: "mg/L" },
                      { l: "Hydrogencarbonat", v: values.hydrogencarbonate_mgL, u: "mg/L" },
                      { l: "Leitfähigkeit", v: values.conductivity_uScm, u: "µS/cm" },
                    ].filter((item) => item.v != null).map((item) => (
                      <div key={item.l} className="flex flex-col">
                        <div className="text-[11px] text-slate-400">{item.l}</div>
                        <div className="text-[13px] font-medium text-foreground mt-0.5">
                          {`${item.v} ${item.u}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {result && result.status !== 200 && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">⚠️</div>
                  <div className="text-sm font-medium text-foreground">{(result.data.error as string) ?? "Fehler"}</div>
                  <div className="text-xs text-muted-foreground mt-1">{(result.data.message as string) ?? ""}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      `}</style>
    </section>
  );
}

export function ApiDocs() {


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md">
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
            <a href="/changelog" className="text-sm font-medium text-foreground/70 transition hover:text-foreground">
              Changelog
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="mailto:api@brewwater.de?subject=API Key Anfrage"
              className="hidden rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:inline-block"
            >
              API Key anfordern
            </a>
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
              REST API · JSON · Kaffeewasser für 50+ Städte
            </div>
            <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl xl:text-[88px] xl:leading-[0.95]">
              Kaffeewasser-Daten,{" "}
              <span className="text-primary">direkt in Ihre App.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Eine Schnittstelle für pH, Härte, Restalkalität und alle Parameter,
              die über Extraktion und Geschmack entscheiden — für Espresso, Filterkaffee und Cold Brew.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="h-12 gap-2 rounded-full px-6 text-base" asChild>
                <a href="mailto:api@brewwater.de?subject=API Key Anfrage&body=Hallo,%0A%0Aich möchte einen API Key für brewwater anfragen.%0A%0AMein Anwendungsfall: ">
                  <Key className="h-4 w-4" /> API Key anfordern
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 gap-2 rounded-full border-foreground/15 px-6 text-base" asChild>
                <a href="#getting-started">
                  Dokumentation lesen <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <HeroIllustration />
        </section>

        {/* Live Playground */}
        <LivePlayground />

        {/* Stats strip */}
        <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6 sm:mt-32">
          <div className="grid grid-cols-2 gap-y-8 border-y border-border py-10 sm:grid-cols-4">
            <StatCard num={50} suffix="+" label="deutsche Städte" />
            <StatCard num={99.98} suffix="%" label="Uptime SLA" />
            <StatCard prefix="<" num={20} suffix="ms" label="Median Latenz" />
            <StatCard prefix="SCA" label="Wasserstandards abgedeckt" />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-32 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Preise
                </div>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  Fang kostenlos an.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  Jeder Plan enthält das vollständige Wasserprofil. Unterschiede gibt es nur beim Anfragelimit.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
                {[
                  {
                    name: "Free",
                    price: "0 €",
                    priceSub: "für immer",
                    limit: "100",
                    desc: "Zum Ausprobieren.",
                    highlight: false,
                    cta: "Kostenlos starten",
                    features: [
                      "Vollständiges Wasserprofil",
                      "Alle 50+ Städte & PLZ",
                      "Community Support",
                    ],
                  },
                  {
                    name: "Starter",
                    price: "9 €",
                    priceSub: "pro Monat",
                    limit: "1.000",
                    desc: "Erste Integrationen.",
                    highlight: false,
                    cta: "Anfragen",
                    features: [
                      "Alles aus Free",
                      "E-Mail Support (1 Werktag)",
                      "99,9 % Uptime SLA",
                    ],
                  },
                  {
                    name: "Pro",
                    price: "29 €",
                    priceSub: "pro Monat",
                    limit: "10.000",
                    desc: "Für Röstereien & Apps.",
                    highlight: true,
                    cta: "Anfragen",
                    features: [
                      "Alles aus Starter",
                      "Priority Support",
                      "Höhere Rate-Limits",
                      "Webhooks bei Updates",
                    ],
                  },
                ].map((plan, i) => (
                  <div
                    key={plan.name}
                    className={`reveal relative flex flex-col rounded-2xl border bg-card p-6 ${
                      plan.highlight ? "border-primary ring-2 ring-primary/30" : "border-border"
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
                      {plan.highlight && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                          Beliebt
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] text-muted-foreground">{plan.desc}</p>

                    <div className="mt-6">
                      <div className="font-display text-3xl font-semibold tracking-tight text-foreground leading-none">
                        {plan.price}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{plan.priceSub}</p>
                    </div>

                    <div className="mt-5 rounded-lg bg-muted/50 px-3 py-2">
                      <span className="text-sm font-semibold text-foreground">{plan.limit}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground">Anfragen / Monat</span>
                    </div>

                    <a
                      href={`mailto:api@brewwater.de?subject=${encodeURIComponent(`API Key Anfrage — ${plan.name}`)}`}
                      className={`mt-5 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                        plan.highlight
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {plan.cta}
                    </a>

                    <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <Section id="getting-started" eyebrow="01" title="Getting Started">
            <p>
              In unter einer Minute zur ersten Antwort mit echten Kaffeewasser-Werten. API-Key anlegen,
              Stadt oder PLZ übergeben — fertig.
            </p>
            <ol className="space-y-6">
              {[
                { t: "API-Key anfordern", d: "Schreiben Sie uns an api@brewwater.de — Sie erhalten Ihren Key innerhalb von 24 Stunden. Free-Plan: 100 Anfragen/Monat, kostenlos." },
                { t: "Anfrage authentifizieren", d: "Übergeben Sie den Key im X-API-Key-Header jeder Anfrage. Kein OAuth, kein Bearer-Token." },
                { t: "Wasserchemie abrufen", d: "GET-Anfrage mit einer PLZ — Sie erhalten pH, Gesamthärte, Calcium, Magnesium und alle weiteren Parameter als JSON." },
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
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">X-API-Key</code>{" "}
              Header. Keys beginnen immer mit{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">bw_live_</code>
              {" "}und werden nach der Registrierung einmalig ausgestellt.
            </p>
            <CodeBlock code={`X-API-Key: bw_live_4f8a...c91d`} />
          </Section>

          <Section id="endpoints" eyebrow="03" title="Endpoints">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 font-mono text-sm overflow-x-auto">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary whitespace-nowrap">GET</span>
              <span className="text-foreground whitespace-nowrap">/v1/water?plz=20095</span>
            </div>
            <p>Liefert das aktuelle Wasserprofil für eine deutsche Postleitzahl — mit allen Parametern, die für Espresso und Kaffee relevant sind.</p>

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
            <p>Jede Antwort enthält ein flaches JSON-Objekt mit allen kaffeerelevanten Wasserwerten — direkt verwendbar für Extraktionsberechnungen und Wasserrezepte.</p>
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
              Limits gelten <strong className="text-foreground">pro Monat</strong>, nicht pro Minute.
              Jede Antwort enthält den aktuellen Stand in den Headern:
            </p>
            <CodeBlock
              code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 2026-07-01T00:00:00.000Z
X-Request-Id: 3f2a1b4c-...`}
            />
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[420px] text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="px-4 py-3 font-medium">Anfragen/Monat</th>
                    <th className="px-4 py-3 font-medium">Preis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {[
                    { plan: "Free", limit: "100", price: "kostenlos" },
                    { plan: "Starter", limit: "1.000", price: "auf Anfrage" },
                    { plan: "Pro", limit: "10.000", price: "auf Anfrage" },
                    { plan: "Unlimited", limit: "∞", price: "auf Anfrage" },
                  ].map((r) => (
                    <tr key={r.plan}>
                      <td className="px-4 py-3 font-medium text-foreground">{r.plan}</td>
                      <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{r.limit}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Beim Überschreiten erhalten Sie{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">429 rate_limit_exceeded</code>.
              Der Zähler resettet automatisch am 1. des Folgemonats (Zeitstempel in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">X-RateLimit-Reset</code>).
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
                Besserer Kaffee beginnt beim Wasser.
              </h3>
              <p className="mx-auto mt-5 max-w-xl text-white/80 sm:text-lg">
                Kostenlos starten — keine Kreditkarte. Echte Kaffeewasser-Daten in wenigen Minuten in Ihrer App.
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
                  Kaffeewasser-Daten für Entwickler und Röstereien.
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
                  {[
                    { label: "Changelog", href: "/changelog" },
                    { label: "Status", href: "#" },
                    { label: "brewwater.de", href: "https://brewwater.de" },
                  ].map((l) => (
                    <li key={l.label}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Support</div>
                <ul className="space-y-3 text-sm text-white/75">
                  {[
                    { label: "Kontakt", href: "mailto:api@brewwater.de" },
                    { label: "Impressum", href: "/impressum" },
                    { label: "Datenschutz", href: "/datenschutz" },
                  ].map((l) => (
                    <li key={l.label}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Divider + copyright */}
            <div className="mt-12 border-t border-white/15 pt-6 text-xs text-white/40">
              <span>Copyright © {new Date().getFullYear()} brewwater. All Rights Reserved.</span>
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
