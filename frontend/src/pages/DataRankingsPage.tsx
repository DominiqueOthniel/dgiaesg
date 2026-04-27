import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

const TOP_COMPANIES = ["OCP Group", "Safaricom", "Attijariwafa bank", "Nedbank", "Sonatel"];
const TOP_COUNTRIES = ["Maroc", "Rwanda", "Kenya", "Ghana", "Afrique du Sud"];
const TOP_SECTORS = ["Banques", "Telecom", "Agro-industrie", "Energie", "Mines"];

function RankingCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="relative rounded-3xl border border-border/90 bg-card overflow-hidden shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)]">
      <div className="pointer-events-none absolute inset-0 opacity-75 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />
      <div className="px-5 py-4 border-b border-border bg-muted/35">
        <h2 className="text-sm font-black uppercase tracking-widest text-primary">{title}</h2>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, idx) => (
          <div key={item} className="px-5 py-3 flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">{item}</p>
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
              {idx + 1}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function DataRankingsPage() {
  const { t } = useTranslation();

  return (
    <HubSubpageShell
      badgeIcon={Trophy}
      badgeLabel={t("pages.data.blocks.rankings_title")}
      titleLead={t("pages.data.rankings.hero_title_lead")}
      titleBrand={t("pages.data.rankings.hero_title_brand")}
      subtitle={t("pages.data.rankings.subtitle")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RankingCard title={t("pages.data.rankings.top_companies")} items={TOP_COMPANIES} />
        <RankingCard title={t("pages.data.rankings.top_countries")} items={TOP_COUNTRIES} />
        <RankingCard title={t("pages.data.rankings.top_sectors")} items={TOP_SECTORS} />
      </div>
    </HubSubpageShell>
  );
}
