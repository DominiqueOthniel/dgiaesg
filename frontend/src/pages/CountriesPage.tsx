import { useTranslation } from "react-i18next";
import { MapPin, ArrowUpRight, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HubCinematicHero } from "@/components/hub/HubCinematicHero";

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
  t,
}: {
  region: Region;
  isEn: boolean;
  t: (k: string, o?: { count: number }) => string;
}) {
  const title = isEn ? region.title.en : region.title.fr;
  const countriesArr = isEn ? region.countries.en : region.countries.fr;
  const countriesLabel = (isEn ? "countries" : "pays").toUpperCase();

  return (
    <Link
      to={`/pays/${region.slug}`}
      id={region.slug}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:ring-1 hover:ring-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Soft halos (Ads-page inspired premium feel) */}
      <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-primary/[0.08] blur-3xl transition-all duration-700 group-hover:bg-primary/[0.18] group-hover:scale-110" />
      <div className="pointer-events-none absolute -left-14 -bottom-14 h-48 w-48 rounded-full bg-brand-gold/[0.08] blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110" />
      {/* Sweeping shine on hover (Ads page sidebar style) */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md group-hover:bg-primary/15">
          <Globe2 className="h-6 w-6 transition-transform duration-500 group-hover:-rotate-6" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 backdrop-blur transition-colors duration-500 group-hover:border-primary/40">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
          <span className="text-sm font-black tabular-nums text-foreground">{region.count}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/65">
            {countriesLabel}
          </span>
        </span>
      </div>

      <h2 className="relative mt-6 text-2xl font-extrabold tracking-tight text-foreground transition-colors duration-500 group-hover:text-primary">
        {title}
      </h2>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {countriesArr.slice(0, 4).map((c) => (
          <span
            key={c}
            className="inline-flex items-center rounded-lg border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] font-bold text-foreground/75 transition-all duration-500 group-hover:border-primary/30 group-hover:bg-primary/[0.06]"
          >
            {c}
          </span>
        ))}
        {countriesArr.length > 4 ? (
          <span className="inline-flex items-center rounded-lg border border-dashed border-border/60 px-2 py-0.5 text-[11px] font-bold text-foreground/55">
            +{countriesArr.length - 4}
          </span>
        ) : null}
      </div>

      <div className="relative mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <span className="text-xs font-black uppercase tracking-wider text-primary transition-all duration-500 group-hover:tracking-[0.18em]">
            {t("pages.countries.explore_region")}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
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

      <div className="relative bg-[linear-gradient(180deg,hsl(var(--surface-warm)),hsl(var(--background)))]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_18%_-10%,hsl(var(--brand-gold)/0.10),transparent_55%),radial-gradient(900px_420px_at_85%_-12%,hsl(var(--brand-emerald)/0.10),transparent_55%)]" />
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
          <div className="pointer-events-none absolute -top-6 left-1/2 h-24 w-[80%] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {REGIONS.map((region, idx) => (
              <motion.div
                key={region.slug}
                initial={{ opacity: 0, y: 22, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
                className="h-full"
              >
                <RegionCard region={region} isEn={isEn} t={t} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
