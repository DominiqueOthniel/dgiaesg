import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { ViewportSection, FADE_UP } from "./_shared";

/**
 * 6. CONFORMITÉ STRATÉGIQUE (Final CTA + Stats)
 */
export function ConformiteSection() {
  const { t } = useTranslation();

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
    { label: "ENTITÉS", value: "2400+", icon: TrendingUp },
    { label: "PAYS", value: "24", icon: Globe },
    { label: "AUDITS", value: "850", icon: ShieldCheck },
    { label: "IMPACT", value: "A+", icon: Award },
  ];

  return (
    <ViewportSection
      id="conformite"
      variants={FADE_UP}
      className="py-10 md:py-16 bg-[radial-gradient(ellipse_at_bottom,_color-mix(in_oklch,var(--brand-gold)_8%,var(--surface-warm)),var(--background))]"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 w-[360px] h-[360px] rounded-full bg-brand-gold/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 w-[400px] h-[400px] rounded-full bg-brand-emerald/25 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 w-[240px] h-[240px] -translate-x-1/2 rounded-full bg-primary/10 blur-[90px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-primary mb-3 block">
              {t("home.conformity.badge") || "Conformité Stratégique"}
            </span>
            <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-[1.05] uppercase italic mb-4">
              Faites de la conformité{" "}
              <span className="bg-gradient-to-r from-primary via-brand-emerald to-brand-gold-dark bg-clip-text text-transparent">
                votre avantage compétitif.
              </span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 max-w-lg">
              {t("home.conformity.desc") ||
                "Notre méthodologie d'audit, alignée sur les normes ISO et les référentiels ESG, transforme l'exigence réglementaire en différenciation stratégique."}
            </p>

            <ul className="space-y-2.5 mb-6">
              {items.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "group flex items-start gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-gold/10",
                    item.ring,
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br shadow-inner shrink-0",
                      item.accent,
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", item.iconColor)} />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-black text-brand-dark uppercase tracking-tight">
                      {item.title}
                    </p>
                    <p className="text-[11px] md:text-xs text-brand-dark/70 font-semibold mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/"
                className="group relative inline-flex items-center gap-2 overflow-hidden bg-gradient-to-r from-brand-emerald via-primary to-brand-emerald bg-[length:200%_100%] bg-left text-primary-foreground px-6 md:px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 hover:bg-right shadow-2xl shadow-primary/30 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 relative z-10" />
                <span className="relative z-10">
                  {t("home.conformity.cta") || "Démarrer mon Audit"}
                </span>
                <ArrowRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {stats.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6, rotate: -0.5 }}
                className="relative p-5 md:p-6 rounded-2xl flex flex-col items-center text-center group transition-all duration-500 overflow-hidden bg-gradient-to-br from-[#1a2410] via-[#0f1a0a] to-[#0a1405] border border-brand-gold/40 ring-1 ring-brand-gold/20 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55),0_0_24px_-8px_color-mix(in_oklch,var(--brand-gold)_50%,transparent)] hover:shadow-[0_28px_60px_-12px_rgba(0,0,0,0.7),0_0_45px_-5px_color-mix(in_oklch,var(--brand-gold)_80%,transparent)] hover:border-brand-gold hover:ring-brand-gold/50"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklch,var(--brand-gold)_20%,transparent)_0%,transparent_60%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_18px_-2px_color-mix(in_oklch,var(--brand-gold)_70%,transparent)] bg-brand-gold/20 ring-1 ring-brand-gold/50">
                  <s.icon className="w-5 h-5 md:w-6 md:h-6 text-brand-gold drop-shadow-[0_0_6px_color-mix(in_oklch,var(--brand-gold)_80%,transparent)]" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-black leading-none mb-1.5 relative z-10 italic bg-gradient-to-br from-[#fff3c4] via-brand-gold to-[#c9991a] bg-clip-text text-transparent drop-shadow-[0_0_10px_color-mix(in_oklch,var(--brand-gold)_60%,transparent)]">
                  {s.value}
                </div>
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] relative z-10 text-brand-gold/90">
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
