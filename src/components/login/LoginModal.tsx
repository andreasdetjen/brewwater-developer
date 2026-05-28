import { Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginModal() {
  return (
    <div className="w-[260px] rounded-2xl bg-background p-4 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] ring-1 ring-border/60">
      <h2 className="text-center text-sm font-normal text-muted-foreground mb-3">
        Log in
      </h2>

      <div className="group rounded-xl bg-secondary/60 p-2.5 transition-shadow duration-300 hover:shadow-md hover:bg-secondary">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-primary">
            <Droplets
              className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-primary-foreground"
              strokeWidth={1.75}
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground">
              brewwater API
            </span>
            <span className="text-xs text-muted-foreground">
              für Entwickler
            </span>
          </div>
        </div>

        {/* Hover-expand login form */}
        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-[200px] group-hover:opacity-100 group-focus-within:max-h-[200px] group-focus-within:opacity-100">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="pt-3 space-y-2"
          >
            <Input
              type="email"
              placeholder="E-Mail"
              autoComplete="email"
              className="h-10 rounded-lg bg-background"
            />
            <Input
              type="password"
              placeholder="Passwort"
              autoComplete="current-password"
              className="h-10 rounded-lg bg-background"
            />
            <Button type="submit" className="w-full h-10 rounded-lg">
              Anmelden
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;