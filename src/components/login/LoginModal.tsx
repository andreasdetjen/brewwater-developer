import { useState } from "react";
import { Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginModal() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-[260px] rounded-xl bg-white p-2 shadow-[0_8px_30px_-6px_rgba(15,23,42,0.15)] ring-1 ring-black/[0.06]">
      {/* Card */}
      <div
        className="group flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 cursor-pointer transition-colors duration-150 hover:border-primary/20 hover:bg-primary/[0.04]"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="h-9 w-9 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 transition-colors duration-150 group-hover:bg-primary">
          <Droplets className="h-4 w-4 text-slate-500 transition-colors duration-150 group-hover:text-white" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-foreground">brewwater API</span>
          <span className="text-[11px] text-slate-400 mt-0.5">für Entwickler</span>
        </div>
      </div>

      {/* Expandable form */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-[180px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-1.5 px-1 pb-1">
          <Input type="email" placeholder="E-Mail" autoComplete="email" className="h-9 rounded-lg bg-slate-50 border-slate-200 text-sm" />
          <Input type="password" placeholder="Passwort" autoComplete="current-password" className="h-9 rounded-lg bg-slate-50 border-slate-200 text-sm" />
          <Button type="submit" className="w-full h-9 rounded-lg text-sm">Anmelden</Button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
