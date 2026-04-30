import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/image";
import { PILLARS, type Pillar } from "@/lib/pillars";
import { getLocalized, handleImageError } from "./_shared";

const IMAGE_FALLBACK =
  "https://placehold.co/600x400/e2e8f0/94a3b8?text=Article";

function pickArticles(news: any[], pillar: Pillar, taken: Set<string>, count = 4) {
  const lower = (s: string | undefined) => (s || "").toLowerCase();
  const labelLc = lower(pillar.label);
  const slugLc = lower(pillar.slug);

  const matched = news.filter((a: any) => {
    if (taken.has(a._id)) return false;
    const fields = [a.sector, a.category, a.theme, ...(a.tags || [])]
      .filter(Boolean)
      .map((x: any) => lower(String(x)));
    return fields.some((f) => f.includes(labelLc) || f.includes(slugLc));
  });

  const result: any[] = [];
  for (const item of matched) {
    if (result.length >= count) break;
    result.push(item);
    taken.add(item._id);
  }
  if (result.length < count) {
    for (const item of news) {
      if (taken.has(item._id)) continue;
      result.push(item);
      taken.add(item._id);
      if (result.length >= count) break;
    }
  }
  return result;
}

/**
 * Trois colonnes par pilier (Climat / Finance ESG / Gouvernance) — avec une
 * principale en grand et des titres listés.
 */
export function PillarColumns({
  news,
  lang,
}: {
  news: any[];
  lang: string;
}) {
  const { t } = useTranslation();

  const selected = [PILLARS[0], PILLARS[1], PILLARS[3]]; // Climat, Finance ESG, Gouvernance

  const taken = new Set<string>();
  const columns = selected.map((p) => ({
    pillar: p,
    items: pickArticles(news, p, taken, 4),
  }));

  return (
    <section className="bg-background py-12 md:py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8 md:mb-10 pb-4 border-b border-primary/30">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-primary block mb-2">
              {t("home.news_front.pillar_kicker")}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {t("home.news_front.pillar_title")}
            </h2>
          </div>
          <Link
            to="/thematiques"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-primary hover:text-brand-gold-dark transition-colors"
          >
            {t("home.news_front.pillar_view_all")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {columns.map(({ pillar, items }) => {
            const Icon = pillar.icon;
            const top = items[0];
            const rest = items.slice(1);
            return (
              <div
                key={pillar.slug}
                className="flex flex-col border-t-2 border-primary/40 pt-4"
              >
                <Link
                  to={`/thematiques/${pillar.slug}`}
                  className={`inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] mb-4 ${pillar.color.text} hover:opacity-80 transition-opacity`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {pillar.label}
                </Link>

                {top && (
                  <Link
                    to={`/news/${top.slug || top._id}`}
                    className="group block mb-5"
                  >
                    <div className="aspect-[16/10] bg-muted overflow-hidden rounded-lg mb-3">
                      <img
                        src={
                          top.imageUrl
                            ? resolveImageUrl(top.imageUrl)
                            : IMAGE_FALLBACK
                        }
                        alt={getLocalized(top.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        onError={handleImageError}
                      />
                    </div>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                      {getLocalized(top.title, lang)}
                    </h3>
                    {top.excerpt && (
                      <p className="text-[13px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {getLocalized(top.excerpt, lang)}
                      </p>
                    )}
                  </Link>
                )}

                <ul className="divide-y divide-border border-t border-border">
                  {rest.map((article: any) => (
                    <li key={article._id}>
                      <Link
                        to={`/news/${article.slug || article._id}`}
                        className="block py-3 group"
                      >
                        <p className="font-serif text-[15px] font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                          {getLocalized(article.title, lang)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
