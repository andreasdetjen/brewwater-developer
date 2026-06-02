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

export function Datenschutz() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-2xl px-6 py-20 sm:py-28">

        {/* Title */}
        <h1 className="text-5xl font-semibold tracking-tight text-primary text-center mb-16 sm:text-6xl">
          Datenschutz
        </h1>

        {/* Verantwortlicher */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Verantwortlicher</h2>
          <p className="text-[15px] text-foreground leading-8">
            Andreas Detjen<br />
            Papendamm 26<br />
            20146 Hamburg<br />
            Deutschland<br />
            E-Mail:{" "}
            <a href="mailto:api@brewwater.de" className="underline underline-offset-2 hover:text-primary transition">
              api@brewwater.de
            </a>
          </p>
        </div>

        {/* Allgemeines */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Allgemeines</h2>
          <p className="text-[15px] text-foreground leading-8">
            developer.brewwater.de ist das Entwicklerportal der brewwater API — einer Schnittstelle
            zur Abfrage von Trinkwasserwerten für deutsche Postleitzahlen. Diese Erklärung beschreibt,
            welche Daten bei der Nutzung dieser Website verarbeitet werden.
          </p>
        </div>

        {/* Hosting */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Hosting</h2>
          <p className="text-[15px] text-foreground leading-8">
            Diese Website wird über Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA,
            gehostet. Beim Aufruf können technische Zugriffsdaten (IP-Adresse, Zeitpunkt, aufgerufene
            URL, Browser- und Gerätedaten) verarbeitet werden. Rechtsgrundlage ist Art. 6 Abs. 1
            lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb). Weitere Informationen:{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary transition">
              vercel.com/legal/privacy-policy
            </a>
          </p>
        </div>

        {/* Live Playground */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Live Playground</h2>
          <p className="text-[15px] text-foreground leading-8">
            Der Live Playground sendet Anfragen direkt an die brewwater API
            (api.brewwater.de). Dabei wird die eingegebene Postleitzahl an unseren Server
            übermittelt. Es werden keine personenbezogenen Daten dauerhaft gespeichert.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </div>

        {/* API Key */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">API Key Anfrage</h2>
          <p className="text-[15px] text-foreground leading-8">
            Wenn du einen API Key anforderst, werden deine E-Mail-Adresse und der Anwendungsfall
            verarbeitet, um den Key zuzuweisen und den Zugang zu verwalten. Die Daten werden
            ausschließlich für diesen Zweck genutzt und nicht an Dritte weitergegeben.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </div>

        {/* Analytics */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Webanalyse</h2>
          <p className="text-[15px] text-foreground leading-8 mb-3">
            Diese Website nutzt Plausible Analytics — eine datenschutzfreundliche Lösung ohne
            Cookies und ohne personenbezogene Profile. Die Auswertung erfolgt ausschließlich
            aggregiert.
          </p>
          <ul className="text-[15px] text-foreground leading-8 list-disc ml-5 space-y-1">
            <li>Zweck: Verbesserung des Angebots</li>
            <li>Daten: Seitenaufrufe, Referrer, Gerät und Browser (aggregiert)</li>
            <li>Anbieter: Plausible Insights OÜ, Estland</li>
            <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO</li>
          </ul>
        </div>

        {/* Cookies */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Cookies</h2>
          <p className="text-[15px] text-foreground leading-8">
            Es werden ausschließlich technisch notwendige Daten gespeichert (z. B. Session-Tokens
            bei eingeloggten Nutzern). Marketing-Cookies werden nicht eingesetzt.
          </p>
        </div>

        {/* Rechte */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Deine Rechte</h2>
          <p className="text-[15px] text-foreground leading-8 mb-3">
            Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
            Widerspruch sowie Datenübertragbarkeit (Art. 15–21 DSGVO). Beschwerden kannst du an
            die zuständige Aufsichtsbehörde richten:
          </p>
          <p className="text-[15px] text-foreground leading-8">
            Hamburgischer Beauftragter für Datenschutz und Informationsfreiheit (HmbBfDI)<br />
            Ludwig-Erhard-Str. 22, 20459 Hamburg<br />
            <a href="https://www.datenschutz.hamburg.de" target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary transition">
              www.datenschutz.hamburg.de
            </a>
          </p>
        </div>

        {/* Kontakt */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Kontakt</h2>
          <p className="text-[15px] text-foreground leading-8">
            Für Fragen zum Datenschutz:{" "}
            <a href="mailto:api@brewwater.de" className="underline underline-offset-2 hover:text-primary transition">
              api@brewwater.de
            </a>
          </p>
        </div>

        {/* Stand */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Stand</h2>
          <p className="text-[15px] text-foreground leading-8">Juni 2026</p>
        </div>

      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} brewwater. Alle Rechte vorbehalten.</span>
          <div className="flex gap-5">
            <a href="/impressum" className="hover:text-foreground transition">Impressum</a>
            <a href="/datenschutz" className="text-foreground font-medium">Datenschutz</a>
            <a href="https://brewwater.de" className="hover:text-foreground transition">brewwater.de</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
