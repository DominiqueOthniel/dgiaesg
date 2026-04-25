import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

        {/* Back Face: Elevated Golden Gradient (Matches Image 2) */}
        <div className="flip-face flip-face-back bg-gradient-to-br from-[hsl(var(--brand-gold-dark))] via-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] p-7 flex flex-col justify-center items-center text-center text-[hsl(var(--brand-gold-foreground))] shadow-2xl">
           <div className="absolute top-0 right-0 p-5 opacity-15">
             <Icon className="w-20 h-20" />
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-black/10 pb-2">
             {label}
           </h3>
           <p className="text-xs leading-relaxed font-black uppercase tracking-tighter">
             {back}
           </p>
           <div className="mt-6 w-12 h-1 bg-black/15 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}
