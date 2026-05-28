import { useState } from "react";
import { Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginModal() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-[300px] rounded-2xl bg-white p-5 shadow-[0_20px_60px_-10px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06]">
      {/* Heading */}
      <h2 className="text-center text-[15px] font-normal text-slate-400 mb-4">
        Log in
      </h2>

      {/* Card */}
      <div
        className="group rounded-2xl border border-slate-100 bg-slate-50 p-3 cursor-pointer transition-all duration-200 hover:border-primary/20 hover:bg-primary/[0.04]"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="h-12 w-12 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-primary">
            <Droplets
              className="h-5 w-5 text-slate-500 transition-colors duration-200 group-hover:text-white"
              strokeWidth={1.75}
            />
          </div>
          {/* Label */}
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-foreground">
              brewwater API
            </span>
            <span className="text-[13px] text-slate-400 mt-0.5">
              für Entwickler
            </span>
          </div>
        </div>

        {/* Expandable form */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expanded ? "max-h-[200px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <Input
              type="email"
              placeholder="E-Mail"
              autoComplete="email"
              className="h-10 rounded-lg bg-white border-slate-200"
            />
            <Input
              type="password"
              placeholder="Passwort"
              autoComplete="current-password"
              className="h-10 rounded-lg bg-white border-slate-200"
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
