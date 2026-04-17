import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Globe,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewportSection } from "./_shared";

/**
 * 6. CONFORMITÉ STRATÉGIQUE (Final CTA + Stats)
 */
export function ConformiteSection() {
  const items = [
    {
      title: "Expertise Panafricaine",
      desc: "Réseau d'influence institutionnel.",
      icon: Globe,
      accent: "from-brand-emerald/15 to-brand-emerald/5",
      ring: "ring-brand-emerald/30",
      iconColor: "text-brand-emerald",
    },
    {
      title: "Protocoles Rigoureux",
      desc: "Audit étape par étape.",
      icon: ShieldCheck,
      accent: "from-brand-gold/20 to-brand-gold/5",
      ring: "ring-brand-gold/40",
      iconColor: "text-brand-gold-dark",
    },
    {
      title: "Visibilité Accrue",
      desc: "Indexation au Registre prioritaires.",
      icon: Zap,
      accent: "from-primary/15 to-primary/5",
      ring: "ring-primary/30",
      iconColor: "text-primary",
    },
  ];

  const stats = [
    {
      label: "ENTITÉS",
      value: "2400+",
      icon: TrendingUp,
      border: "before:from-brand-emerald before:to-brand-gold",
      iconBg: "bg-brand-emerald/15",
      iconColor: "text-brand-emerald",
    },
    {
      label: "PAYS",
      value: "24",
      icon: Globe,
      border: "before:from-brand-gold before:to-primary",
      iconBg: "bg-brand-gold/20",
      iconColor: "text-brand-gold-dark",
    },
    {
      label: "AUDITS",
      value: "850",
      icon: ShieldCheck,
      border: "before:from-primary before:to-brand-emerald",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "IMPACT",
      value: "A+",
      icon: Award,
      border: "before:from-brand-gold-dark before:to-brand-gold",
      iconBg: "bg-brand-gold/20",
      iconColor: "text-brand-gold-dark",
    },
  ];

  return (
    <ViewportSection
      id="conformite"
      className="py-12 md:py-16 bg-gradient-to-br from-surface-warm via-background to-secondary/40"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand-gold/25 blur-[110px] animate-aurora" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 w-[460px] h-[460px] rounded-full bg-brand-emerald/25 blur-[120px] animate-aurora-slow" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 w-[280px] h-[280px] -translate-x-1/2 rounded-full bg-primary/10 blur-[90px] animate-aurora" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-5 px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              Conformité Stratégique
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark tracking-tighter mb-6 leading-[1.1] italic text-balance uppercase">
              Transformez votre vision en{" "}
              <span className="bg-gradient-to-r from-brand-emerald via-primary to-brand-gold-dark bg-clip-text text-transparent">
                certification
              </span>
              .
            </h2>
            <ul className="space-y-3 mb-8">
              {items.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "group flex items-start gap-4 p-3.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-white ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-gold/10",
                    item.ring,
                  )}
                >
                  <div
                    className={cn(
                      "mt-1 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-inner shrink-0",
                      item.accent,
                    )}
                  >
                    <item.icon className={cn("w-6 h-6", item.iconColor)} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-brand-dark uppercase tracking-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-brand-dark/70 font-semibold mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-2 overflow-hidden bg-gradient-to-r from-brand-emerald via-primary to-brand-emerald bg-[length:200%_100%] bg-left text-primary-foreground px-8 md:px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 hover:bg-right shadow-2xl shadow-primary/30 active:scale-95"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:animate-shine-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <ShieldCheck className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Démarrer mon Audit</span>
                <ArrowRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "relative p-6 md:p-7 rounded-3xl flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 overflow-hidden",
                  "bg-white/80 backdrop-blur-sm shadow-[0_15px_40px_-15px_rgba(13,77,51,0.1)] hover:shadow-2xl hover:shadow-brand-gold/20",
                  "before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:p-[2px] before:bg-gradient-to-br before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude] before:opacity-40 group-hover:before:opacity-100 before:transition-opacity",
                  s.border,
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 relative z-10 transition-transform group-hover:scale-110 shadow-sm",
                    s.iconBg,
                  )}
                >
                  <s.icon className={cn("w-6 h-6", s.iconColor)} />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark leading-none mb-2 relative z-10 italic">
                  {s.value}
                </div>
                <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-[0.25em] relative z-10">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}
