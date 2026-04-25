import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Building2, ChevronRight } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { getLocalized } from "@/lib/utils";

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
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.065] [background:radial-gradient(circle_at_13%_12%,hsl(var(--brand-emerald))_0%,transparent_34%),radial-gradient(circle_at_85%_73%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,white_0_1px,transparent_1px_18px)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5">
            <Building2 className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("pages.companies.blocks.profiles_title")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 leading-[1.05]">
            {t("pages.companies.blocks.profiles_title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.companies.blocks.profiles_desc")}
          </p>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 z-10">
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
      </section>
      </div>
    </div>
  );
}
