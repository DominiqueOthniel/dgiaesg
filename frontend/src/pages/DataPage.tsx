import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Database, LineChart, Trophy, FileText, SlidersHorizontal, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const BLOCKS = [
  {
    key: "indicators",
    href: "/donnees/indicateurs",
    icon: LineChart,
    titleKey: "pages.data.blocks.indicators_title",
    descKey: "pages.data.blocks.indicators_desc",
  },
  {
    key: "rankings",
    href: "/donnees/classements",
    icon: Trophy,
    titleKey: "pages.data.blocks.rankings_title",
    descKey: "pages.data.blocks.rankings_desc",
  },
  {
    key: "reports",
    href: "/donnees/rapports",
    icon: FileText,
    titleKey: "pages.data.blocks.reports_title",
    descKey: "pages.data.blocks.reports_desc",
  },
  {
    key: "comparator",
    href: "/donnees/comparateur",
    icon: SlidersHorizontal,
    titleKey: "pages.data.blocks.comparator_title",
    descKey: "pages.data.blocks.comparator_desc",
  },
] as const;

export default function DataPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background:radial-gradient(circle_at_15%_15%,hsl(var(--brand-emerald))_0%,transparent_34%),radial-gradient(circle_at_88%_78%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background:linear-gradient(120deg,transparent_0_43%,hsl(var(--foreground))_43%_44%,transparent_44%_100%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,white_0_1px,transparent_1px_18px)]" />
        <div className="absolute -top-28 -right-24 w-80 h-80 rounded-full bg-brand-gold/20 blur-[90px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.5)]">
            <Database className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("nav.data")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 max-w-4xl leading-[1.05]">
            {t("pages.data.hero_title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.data.hero_subtitle")}
          </p>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-24 rounded-full bg-primary/10 blur-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOCKS.map((block, idx) => {
              const Icon = block.icon;
              return (
                <motion.div
                  key={block.key}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={block.href}
                    className="group golden-glow relative block rounded-3xl border-border/90 bg-card p-6 h-full overflow-hidden shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] hover:border-primary/35 transition-all duration-300"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.13),transparent_62%)]" />
                    <div className="pointer-events-none absolute inset-0 opacity-80 [background:linear-gradient(155deg,hsl(var(--background)/0.62)_0%,transparent_44%)]" />
                    <div className="relative w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-1 ring-primary/25 shadow-[0_12px_24px_-12px_rgba(13,77,51,0.65)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="relative text-xl font-extrabold tracking-tight text-foreground mb-2">
                      {t(block.titleKey)}
                    </h2>
                    <p className="relative text-sm text-muted-foreground leading-relaxed">
                      {t(block.descKey)}
                    </p>
                    <div className="relative mt-6 pt-4 border-t border-border/60 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      {t("pages.data.explore")}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
