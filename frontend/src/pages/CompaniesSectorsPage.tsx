import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Factory, ChevronRight } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { getLocalized } from "@/lib/utils";

export default function CompaniesSectorsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: companiesData } = useCompanies({});
  const companies = companiesData?.data || [];

  const sectors = useMemo(() => {
    const map = new Map<string, number>();
    companies.forEach((company) => {
      const key = getLocalized(company.sector, lang) || t("common.all");
      map.set(key, (map.get(key) || 0) + 1);
    });
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [companies, lang, t]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.065] [background:radial-gradient(circle_at_14%_12%,hsl(var(--brand-emerald))_0%,transparent_34%),radial-gradient(circle_at_86%_74%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,white_0_1px,transparent_1px_18px)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5">
            <Factory className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("pages.companies.sectors.kicker")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 leading-[1.05]">
            {t("pages.companies.sectors.title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.companies.sectors.subtitle")}
          </p>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sectors.map((sector) => (
            <div key={sector.name} className="group golden-glow relative rounded-3xl border-border/90 bg-card p-5 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-extrabold tracking-tight text-foreground">
                  {sector.name}
                </h2>
                <span className="text-xs font-black px-2 py-1 rounded-full bg-primary/10 text-primary ring-1 ring-primary/25">
                  {sector.count}
                </span>
              </div>
              <Link
                to={`/directory?search=${encodeURIComponent(sector.name)}`}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80"
              >
                {t("pages.companies.sectors.open_registry")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
