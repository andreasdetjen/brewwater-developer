import { useState } from "react";
import { Droplet, Github, Key, ArrowRight, Check, Copy, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <div className="group relative overflow-hidden rounded-lg border border-border bg-[var(--code-bg)]">
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-3 top-3 inline-flex h-7 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 text-xs text-[var(--code-fg)] opacity-0 transition group-hover:opacity-100"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-[var(--code-fg)] font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Tabs({ tabs }: { tabs: { label: string; code: string }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`relative px-3 py-2 text-sm font-medium transition whitespace-nowrap ${
              active === i ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {active === i && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <CodeBlock code={tabs[active].code} />
      </div>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border py-12 sm:py-16 first:pt-6 sm:first:pt-8">
      {eyebrow && (
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</div>
      )}
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-sidebar p-0 border-r border-sidebar-border">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Droplet className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">brewwater</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Developer Hub</div>
          </div>
        </div>
        <nav className="px-4 py-6">
          <div className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            API Reference
          </div>
          <ul className="mt-3 space-y-0.5">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-1.5 text-sm text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-foreground">API status</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              All systems normal
            </div>
          </div>
        </nav>
        <div className="border-t border-sidebar-border px-6 py-4 text-xs text-muted-foreground">
          v1.4.2 · last updated May 2026
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ApiDocs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Droplet className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">brewwater</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Developer Hub</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            API Reference
          </div>
          <ul className="mt-3 space-y-0.5">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="block rounded-md px-3 py-1.5 text-sm text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-foreground">API status</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              All systems normal
            </div>
          </div>
        </nav>
        <div className="border-t border-sidebar-border px-6 py-4 text-xs text-muted-foreground">
          v1.4.2 · last updated May 2026
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm lg:hidden">
          <MobileNav />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Droplet className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold">brewwater</span>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.6]"
            style={{
              background:
                "radial-gradient(60% 80% at 80% 0%, oklch(0.92 0.06 235) 0%, transparent 60%), radial-gradient(50% 60% at 0% 30%, oklch(0.95 0.04 220) 0%, transparent 60%)",
            }}
          />
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-12 lg:py-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              REST API · JSON · 50+ cities
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
              brewwater <span className="text-primary">Developer API</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
              Access drinking water quality data for 50+ German cities — pH, hardness, minerals,
              and brewing-grade chemistry, all from a single endpoint.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="gap-2">
                <Key className="h-4 w-4" /> Get API Key
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-4 w-4" /> View on GitHub
              </Button>
            </div>
            <div className="mt-8 sm:mt-10 inline-flex flex-wrap items-center gap-2 sm:gap-3 rounded-lg border border-border bg-card px-3 py-2 sm:px-4 font-mono text-xs sm:text-sm">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">GET</span>
              <span className="text-muted-foreground">https://api.brewwater.de/</span>
              <span className="text-foreground">v1/water-profile</span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12">
          <Section id="getting-started" eyebrow="01" title="Getting Started">
            <p>
              Make your first request in under a minute. You'll need an API key — create one from
              your dashboard after signing up.
            </p>
            <ol className="space-y-5">
              {[
                { t: "Create an API key", d: "Sign in to brewwater.de and generate a key from Settings → API." },
                { t: "Authenticate your request", d: "Pass the key as a Bearer token in the Authorization header." },
                { t: "Query a city", d: "Send a GET request with a plz or city parameter." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{s.t}</div>
                    <div className="text-sm text-muted-foreground">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <CodeBlock code={CURL} />
          </Section>

          <Section id="authentication" eyebrow="02" title="Authentication">
            <p>
              All requests must include an <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">Authorization</code> header
              with a Bearer token. Keys come in two flavours: <strong className="text-foreground">test</strong> (prefixed
              <code className="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">bw_test_sk_</code>)
              and <strong className="text-foreground">live</strong> (<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">bw_live_sk_</code>).
            </p>
            <CodeBlock code={`Authorization: Bearer bw_live_sk_4f8a...c91d`} />
          </Section>

          <Section id="endpoints" eyebrow="03" title="Endpoints">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm overflow-x-auto">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary whitespace-nowrap">GET</span>
              <span className="text-foreground whitespace-nowrap">/api/v1/water-profile</span>
            </div>
            <p>Returns the latest measured water chemistry for a given German city or postal code.</p>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">Query parameters</h3>
              <div className="overflow-x-auto rounded-lg border border-border">
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
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">Example request</h3>
              <Tabs
                tabs={[
                  { label: "cURL", code: CURL },
                  { label: "JavaScript", code: JS },
                  { label: "Python", code: PY },
                ]}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">Example response</h3>
              <CodeBlock code={RESPONSE} />
            </div>
          </Section>

          <Section id="schema" eyebrow="04" title="Response Schema">
            <p>Every successful response returns a flat JSON object with the following fields.</p>
            <div className="overflow-x-auto rounded-lg border border-border">
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
            <p>brewwater uses conventional HTTP status codes. Errors return a JSON body with <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">error</code> and <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">message</code> fields.</p>
            <div className="overflow-x-auto rounded-lg border border-border">
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
              The free tier allows 60 requests/minute and 10,000 requests/month. Paid plans scale up to
              10,000 requests/minute. Every response includes the current limits in headers:
            </p>
            <CodeBlock
              code={`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1716831600`}
            />
            <p>
              When you exceed the limit you'll receive a <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">429 rate_limited</code> response.
              Retry after the timestamp in <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">X-RateLimit-Reset</code>.
            </p>
          </Section>

          <div className="py-12 sm:py-16">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">Ready to start building?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Free tier — no credit card required.</p>
              </div>
              <Button size="lg" className="gap-2">
                Get API Key <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <footer className="border-t border-border bg-muted/30">
          <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-12">
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-primary" />
              <span>© {new Date().getFullYear()} brewwater</span>
            </div>
            <div className="flex items-center gap-5">
              <a href="https://brewwater.de" className="hover:text-foreground">brewwater.de</a>
              <a href="#" className="hover:text-foreground">Status</a>
              <a href="#" className="hover:text-foreground">Changelog</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
