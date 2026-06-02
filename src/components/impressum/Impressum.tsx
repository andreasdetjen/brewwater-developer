import { Droplet, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

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
          <a href="/" className="text-muted-foreground hover:text-foreground transition">Docs</a>
          <a href="/changelog" className="text-muted-foreground hover:text-foreground transition">Changelog</a>
          <a
            href="mailto:api@brewwater.de?subject=API Key Anfrage"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            API Key anfordern
          </a>
        </nav>

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
              <a href="/changelog" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent">Changelog</a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-6 border-b border-border last:border-0">
      <h2 className="text-base font-semibold text-foreground mb-3">{title}</h2>
      <div className="text-[15px] text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export function Impressum() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            developer.brewwater.de
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Impressum</h1>
          <p className="mt-4 text-muted-foreground">Angaben gemäß gesetzlichen Informationspflichten.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card px-6 sm:px-8">
          <Section title="Betreiber dieser Website">
            <p>
              Andreas Detjen<br />
              Papendamm 26<br />
              20146 Hamburg<br />
              Deutschland
            </p>
          </Section>

          <Section title="Kontakt">
            <p>
              E-Mail: <a href="mailto:api@brewwater.de" className="text-foreground underline underline-offset-2 hover:text-primary transition">api@brewwater.de</a><br />
              Telefon: 01732192844
            </p>
          </Section>

          <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
            <p>
              Andreas Detjen<br />
              Papendamm 26<br />
              20146 Hamburg
            </p>
          </Section>

          <Section title="Datenherkunft und Eigenleistung">
            <p>
              Die über die brewwater API bereitgestellten Trinkwasserwerte (z. B. Gesamthärte, pH-Wert,
              Mineralstoffgehalte) basieren auf öffentlich zugänglichen Informationen der jeweiligen
              Wasserversorger (u. a. Jahresberichte, Analysedaten, PLZ-Abfragen).
            </p>
            <p>
              Diese Rohdaten wurden durch eigene erhebliche Investition in Zeit, Technik und Know-how
              strukturiert, normalisiert, mit PLZ-Zuordnungen versehen, qualitätsgeprüft und in ein
              einheitliches maschinenlesbares Format überführt. Die daraus entstandene Datenbank sowie
              die zugehörige API-Infrastruktur sind eigenständige Werkleistungen im Sinne des
              Datenbankherstellerrechts (§ 87a ff. UrhG).
            </p>
          </Section>

          <Section title="Haftungsausschluss Wasserwerte">
            <p>
              Alle bereitgestellten Trinkwasserwerte werden ohne Gewähr bereitgestellt. Angaben können
              veraltet, unvollständig oder fehlerhaft sein. Eine Haftung für die Richtigkeit,
              Vollständigkeit oder Aktualität der dargestellten Werte wird ausdrücklich ausgeschlossen.
            </p>
            <p>
              Die Inhalte dienen ausschließlich der allgemeinen Information für die Zubereitung von
              Kaffee und Espresso und ersetzen keine behördlichen Auskünfte. Für gesundheitliche
              Entscheidungen wende dich direkt an deinen Wasserversorger oder das zuständige Gesundheitsamt.
            </p>
          </Section>

          <Section title="Online-Streitbeilegung">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-primary transition">
                https://ec.europa.eu/consumers/odr
              </a>.
            </p>
          </Section>

          <Section title="Verbraucherstreitbeilegung">
            <p>
              Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
            </p>
          </Section>

          <Section title="Haftung für Links">
            <p>
              Diese Website kann Links zu externen Websites Dritter enthalten, auf deren Inhalte ich
              keinen Einfluss habe. Für diese fremden Inhalte übernehme ich keine Gewähr.
            </p>
          </Section>
        </div>
      </main>

      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} brewwater. Alle Rechte vorbehalten.</span>
          <div className="flex gap-5">
            <a href="/impressum" className="text-foreground">Impressum</a>
            <a href="https://brewwater.de/datenschutz" className="hover:text-foreground transition">Datenschutz</a>
            <a href="https://brewwater.de" className="hover:text-foreground transition">brewwater.de</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
