import { useTranslation } from "react-i18next";
import { MapPin, ChevronRight, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { HubCinematicHero, HubBentoLink, hubVariantClass } from "@/components/hub/HubCinematicHero";

const REGIONS = [
  {
    slug: "afrique-ouest",
    title: { fr: "Afrique de l'Ouest", en: "West Africa" },
    countries: {
      fr: ["Sénégal", "Côte d'Ivoire", "Ghana", "Nigeria"],
      en: ["Senegal", "Cote d'Ivoire", "Ghana", "Nigeria"],
    },
    count: 16,
  },
  {
    slug: "afrique-centrale",
    title: { fr: "Afrique centrale", en: "Central Africa" },
    countries: {
      fr: ["Cameroun", "Congo", "RDC", "Gabon"],
      en: ["Cameroon", "Congo", "DRC", "Gabon"],
    },
    count: 9,
  },
  {
    slug: "afrique-nord",
    title: { fr: "Afrique du Nord", en: "North Africa" },
    countries: {
      fr: ["Maroc", "Égypte", "Tunisie", "Algérie"],
      en: ["Morocco", "Egypt", "Tunisia", "Algeria"],
    },
    count: 6,
  },
  {
    slug: "afrique-est",
    title: { fr: "Afrique de l'Est", en: "East Africa" },
    countries: {
      fr: ["Kenya", "Éthiopie", "Rwanda", "Tanzanie"],
      en: ["Kenya", "Ethiopia", "Rwanda", "Tanzania"],
    },
    count: 14,
  },
  {
    slug: "afrique-australe",
    title: { fr: "Afrique australe", en: "Southern Africa" },
    countries: {
      fr: ["Afrique du Sud", "Zimbabwe", "Mozambique", "Namibie"],
      en: ["South Africa", "Zimbabwe", "Mozambique", "Namibia"],
    },
    count: 9,
  },
] as const;

type Region = (typeof REGIONS)[number];

function RegionCard({
  region,
  isEn,
  idx,
  variant,
  t,
}: {
  region: Region;
  isEn: boolean;
  idx: number;
  variant: "flagship" | "offset" | "heritage";
  t: (k: string, o?: { count: number }) => string;
}) {
  const n = `0${idx + 1}`;
  const title = isEn ? region.title.en : region.title.fr;
  const line = (isEn ? region.countries.en : region.countries.fr).join(" • ");

  if (variant === "offset") {
    return (
      <>
        <div className="absolute right-0 top-0 p-2 opacity-15 text-5xl font-black text-emerald-600/35">
          {n}
        </div>
        <div className="relative mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <Globe2 className="h-6 w-6" />
          </div>
          <span className="shrink-0 rounded-full border border-border/60 bg-muted/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {t("pages.countries.region_countries", { count: region.count })}
          </span>
        </div>
        <h2 className="relative text-xl font-extrabold tracking-tight text-foreground mb-2">
          {title}
        </h2>
        <p className="relative text-sm text-muted-foreground leading-relaxed">
          {line}
        </p>
        <div className="relative mt-6 flex items-center gap-2 border-t border-border/60 pt-4 text-xs font-bold uppercase tracking-wider text-primary">
          {t("pages.countries.explore_region")} <ChevronRight className="h-4 w-4" />
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="pointer-events-none absolute bottom-0 right-2 text-5xl font-black leading-none text-foreground/[0.07] select-none"
        aria-hidden
      >
        {n}
      </div>
      <div className="absolute inset-0 opacity-80 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-80 [background:linear-gradient(155deg,hsl(var(--background)/0.65)_0%,transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--brand-emerald)/0.12)_100%)]" />
      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_12px_22px_-12px_rgba(13,77,51,0.65)]">
          <Globe2 className="h-5 w-5" />
        </div>
        <span className="shrink-0 rounded-full border border-border/60 bg-muted/70 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {t("pages.countries.region_countries", { count: region.count })}
        </span>
      </div>
      <h2 className="relative text-xl font-extrabold tracking-tight text-foreground mb-2">
        {title}
      </h2>
      <p className="relative text-sm text-muted-foreground leading-relaxed">
        {line}
      </p>
      <div className="relative mt-6 inline-flex items-center gap-2 border-t border-border/60 pt-4 text-xs font-bold uppercase tracking-wider text-primary">
        {t("pages.countries.explore_region")} <ChevronRight className="h-4 w-4" />
      </div>
    </>
  );
}

export default function CountriesPage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith("en");
  const totalCountries = REGIONS.reduce((sum, region) => sum + region.count, 0);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <HubCinematicHero
        badgeIcon={MapPin}
        badgeLabel={t("pages.countries.hub_kicker")}
        sectionsKicker={t("pages.countries.hub_sections")}
        titleLead={t("pages.countries.hub_title_lead")}
        titleBrand={t("pages.countries.hub_title_brand")}
        subtitle={t("pages.countries.hub_subtitle")}
        chipsAriaLabel={t("pages.countries.hub_sections")}
        chips={REGIONS.map((r, i) => ({
          id: r.slug,
          idx: `0${i + 1}`,
          label: isEn ? r.title.en : r.title.fr,
        }))}
      >
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm">
            <span className="text-2xl font-black leading-none text-brand-gold tabular-nums">
              {totalCountries}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/80">
              {t("pages.countries.stats_countries")}
            </span>
          </div>
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm">
            <span className="text-2xl font-black leading-none text-brand-gold tabular-nums">
              {REGIONS.length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/80">
              {t("pages.countries.stats_hubs")}
            </span>
          </div>
        </div>
      </HubCinematicHero>

      <div className="gradient-flow-bg relative">
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-primary to-transparent opacity-30" />
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
          <div className="pointer-events-none absolute -top-6 left-1/2 h-24 w-[80%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {REGIONS.map((region, idx) => {
              const v = hubVariantClass(idx, "trio");
              return (
                <motion.div
                  key={region.slug}
                  initial={{ opacity: 0, y: 22, scale: 0.99 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.04 }}
                >
                  <HubBentoLink
                    to={`/pays/${region.slug}`}
                    id={region.slug}
                    variant={v}
                    className="h-full"
                  >
                    <RegionCard
                      region={region}
                      isEn={isEn}
                      idx={idx}
                      variant={v}
                      t={t}
                    />
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
