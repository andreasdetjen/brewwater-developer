import { useState } from "react";
import { Hexagon, X, Building2, Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type App = {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
};

const apps: App[] = [
  { id: "hub", name: "Smartvatten HUB", subtitle: "für Immobilien", icon: Hexagon },
  { id: "portal", name: "Property Portal", subtitle: "für Verwalter", icon: Building2 },
  { id: "meter", name: "Meter Insights", subtitle: "für Techniker", icon: Droplets },
];

export function LoginModal({ onClose }: { onClose?: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-background shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] overflow-hidden">
      {/* Blue header */}
      <div className="h-14 bg-primary flex items-center justify-end px-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="text-primary-foreground/90 hover:text-primary-foreground transition-colors cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Body */}
      <div className="px-8 pt-10 pb-12">
        <h1 className="text-center text-2xl font-normal text-muted-foreground mb-8">
          Log in
        </h1>

        <div className="space-y-4">
          {apps.map((app) => {
            const Icon = app.icon;
            const isOpen = openId === app.id;
            return (
              <div
                key={app.id}
                className={cn(
                  "rounded-2xl border border-border bg-card transition-shadow duration-300",
                  isOpen ? "shadow-md" : "shadow-sm hover:shadow-md",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : app.id)}
                  className="w-full flex items-center gap-5 p-5 cursor-pointer text-left"
                >
                  <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-foreground leading-tight">
                      {app.name}
                    </span>
                    <span className="text-base text-muted-foreground leading-tight">
                      {app.subtitle}
                    </span>
                  </div>
                </button>

                {/* Expand */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="px-5 pb-5 pt-1 space-y-3"
                    >
                      <Input
                        type="email"
                        placeholder="E-Mail"
                        autoComplete="email"
                        className="h-11 rounded-xl"
                      />
                      <Input
                        type="password"
                        placeholder="Passwort"
                        autoComplete="current-password"
                        className="h-11 rounded-xl"
                      />
                      <Button type="submit" className="w-full h-11 rounded-xl text-base">
                        Continue
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;