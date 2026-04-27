import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Users, ArrowLeft } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

type Member = { name: string; role: string; focus: string };

export default function TeamPage() {
  const { t } = useTranslation();
  const members = t("pages.team.members", { returnObjects: true }) as Member[];

  return (
    <HubSubpageShell
      badgeIcon={Users}
      badgeLabel={t("pages.team.badge")}
      sectionsKicker={t("pages.team.sections_kicker")}
      titleLead={t("pages.team.hero_title_lead")}
      titleBrand={t("pages.team.hero_title_brand")}
      subtitle={t("pages.team.hero_subtitle")}
      beforeBadge={
        <Link
          to="/a-propos"
          className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {t("pages.team.back_about")}
        </Link>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.isArray(members) &&
          members.map((m) => (
            <article
              key={m.name}
              className="golden-glow relative rounded-3xl border-border/90 bg-card p-6 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 mb-4">
                <Users className="h-7 w-7 opacity-90" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground">{m.name}</h2>
              <p className="text-xs font-black uppercase tracking-widest text-primary mt-2">{m.role}</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{m.focus}</p>
            </article>
          ))}
      </div>
    </HubSubpageShell>
  );
}
