import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PILLARS } from "@/lib/pillars";

/**
 * Rangée de raccourcis vers les piliers thématiques (style menu de portail média).
 */
export function TopicShortcuts() {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("home.news_front.topics_aria")}
      className="bg-card border-y border-border w-full max-w-[100vw] min-w-0 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto overscroll-x-contain py-3 pb-3.5 -mx-1 px-1 scrollbar-hide touch-pan-x snap-x snap-mandatory">
          <span className="shrink-0 snap-start inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pr-2 border-r border-border mr-0.5">
            {t("home.news_front.topics_label")}
          </span>
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.slug}
                to={`/thematiques/${pillar.slug}`}
                className={`shrink-0 snap-start inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] transition-all border whitespace-nowrap ${pillar.color.border} ${pillar.color.soft} ${pillar.color.text} hover:bg-foreground hover:text-background hover:border-foreground`}
              >
                <Icon className="w-3.5 h-3.5" />
                {pillar.label}
              </Link>
            );
          })}
          <Link
            to="/thematiques"
            className="shrink-0 inline-flex items-center px-3.5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.14em] bg-foreground text-background hover:bg-primary transition-colors"
          >
            {t("home.news_front.topics_all")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
