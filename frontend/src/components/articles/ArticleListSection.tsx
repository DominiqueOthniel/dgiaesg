import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArticleCard, type ArticleCardProps } from "./ArticleCard";

type ArticleListSectionProps = {
  title: string;
  moreHref?: string;
  metaLabel?: string;
  articles: ArticleCardProps[];
  headerRight?: ReactNode;
};

export function ArticleListSection({
  title,
  moreHref,
  metaLabel,
  articles,
  headerRight,
}: ArticleListSectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5 border-b border-surface-muted pb-3">
        <div>
          {metaLabel && (
            <span className="metadata mb-1 block text-brand-primary">
              {metaLabel}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-serif font-black text-brand-secondary tracking-tight">
            {title}
          </h2>
        </div>
        {moreHref && (
          <Link
            to={moreHref}
            className="text-[10px] font-black uppercase tracking-widest hover:text-brand-primary transition-colors border-b-2 border-brand-primary pb-0.5"
          >
            Voir tout
          </Link>
        )}
        {headerRight}
      </div>

      <div className="space-y-5">
        {articles.map((a) => (
          <ArticleCard key={a.slug} {...a} />
        ))}
      </div>
    </section>
  );
}

