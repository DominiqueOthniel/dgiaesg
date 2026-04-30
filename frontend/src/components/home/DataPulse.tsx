import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, BarChart3, Building2, Globe, ShieldCheck } from "lucide-react";

/**
 * Bandeau de chiffres clés ESG (style « at-a-glance ») avec lien vers Données.
 */
export function DataPulse() {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("home.conformity.stat_entities"),
      value: "2 400+",
      icon: Building2,
    },
    {
      label: t("home.conformity.stat_countries"),
      value: "24",
      icon: Globe,
    },
    {
      label: t("home.conformity.stat_audits"),
      value: "850",
      icon: ShieldCheck,
    },
    {
      label: t("home.news_front.data_indicators"),
      value: "180+",
      icon: BarChart3,
    },
  ];

  return (
    <section className="relative bg-[linear-gradient(135deg,_hsl(var(--surface-warm))_0%,_hsl(var(--brand-gold)/0.10)_50%,_hsl(var(--surface-warm))_100%)] border-y border-brand-gold/30 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-gold-dark block mb-1.5">
              {t("home.news_front.data_kicker")}
            </span>
            <h2 className="font-heading text-xl md:text-2xl font-black uppercase italic tracking-tight text-primary">
              {t("home.news_front.data_title")}
            </h2>
          </div>
          <Link
            to="/donnees"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-primary hover:text-brand-gold-dark transition-colors"
          >
            {t("home.news_front.data_explore")}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="relative bg-card/90 backdrop-blur-sm rounded-xl p-5 border border-brand-gold/25 ring-1 ring-brand-gold/10 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <s.icon className="w-5 h-5 text-brand-gold-dark mb-3" />
              <p className="font-heading text-3xl md:text-4xl font-black text-primary leading-none tracking-tight">
                {s.value}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
