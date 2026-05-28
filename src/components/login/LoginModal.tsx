import { Droplet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginModal() {
  return (
    <div className="w-[320px] rounded-2xl bg-background shadow-[0_20px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-border/60 overflow-hidden">
      <div className="p-3">
        <div className="group rounded-xl border border-border bg-card transition-shadow duration-300 hover:shadow-md">
          <div className="flex items-center gap-3 p-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Droplet className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-foreground">
                brewwater API
              </span>
              <span className="text-xs text-muted-foreground">
                für Entwickler
              </span>
            </div>
          </div>

          {/* Hover-expand region */}
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-in-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
            <div className="overflow-hidden">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="px-3 pb-3 pt-1 space-y-2"
              >
                <Input
                  type="email"
                  placeholder="E-Mail"
                  autoComplete="email"
                  className="h-9 rounded-lg"
                />
                <Input
                  type="password"
                  placeholder="Passwort"
                  autoComplete="current-password"
                  className="h-9 rounded-lg"
                />
                <Button type="submit" className="w-full h-9 rounded-lg">
                  Anmelden
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;