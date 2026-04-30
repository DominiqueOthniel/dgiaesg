import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Radio } from "lucide-react";
import { getLocalized } from "./_shared";

/**
 * Bandeau « EN DIRECT » au-dessus de la une.
 */
export function BreakingBar({ news, lang }: { news: any[]; lang: string }) {
  const { t } = useTranslation();
  const headlines = news.slice(0, 4);
  if (headlines.length === 0) return null;

  const dateLabel = new Intl.DateTimeFormat(
    lang === "en" ? "en-GB" : "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date());

  return (
    <div className="w-full max-w-[100vw] overflow-hidden bg-brand-dark text-primary-foreground border-b border-brand-gold/25">
      <div className="max-w-7xl mx-auto min-w-0 px-3 sm:px-6 lg:px-8 py-2 flex items-center gap-2 sm:gap-5">
        <span className="inline-flex items-center gap-2 shrink-0 pr-3 sm:pr-4 border-r border-brand-gold/30">
          <span className="relative inline-flex items-center justify-center w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-brand-gold animate-ping opacity-75" />
            <span className="relative inline-block w-2 h-2 rounded-full bg-brand-gold" />
          </span>
          <Radio className="w-3.5 h-3.5 text-brand-gold" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-gold">
            {t("home.news_front.breaking")}
          </span>
        </span>

        <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="flex gap-10 items-center animate-marquee">
            {[...headlines, ...headlines].map((item: any, idx: number) => (
              <Link
                key={`bk-${idx}-${item._id}`}
                to={`/news/${item.slug || item._id}`}
                className="text-xs sm:text-[13px] font-semibold text-primary-foreground/90 hover:text-brand-gold transition-colors truncate max-w-[60vw]"
              >
                {getLocalized(item.title, lang)}
              </Link>
            ))}
          </div>
        </div>

        <span className="hidden md:block text-[10px] font-semibold text-primary-foreground/65 uppercase tracking-[0.16em] capitalize shrink-0">
          {dateLabel}
        </span>
      </div>
    </div>
  );
}
