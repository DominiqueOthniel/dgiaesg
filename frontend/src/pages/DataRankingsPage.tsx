import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";

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
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.065] [background:radial-gradient(circle_at_14%_14%,hsl(var(--brand-emerald))_0%,transparent_35%),radial-gradient(circle_at_86%_72%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("pages.data.blocks.rankings_title")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 leading-[1.05]">
            {t("pages.data.rankings.title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.data.rankings.subtitle")}
          </p>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RankingCard title={t("pages.data.rankings.top_companies")} items={TOP_COMPANIES} />
            <RankingCard title={t("pages.data.rankings.top_countries")} items={TOP_COUNTRIES} />
            <RankingCard title={t("pages.data.rankings.top_sectors")} items={TOP_SECTORS} />
          </div>
        </section>
      </div>
    </div>
  );
}
