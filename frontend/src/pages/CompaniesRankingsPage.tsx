import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Crown, Lock, ArrowRight } from "lucide-react";

const MOCK_RANKING = [
  { rank: 1, name: "OCP Group", score: 92 },
  { rank: 2, name: "Safaricom", score: 90 },
  { rank: 3, name: "Attijariwafa bank", score: 88 },
  { rank: 4, name: "Nedbank", score: 86 },
  { rank: 5, name: "Sonatel", score: 84 },
];

export default function CompaniesRankingsPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/25 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_14%_12%,hsl(var(--brand-emerald))_0%,transparent_34%),radial-gradient(circle_at_88%_75%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,white_0_1px,transparent_1px_18px)]" />
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-brand-gold/20 blur-[90px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.5)]">
            <Crown className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("pages.companies.rankings.kicker")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 leading-[1.05]">
            {t("pages.companies.rankings.title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.companies.rankings.subtitle")}
          </p>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 z-10">
        <div className="golden-glow relative rounded-3xl border-border/90 bg-card overflow-hidden shadow-[0_30px_70px_-30px_rgba(13,77,51,0.55)]">
          <div className="pointer-events-none absolute inset-0 opacity-75 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />
          <div className="px-6 md:px-8 py-5 border-b border-border bg-muted/40">
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">
              {t("pages.companies.rankings.preview")}
            </h2>
          </div>
          <div className="divide-y divide-border">
            {MOCK_RANKING.map((item) => (
              <div key={item.rank} className="px-6 md:px-8 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center ring-1 ring-primary/25">
                    {item.rank}
                  </span>
                  <p className="font-bold text-foreground truncate">{item.name}</p>
                </div>
                <p className="text-sm font-black text-primary px-2 py-1 rounded-md bg-primary/10">{item.score}/100</p>
              </div>
            ))}
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
      </section>
      </div>
    </div>
  );
}
