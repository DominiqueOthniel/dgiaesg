import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MagazineIssue } from "@/lib/revue-mock-data";

interface IssueCoverProps {
  issue: MagazineIssue;
  size?: "sm" | "md" | "lg";
  float?: boolean;
  className?: string;
}

export function IssueCover({ issue, size = "md", float = false, className }: IssueCoverProps) {
  const sizeClasses = {
    sm: "w-32 sm:w-40 text-[0.6rem]",
    md: "w-full text-xs",
    lg: "w-64 sm:w-80 md:w-[22rem] text-sm",
  };

  const accentColors = {
    gold: "hsl(var(--brand-gold))",
    emerald: "hsl(var(--brand-emerald))",
    deep: "hsl(var(--brand-deep))",
  };

  return (
    <div
      className={cn(
        "magazine-cover",
        float && "animate-float-cover",
        sizeClasses[size],
        className
      )}
    >
      {/* Dynamic Background Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", issue.coverGradient)} />

      {/* Magazine Spine Shadow */}
      <div className="magazine-spine" />

      {/* Layout Content */}
      <div className="relative h-full flex flex-col p-[8%] select-none">
        {/* Header: Brand + Issue Info */}
        <div className="flex justify-between items-start border-b border-white/20 pb-4 mb-4">
          <div className="space-y-0.5">
            <p className="font-black uppercase tracking-[0.2em] text-white opacity-90">DGIAESG</p>
            <p className="font-medium uppercase tracking-[0.15em] text-white/70" style={{ fontSize: "0.7em" }}>
              Afrique Durable
            </p>
          </div>
          <div className="text-right">
            <p className="font-black text-white/90" style={{ fontSize: "1.2em" }}>N°{String(issue.number).padStart(2, "0")}</p>
            <p className="font-bold uppercase tracking-wider text-white/60" style={{ fontSize: "0.6em" }}>
              {issue.monthLabel}
            </p>
          </div>
        </div>

        {/* Big Glyph Background */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]"
          style={{ fontSize: "12rem", fontWeight: 900, color: "white" }}
        >
          {issue.coverGlyph}
        </div>

        {/* Premium Badge Overlay */}
        {issue.featured && (
          <div className="absolute top-4 right-4 z-20">
             <div className="bg-gradient-to-br from-[hsl(var(--brand-gold))] via-white to-[hsl(var(--brand-gold-dark))] px-3 py-1.5 rounded-lg shadow-[0_10px_25px_-5px_rgba(255,215,0,0.5)] flex items-center gap-2 border border-white/80 animate-prismatic">
                <Sparkles className="w-2.5 h-2.5 text-black animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.22em] text-black drop-shadow-sm">PREMIUM</span>
             </div>
          </div>
        )}

        {/* Center: Main Title */}
        <div className="flex-1 flex flex-col justify-center relative z-10 py-6">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-black text-white leading-[1.1] mb-3"
            style={{ fontSize: "1.8em", textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
          >
            {issue.title}
          </motion.h2>
          <div
            className="w-12 h-1 mb-4"
            style={{ backgroundColor: accentColors[issue.coverAccent] }}
          />
          <p className="font-medium text-white/80 leading-relaxed max-w-[90%]" style={{ fontSize: "0.85em" }}>
            {issue.tagline}
          </p>
        </div>

        {/* Footer: Page Count & Focus */}
        <div className="mt-auto pt-4 border-t border-white/15 flex justify-between items-end">
          <div className="space-y-1">
            <p className="font-black text-white uppercase tracking-[0.25em]" style={{ fontSize: "0.65em" }}>
              EXCLUSIF
            </p>
            <p className="font-bold text-white/60 uppercase tracking-widest" style={{ fontSize: "0.55em" }}>
              {issue.pageCount} PAGES D'ANALYSE
            </p>
          </div>
          <div
            className="px-4 py-1.5 rounded-lg font-black text-black uppercase tracking-[0.2em]"
            style={{ backgroundColor: accentColors[issue.coverAccent], fontSize: "0.65em" }}
          >
            RELEVANCE
          </div>
        </div>
      </div>
    </div>
  );
}
