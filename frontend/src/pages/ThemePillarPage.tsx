import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PILLARS, PILLAR_BY_SLUG, isPillarSlug } from "@/lib/pillars";

const IMAGE_FALLBACK =
  "https://placehold.co/800x400/e2e8f0/94a3b8?text=Article";

// ---------------------------------------------------------------------------
// Local mock dataset — same shape as NewsPage. Replace with API call.
// ---------------------------------------------------------------------------
type Article = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;     // pillar slug
  subCategory: string;  // matches Pillar.subCategories[].value
  format: "breve" | "analyse" | "enquete" | "interview" | "communique";
  readingTime: number;
  imageUrl: string;
  publishedAt: string;
};

const FORMAT_BADGE: Record<Article["format"], { label: string; cls: string }> = {
  breve: { label: "Brève", cls: "bg-sky-600 text-white" },
  analyse: { label: "Analyse", cls: "bg-[hsl(var(--brand-emerald))] text-white" },
  enquete: {
    label: "Enquête",
    cls: "bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold-foreground))]",
  },
  interview: { label: "Interview", cls: "bg-violet-600 text-white" },
  communique: { label: "Communiqué", cls: "bg-slate-700 text-white" },
};

const PILLAR_MOCK: Article[] = [
  {
    _id: "p1",
    slug: "afrique-renouvelables-record",
    title: "Renouvelables : l'Afrique signe un record d'investissements",
    excerpt:
      "Plus de 15 milliards USD mobilisés en un an pour le solaire et l'éolien sur le continent.",
    category: "climat-energie",
    subCategory: "renouvelables",
    format: "analyse",
    readingTime: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80",
    publishedAt: "2025-03-18T08:00:00Z",
  },
  // ... more mock data if needed, but for now we rely on the logic
];

export default function ThemePillarPage() {
  const { pillar: slug } = useParams();
  const [sub, setSub] = useState("all");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [sub]);

  if (!slug || !isPillarSlug(slug)) {
    return <Navigate to="/thematiques" replace />;
  }

  const pillar = PILLAR_BY_SLUG[slug];
  const Icon = pillar.icon;

  const articles = useMemo(() => {
    let list = PILLAR_MOCK.filter((a) => a.category === pillar.slug);
    if (sub !== "all") list = list.filter((a) => a.subCategory === sub);
    return list.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }, [pillar.slug, sub]);

  return (
    <div className="min-h-screen news-bg text-foreground">
      {/* Hero — pillar accent color */}
      <section className={cn("relative overflow-hidden", pillar.color.bg)}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.18),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <Link
            to="/thematiques"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Thématiques
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Icon className="w-5 h-5 text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              Pilier éditorial
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            <span className="h1-golden-glow">{pillar.h1}</span>
          </h1>
          <p className="text-lg text-white/85 max-w-2xl">{pillar.description}</p>
        </div>
      </section>

      {/* Sub-category bar */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div
          aria-label="Sous-catégories"
          className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1"
        >
          <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground pr-1">
            Sous-catégories :
          </span>
          {pillar.subCategories.map((s) => {
            const active = sub === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setSub(s.value)}
                className={cn(
                  "shrink-0 h-9 px-3.5 rounded-full text-[11px] font-bold transition-all border",
                  active
                    ? cn(
                        pillar.color.soft,
                        pillar.color.border,
                        pillar.color.text,
                      )
                    : "bg-white/70 border-white/60 text-muted-foreground hover:text-foreground hover:bg-white",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--brand-deep))] text-primary-foreground shadow-sm">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
            {articles.length}{" "}
            <span className="text-muted-foreground font-semibold normal-case tracking-normal">
              article{articles.length > 1 ? "s" : ""}
            </span>
          </span>
        </div>
      </div>

      {/* Articles grid — same card-gold language as /actualites */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {articles.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const fmt = FORMAT_BADGE[article.format];
              const isFlash = article.format === "breve";
              return (
                <Link
                  key={article._id}
                  to={`/news/${article.slug}`}
                  className="group card-gold block bg-card rounded-2xl overflow-hidden h-full flex flex-col"
                >
                  {/* Golden corners for elevation effect */}
                  <div className="corner corner-tl" />
                  <div className="corner corner-tr" />
                  <div className="corner corner-bl" />
                  <div className="corner corner-br" />

                  <div className="relative bg-muted overflow-hidden aspect-video">
                    <img
                      src={article.imageUrl || IMAGE_FALLBACK}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                      }}
                    />
                    <span
                      className={cn(
                        "absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 h-6 rounded-full text-[10px] font-black uppercase tracking-[0.14em] shadow-md backdrop-blur-sm",
                        fmt.cls,
                      )}
                    >
                      {fmt.label}
                    </span>
                    <span
                      className={cn(
                        "absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 h-6 rounded-full text-[10px] font-black uppercase tracking-[0.14em] shadow-md backdrop-blur-sm border",
                        pillar.color.soft,
                        pillar.color.border,
                        pillar.color.text,
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {pillar.label}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-extrabold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-3 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-foreground/70 line-clamp-2 mb-6 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-black gap-2">
                      <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.publishedAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        {isFlash ? (
                          <Zap className="w-3 h-3 text-sky-600" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {isFlash
                          ? `Flash ${article.readingTime} min`
                          : `Lecture ${article.readingTime} min`}
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:text-[hsl(var(--brand-emerald))] group-hover:translate-x-1.5 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Aucun article dans cette sous-catégorie pour le moment.
            </p>
            <button
              onClick={() => setSub("all")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold"
            >
              Voir tous les articles du pilier
            </button>
          </div>
        )}
      </div>

      {/* Cross-link to other pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground mb-4">
          Explorer les autres piliers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PILLARS.filter((p) => p.slug !== pillar.slug).map((p) => {
            const PIcon = p.icon;
            return (
              <Link
                key={p.slug}
                to={`/thematiques/${p.slug}`}
                className={cn(
                  "group flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-xs font-bold transition-all hover:shadow-md",
                  p.color.border,
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0",
                    p.color.soft,
                  )}
                >
                  <PIcon className={cn("w-3.5 h-3.5", p.color.text)} />
                </span>
                <span className="truncate text-foreground group-hover:text-primary">
                  {p.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
