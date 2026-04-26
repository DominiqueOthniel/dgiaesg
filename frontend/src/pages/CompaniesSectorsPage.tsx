import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Factory, ChevronRight } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { getLocalized } from "@/lib/utils";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

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
    <HubSubpageShell
      badgeIcon={Factory}
      badgeLabel={t("pages.companies.sectors.kicker")}
      titleLead={t("pages.companies.sectors.hero_title_lead")}
      titleBrand={t("pages.companies.sectors.hero_title_brand")}
      subtitle={t("pages.companies.sectors.subtitle")}
    >
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
    </HubSubpageShell>
  );
}
