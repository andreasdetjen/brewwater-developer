import { Hexagon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginModal() {
  return (
    <div className="w-[380px] rounded-2xl bg-background p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] ring-1 ring-border/60">
      <h2 className="text-center text-xl font-normal text-muted-foreground mb-5">
        Log in
      </h2>

      <div className="group rounded-2xl bg-secondary/60 p-3 transition-shadow duration-300 hover:shadow-md hover:bg-secondary">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-primary">
            <Hexagon
              className="h-6 w-6 text-foreground transition-colors duration-300 group-hover:text-primary-foreground"
              strokeWidth={1.75}
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-foreground">
              Smartvatten HUB
            </span>
            <span className="text-sm text-muted-foreground">
              für Immobilien
            </span>
          </div>
        </div>

        {/* Hover-expand login form */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-in-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
          <div className="overflow-hidden">
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
    </div>
  );
}

export default LoginModal;