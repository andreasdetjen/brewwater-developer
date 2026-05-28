import { Droplets } from "lucide-react";

export function LoginModal() {
  return (
    <div className="w-[260px] rounded-xl bg-white p-2 shadow-[0_8px_30px_-6px_rgba(15,23,42,0.15)] ring-1 ring-black/[0.06]">
      <a
        href="https://app.brewwater.de/login"
        className="group flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 transition-colors duration-150 hover:border-primary/20 hover:bg-primary/[0.04]"
      >
        <div className="h-9 w-9 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 transition-colors duration-150 group-hover:bg-primary">
          <Droplets className="h-4 w-4 text-slate-500 transition-colors duration-150 group-hover:text-white" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-foreground">brewwater API</span>
          <span className="text-[11px] text-slate-400 mt-0.5">für Entwickler</span>
        </div>
      </a>
    </div>
  );
}

export default LoginModal;
