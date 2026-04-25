import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, ChevronRight, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

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

export default function CountriesPage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith("en");
  const totalCountries = REGIONS.reduce((sum, region) => sum + region.count, 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/25 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_14%_12%,hsl(var(--brand-emerald))_0%,transparent_35%),radial-gradient(circle_at_88%_78%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background:linear-gradient(125deg,transparent_0_40%,hsl(var(--foreground))_40%_41%,transparent_41%_100%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,white_0_1px,transparent_1px_18px)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-brand-gold" />
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-black uppercase tracking-widest text-primary-foreground/85">
              {t("pages.countries.hub_kicker")}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-tight mb-4 max-w-4xl">
            {t("pages.countries.hub_title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.countries.hub_subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15">
              <span className="text-xl font-black text-brand-gold leading-none">{totalCountries}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80">
                {isEn ? "countries indexed" : "pays couverts"}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15">
              <span className="text-xl font-black text-brand-gold leading-none">{REGIONS.length}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80">
                {isEn ? "regional hubs" : "hubs régionaux"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-24 rounded-full bg-primary/10 blur-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7">
            {REGIONS.map((region, idx) => (
              <motion.div
                key={region.slug}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <Link
                  to={`/pays/${region.slug}`}
                  className="group golden-glow relative block h-full rounded-3xl border-border/90 bg-card p-6 overflow-hidden shadow-[0_30px_72px_-30px_rgba(13,77,51,0.58)]"
                >
                  <div className="absolute inset-0 opacity-80 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.16),transparent_60%)]" />
                  <div className="pointer-events-none absolute inset-0 opacity-80 [background:linear-gradient(155deg,hsl(var(--background)/0.65)_0%,transparent_45%)]" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-100 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--brand-emerald)/0.12)_100%)]" />
                  <div className="relative flex items-start justify-between gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 shadow-[0_12px_22px_-12px_rgba(13,77,51,0.65)]">
                      <Globe2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1 rounded-full bg-muted/70 border border-border/60">
                      {t("pages.countries.region_countries", { count: region.count })}
                    </span>
                  </div>

                  <h2 className="relative text-xl font-extrabold tracking-tight text-foreground mb-2">
                    {isEn ? region.title.en : region.title.fr}
                  </h2>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">
                    {(isEn ? region.countries.en : region.countries.fr).join(" • ")}
                  </p>

                  <div className="relative mt-6 pt-4 border-t border-border/60 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                    {t("pages.countries.explore_region")} <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
