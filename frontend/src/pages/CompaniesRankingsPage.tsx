import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Crown, Lock, ArrowRight } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { useCompanies } from "@/hooks/useCompanies";
import { getLocalized } from "@/lib/utils";

export default function CompaniesRankingsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isLoading } = useCompanies({
    status: "certified",
    sort: "-score",
    limit: 15,
  });

  const rows =
    data?.data?.map((c, i) => ({
      rank: i + 1,
      name: getLocalized(c.name, lang),
      score: c.score ?? 0,
    })) ?? [];

  return (
    <HubSubpageShell
      badgeIcon={Crown}
      badgeLabel={t("pages.companies.rankings.kicker")}
      titleLead={t("pages.companies.rankings.hero_title_lead")}
      titleBrand={t("pages.companies.rankings.hero_title_brand")}
      subtitle={t("pages.companies.rankings.subtitle")}
    >
      <div className="golden-glow relative rounded-3xl border-border/90 bg-card overflow-hidden shadow-[0_30px_70px_-30px_rgba(13,77,51,0.55)]">
        <div className="pointer-events-none absolute inset-0 opacity-75 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />
        <div className="px-6 md:px-8 py-5 border-b border-border bg-muted/40">
          <h2 className="text-lg font-extrabold tracking-tight text-foreground">
            {t("pages.companies.rankings.preview")}
          </h2>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="px-6 py-10 text-center text-muted-foreground">…</div>
          ) : rows.length > 0 ? (
            rows.map((item) => (
              <div key={item.rank} className="px-6 md:px-8 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center ring-1 ring-primary/25">
                    {item.rank}
                  </span>
                  <p className="font-bold text-foreground truncate">{item.name}</p>
                </div>
                <p className="text-sm font-black text-primary px-2 py-1 rounded-md bg-primary/10">{item.score}/100</p>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-muted-foreground text-sm">
              Aucune entreprise certifiée avec score pour le moment.
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-brand-gold/30 bg-brand-gold/10 p-6 md:p-8 shadow-[0_24px_60px_-24px_rgba(172,132,41,0.6)]">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-brand-gold-dark mt-0.5" />
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">
              {t("pages.companies.rankings.premium_title")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("pages.companies.rankings.premium_desc")}
            </p>
            <Link
              to="/pricing"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all"
            >
              {t("pages.companies.rankings.premium_cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </HubSubpageShell>
  );
}
