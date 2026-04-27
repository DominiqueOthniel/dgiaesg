import { Link, Navigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
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

export default function CompanyProfileSlugPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { companySlug } = useParams<{ companySlug: string }>();
  const { data: companiesData, isLoading } = useCompanies({});
  const companies = companiesData?.data || [];

  const company = useMemo(() => {
    if (!companySlug) return undefined;
    return companies.find((item) => {
      const name = getLocalized(item.name, lang);
      return toSlug(name) === companySlug;
    });
  }, [companies, companySlug, lang]);

  if (!isLoading && !company) return <Navigate to="/entreprises" replace />;

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <HubSubpageShell
      badgeIcon={Building2}
      badgeLabel={t("pages.companies.profile.hero_badge")}
      titleLead={getLocalized(company.name, lang)}
      titleBrand={t("pages.companies.profile.hero_title_brand")}
      subtitle={t("pages.companies.profile.subtitle")}
      beforeBadge={
        <Link
          to="/entreprises"
          className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" /> {t("pages.companies.profile.back")}
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="golden-glow relative lg:col-span-2 rounded-3xl border-border/90 bg-card p-6 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />
            <h2 className="text-lg font-extrabold tracking-tight text-foreground mb-3">
              {t("pages.companies.profile.overview")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getLocalized(company.description, lang)}
            </p>
          </div>

          <div className="golden-glow relative rounded-3xl border-border/90 bg-card p-6 space-y-4 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">
              {t("pages.companies.profile.metrics")}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t("pages.companies.profile.score")}</span>
              <span className="text-sm font-black text-foreground">{company.score ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t("pages.companies.profile.sector")}</span>
              <span className="text-sm font-black text-foreground">{getLocalized(company.sector, lang)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t("pages.companies.profile.region")}</span>
              <span className="text-sm font-black text-foreground">{getLocalized(company.region, lang)}</span>
            </div>
            <Link
              to={`/directory/${company._id}`}
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"
            >
              {t("pages.companies.profile.open_full")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
      </div>
    </HubSubpageShell>
  );
}
