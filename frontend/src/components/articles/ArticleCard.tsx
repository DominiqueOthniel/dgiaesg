import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/800x450/e2e8f0/94a3b8?text=Article";

export type ArticleCardVariant = "hero" | "list" | "compact";

export interface ArticleCardProps {
  variant?: ArticleCardVariant;
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string | null;
  sector?: string;
  subCategoryLabel?: string;
  dateLabel?: string;
  premium?: boolean;
}

export function ArticleCard({
  variant = "list",
  slug,
  title,
  excerpt,
  imageUrl,
  sector,
  subCategoryLabel,
  dateLabel,
  premium,
}: ArticleCardProps) {
  const href = `/news/${slug}`;
  const resolvedImg = resolveImageUrl(imageUrl);

  if (variant === "compact") {
    return (
      <Link to={href} className="group block border-b border-surface-muted pb-4 last:border-b-0">
        {sector && (
          <p className="metadata mb-1 text-brand-primary">
            {sector}
          </p>
        )}
        <h3 className="text-sm font-serif font-bold text-brand-secondary leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {dateLabel && (
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">
            {dateLabel}
          </p>
        )}
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className={cn(
        "group flex gap-5 pb-6 border-b border-surface-muted cursor-pointer",
        variant === "hero" && "flex-col lg:flex-row pb-8 border-b-2 border-surface-muted"
      )}
    >
      {resolvedImg && (
        <div
          className={cn(
            "overflow-hidden bg-slate-100 ring-1 ring-surface-muted shrink-0",
            variant === "hero" ? "w-full lg:w-80 aspect-video" : "w-28 h-28"
          )}
        >
          <img
            src={resolvedImg}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
            }}
          />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {sector && (
            <span className="metadata text-brand-primary">
              {sector}
            </span>
          )}
          {subCategoryLabel && (
            <>
              <span className="w-1 h-1 bg-surface-muted rounded-full" />
              <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-1.5 py-0.5">
                {subCategoryLabel}
              </span>
            </>
          )}
          {premium && (
            <span className="text-[9px] font-black uppercase tracking-widest bg-brand-secondary text-brand-accent px-2 py-0.5 border border-brand-accent/40">
              PREMIUM
            </span>
          )}
        </div>

        <h3
          className={cn(
            "font-serif font-bold text-brand-secondary group-hover:text-brand-primary transition-colors",
            variant === "hero" ? "text-xl md:text-2xl mb-2" : "text-sm md:text-base"
          )}
        >
          {title}
        </h3>

        {excerpt && (
          <p className="text-[11px] text-text-muted mt-1 line-clamp-3 italic">
            {excerpt}
          </p>
        )}

        {dateLabel && (
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-2">
            {dateLabel}
          </p>
        )}
      </div>
    </Link>
  );
}

