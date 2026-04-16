import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";
import { useNewsArticle } from "@/hooks/useNewsArticle";
import { useNews } from "@/hooks/useNews";
import { getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/800x400/e2e8f0/94a3b8?text=Article";

function NewsArticlePage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useNewsArticle(slug);
  const { data: relatedData } = useNews({ limit: 4 });
  const relatedArticles = (relatedData?.data || []).filter((n: any) => n.slug !== slug).slice(0, 3);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Article introuvable</h2>
        <Link to="/news" className="text-sm font-semibold text-primary hover:underline">← Retour au journal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 bg-muted overflow-hidden">
        <img
          src={resolveImageUrl(article.imageUrl) || IMAGE_FALLBACK}
          alt={getLocalized(article.title, lang)}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <Link to="/news" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour au journal
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-lg">
          {article.sector && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 block">{article.sector}</span>
          )}
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
            {getLocalized(article.title, lang)}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
            {article.author && (
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{article.author}</span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            {article.readingTime && <span>{article.readingTime}</span>}
          </div>

          {/* Content */}
          <div
            className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: getLocalized(article.content, lang) }}
          />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 mb-16">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((a: any) => (
                <Link key={a._id} to={`/news/${a.slug}`} className="group block bg-card border border-border rounded-xl overflow-hidden hover-lift">
                  <div className="aspect-[16/10] bg-muted overflow-hidden">
                    <img
                      src={resolveImageUrl(a.imageUrl) || IMAGE_FALLBACK}
                      alt={getLocalized(a.title, lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {getLocalized(a.title, lang)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsArticlePage;
