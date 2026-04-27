import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FlipCardProps {
  icon: LucideIcon;
  label: string;
  desc: string;
  back: string;
  index: number;
}

export function FlipCard({ icon: Icon, label, desc, back, index }: FlipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="flip-card group h-[260px]"
    >
      <div className="flip-card-inner">
        {/* Front Face: Professional Grid Layout (Matches Image 1) */}
        <div className="flip-face bg-white border-2 border-[hsl(var(--brand-deep))] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] p-7 flex flex-col items-start text-left">
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--brand-deep))] flex items-center justify-center text-white mb-6 shadow-lg">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-foreground mb-2">
            {label}
          </h3>
          <p className="text-xs text-foreground/60 leading-relaxed max-w-[90%]">
            {desc}
          </p>
          <div className="mt-auto pt-4 text-[9px] font-black uppercase tracking-[0.22em] text-[hsl(var(--brand-gold-dark))]">
            SURVOLER / TOUCHER —
          </div>
        </div>

        {/* Back Face: Professional Editorial Layout (Matches Image 1) */}
        <div className="flip-face flip-face-back bg-gradient-to-br from-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] p-7 flex flex-col items-start text-left text-[hsl(var(--brand-gold-foreground))] shadow-2xl relative overflow-hidden">
          {/* Top Left Icon Box */}
          <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center mb-6">
            <Icon className="w-5 h-5 text-black/60" />
          </div>

          <h3 className="text-base font-black text-black mb-2">
            {label}
          </h3>

          <p className="text-xs text-black/70 leading-relaxed max-w-[90%] font-medium">
            {back}
          </p>

          {/* Footer Text */}
          <div className="mt-auto pt-4 text-[9px] font-black uppercase tracking-[0.22em] text-black/40">
            COOP-LABEL • REVUE
          </div>

          {/* Subtle background pattern/texture if needed */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_60%)]" />
        </div>
      </div>
    </motion.div>
  );
}
