import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, BarChart3, Factory, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const BLOCKS = [
  {
    key: "rankings",
    href: "/entreprises/classements",
    icon: BarChart3,
    titleKey: "pages.companies.blocks.rankings_title",
    descKey: "pages.companies.blocks.rankings_desc",
  },
  {
    key: "profiles",
    href: "/entreprises/profils",
    icon: Building2,
    titleKey: "pages.companies.blocks.profiles_title",
    descKey: "pages.companies.blocks.profiles_desc",
  },
  {
    key: "sectors",
    href: "/entreprises/secteurs",
    icon: Factory,
    titleKey: "pages.companies.blocks.sectors_title",
    descKey: "pages.companies.blocks.sectors_desc",
  },
] as const;

export default function CompaniesPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_20%_10%,hsl(var(--brand-emerald))_0%,transparent_35%),radial-gradient(circle_at_80%_80%,hsl(var(--brand-gold))_0%,transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background:linear-gradient(115deg,transparent_0_42%,hsl(var(--foreground))_42%_43%,transparent_43%_100%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,white_0_1px,transparent_1px_18px)]" />
        <div className="absolute -top-28 -right-24 w-80 h-80 rounded-full bg-brand-gold/20 blur-[90px]" />
        <div className="absolute -bottom-36 -left-24 w-96 h-96 rounded-full bg-brand-emerald/20 blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.5)]">
            <Building2 className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("nav.companies")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 max-w-4xl leading-[1.05]">
            {t("pages.companies.hero_title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.companies.hero_subtitle")}
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15">
            <span className="text-xl font-black text-brand-gold leading-none">3</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary-foreground/80">
              {t("pages.companies.explore")}
            </span>
          </div>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[75%] h-24 rounded-full bg-primary/10 blur-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className="group golden-glow relative block rounded-3xl border-border/90 bg-card p-6 h-full overflow-hidden shadow-[0_30px_72px_-30px_rgba(13,77,51,0.58)]"
                  >
                    <div className="absolute inset-0 opacity-80 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.16),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0 opacity-80 [background:linear-gradient(155deg,hsl(var(--background)/0.65)_0%,transparent_45%)]" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-100 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--brand-emerald)/0.12)_100%)]" />
                    <div className="relative w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-1 ring-primary/25 shadow-[0_12px_22px_-12px_rgba(13,77,51,0.65)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="relative text-xl font-extrabold tracking-tight text-foreground mb-2">
                      {t(block.titleKey)}
                    </h2>
                    <p className="relative text-sm text-muted-foreground leading-relaxed">
                      {t(block.descKey)}
                    </p>
                    <div className="relative mt-6 pt-4 border-t border-border/60 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      {t("pages.companies.explore")}{" "}
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
