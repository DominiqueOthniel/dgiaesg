import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Building2, ChevronRight } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { getLocalized } from "@/lib/utils";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

function toSlug(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CompaniesProfilesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: companiesData } = useCompanies({ limit: 30 });
  const companies = companiesData?.data || [];

  const list = useMemo(
    () =>
      [...companies].sort((a, b) =>
        getLocalized(a.name, lang).localeCompare(getLocalized(b.name, lang))
      ),
    [companies, lang]
  );

  return (
    <HubSubpageShell
      badgeIcon={Building2}
      badgeLabel={t("pages.companies.blocks.profiles_title")}
      titleLead={t("pages.companies.profiles_page.hero_title_lead")}
      titleBrand={t("pages.companies.profiles_page.hero_title_brand")}
      subtitle={t("pages.companies.blocks.profiles_desc")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((company) => {
          const name = getLocalized(company.name, lang);
          return (
            <Link
              key={company._id}
              to={`/entreprises/profils/${toSlug(name)}`}
              className="group golden-glow relative rounded-3xl border-border/90 bg-card p-5 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold tracking-tight text-foreground">
                    {name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getLocalized(company.sector, lang)} • {getLocalized(company.region, lang)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-primary" />
              </div>
            </Link>
          );
        })}
      </div>
    </HubSubpageShell>
  );
}
