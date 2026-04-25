import { useTranslation } from "react-i18next";
import { LineChart } from "lucide-react";

const INDICATORS = [
  { label: "Taux d'energie renouvelable", value: "38%", scope: "Afrique de l'Ouest" },
  { label: "Acces a l'eau potable", value: "71%", scope: "Afrique de l'Est" },
  { label: "Part des obligations vertes", value: "12.4%", scope: "Afrique du Nord" },
  { label: "Couverture reporting ESG", value: "54%", scope: "Afrique australe" },
  { label: "Investissement climat / PIB", value: "2.1%", scope: "Afrique centrale" },
  { label: "Taux de recyclage urbain", value: "29%", scope: "Pan-africain" },
];

export default function DataIndicatorsPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.065] [background:radial-gradient(circle_at_12%_14%,hsl(var(--brand-emerald))_0%,transparent_34%),radial-gradient(circle_at_86%_74%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5">
            <LineChart className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("pages.data.blocks.indicators_title")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 leading-[1.05]">
            {t("pages.data.indicators.title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.data.indicators.subtitle")}
          </p>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDICATORS.map((item) => (
              <article
                key={item.label}
                className="golden-glow relative rounded-3xl border-border/90 bg-card p-5 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] overflow-hidden"
              >
                <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">{item.scope}</p>
                <h2 className="text-base font-extrabold tracking-tight text-foreground">{item.label}</h2>
                <p className="mt-4 text-3xl font-black text-primary">{item.value}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
