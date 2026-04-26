import { useTranslation } from "react-i18next";
import { LineChart } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

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
    <HubSubpageShell
      badgeIcon={LineChart}
      badgeLabel={t("pages.data.blocks.indicators_title")}
      titleLead={t("pages.data.indicators.hero_title_lead")}
      titleBrand={t("pages.data.indicators.hero_title_brand")}
      subtitle={t("pages.data.indicators.subtitle")}
    >
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
    </HubSubpageShell>
  );
}
