import { useTranslation } from "react-i18next";
import { Building2, BarChart3, Factory, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { HubCinematicHero, HubBentoLink, hubVariantClass } from "@/components/hub/HubCinematicHero";

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

function CardContent({
  block,
  idx,
  variant,
  t,
}: {
  block: (typeof BLOCKS)[number];
  idx: number;
  variant: "flagship" | "offset" | "heritage";
  t: (k: string) => string;
}) {
  const Icon = block.icon;
  const n = `0${idx + 1}`;

  if (variant === "offset") {
    return (
      <>
        <div className="absolute right-0 top-0 p-3 opacity-20 text-6xl font-black text-emerald-600/40">
          {n}
        </div>
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 mb-4">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="relative text-xl font-extrabold tracking-tight text-foreground mb-2">
          {t(block.titleKey)}
        </h2>
        <p className="relative text-sm text-muted-foreground leading-relaxed">
          {t(block.descKey)}
        </p>
        <div className="relative mt-6 flex items-center gap-2 border-t border-border/60 pt-4 text-xs font-bold uppercase tracking-wider text-primary">
          {t("pages.companies.explore")} <ChevronRight className="h-4 w-4" />
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="pointer-events-none absolute bottom-1 right-2 text-6xl font-black leading-none text-foreground/[0.06] select-none"
        aria-hidden
      >
        {n}
      </div>
      <div className="absolute inset-0 opacity-80 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-80 [background:linear-gradient(155deg,hsl(var(--background)/0.65)_0%,transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--brand-emerald)/0.12)_100%)]" />
      <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25 shadow-[0_12px_22px_-12px_rgba(13,77,51,0.65)]">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="relative text-xl font-extrabold tracking-tight text-foreground mb-2">
        {t(block.titleKey)}
      </h2>
      <p className="relative text-sm text-muted-foreground leading-relaxed">
        {t(block.descKey)}
      </p>
      <div className="relative mt-6 inline-flex items-center gap-2 border-t border-border/60 pt-4 text-xs font-bold uppercase tracking-wider text-primary">
        {t("pages.companies.explore")} <ChevronRight className="h-4 w-4" />
      </div>
    </>
  );
}

export default function CompaniesPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <HubCinematicHero
        badgeIcon={Building2}
        badgeLabel={t("nav.companies")}
        sectionsKicker={t("pages.companies.hero_sections")}
        titleLead={t("pages.companies.hero_title_lead")}
        titleBrand={t("pages.companies.hero_title_brand")}
        subtitle={t("pages.companies.hero_subtitle")}
        chipsAriaLabel={t("pages.companies.hero_sections")}
        chips={BLOCKS.map((b, i) => ({
          id: b.key,
          idx: `0${i + 1}`,
          label: t(b.titleKey),
        }))}
      >
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
            <span className="text-2xl font-black leading-none text-brand-gold tabular-nums">
              {BLOCKS.length}
            </span>
            <span className="max-w-[14rem] text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80">
              {t("pages.companies.explore")} — ESG
            </span>
          </div>
        </div>
      </HubCinematicHero>

      <div className="gradient-flow-bg relative">
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-primary to-transparent opacity-30" />
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
          <div className="pointer-events-none absolute -top-6 left-1/2 h-24 w-[75%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {BLOCKS.map((block, idx) => {
              const v = hubVariantClass(idx, "trio");
              return (
                <motion.div
                  key={block.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.06, duration: 0.45 }}
                >
                  <HubBentoLink to={block.href} id={block.key} variant={v} className="h-full">
                    <CardContent block={block} idx={idx} variant={v} t={t} />
                  </HubBentoLink>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
