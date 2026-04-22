import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Calendar, User, Share2, Bookmark, 
  MessageSquare, Clock, Zap, ShieldCheck, ChevronRight 
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useNewsArticle } from "@/hooks/useNewsArticle";
import { useNews } from "@/hooks/useNews";
import { useAuth } from "@/context/AuthContext";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import api from "@/services/api";
import { Button } from "@/components/ui/Button";

const IMAGE_FALLBACK = "https://placehold.co/800x400/e2e8f0/94a3b8?text=Article";

function NewsArticlePage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const { slug } = useParams<{ slug: string }>();
  
  const { data: article, isLoading } = useNewsArticle(slug);
  const { data: relatedNewsData, isLoading: relatedLoading } = useNews({
    sector: article?.sector,
    limit: 6,
    published: true,
  });

  const { user, isAuthenticated, updateSavedArticles } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  useEffect(() => {
    if (user && article) {
      setIsSaved((user.savedArticles || []).includes(article._id));
    }
  }, [user, article]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour sauvegarder cet article.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post('/users/save-article', { articleId: article?._id });
      if (response.data.success) {
        updateSavedArticles(response.data.data);
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Retiré de votre bibliothèque" : "Ajouté à votre bibliothèque");
      }
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const title = getLocalized(article?.title, lang);
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      toast.success(t("news.share_success", "Lien copié avec succès"));
    } catch {
      toast.error(t("news.share_error", "Impossible de partager pour le moment"));
    }
  };

  const relatedArticles = useMemo(() => {
    if (!relatedNewsData?.data || !article) return [];
    return relatedNewsData.data.filter((item) => item._id !== article._id).slice(0, 3);
  }, [relatedNewsData, article]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Article non trouvé</h2>
        <Link to="/news" className="text-sm font-semibold text-primary hover:underline">← Retour au journal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <Link to="/news" className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Journal
            </Link>
            <div className="flex gap-2">
               <button onClick={handleToggleSave} disabled={isSaving} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all border", isSaved ? "bg-accent border-accent text-accent-foreground" : "bg-white/10 border-white/20 text-white hover:bg-white/20")}>
                 <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
               </button>
               <button
                 onClick={handleShare}
                 className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white/10 border-white/20 text-white hover:bg-white/20"
               >
                 <Share2 className="w-5 h-5" />
               </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-white/10 text-primary-foreground/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                {(article.sector ? getLocalized(article.sector as any, lang) : "ACTUALITÉ").toUpperCase()}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Source Vérifiée
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-tight">
              {getLocalized(article.title, lang)}
            </h1>
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-primary-foreground/60 text-xs font-semibold uppercase tracking-widest">
               <div className="flex items-center gap-2"><User className="w-4 h-4 text-accent" /> {article.author}</div>
               <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(article.publishedAt || article.createdAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}</div>
               <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {article.readingTime || "6 min"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border-4 border-background bg-muted">
          <img
            src={!heroImageError ? (resolveImageUrl(article.imageUrl) || IMAGE_FALLBACK) : IMAGE_FALLBACK}
            alt={getLocalized(article.title, lang)}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
              setHeroImageError(true);
            }}
          />
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-12">
            {article.premium && !user?.isPro ? (
              <div className="relative">
                <div className="prose prose-lg md:prose-xl max-w-none text-foreground/80 leading-relaxed overflow-hidden max-h-[400px]">
                   <div dangerouslySetInnerHTML={{ __html: getLocalized(article.content, lang).substring(0, 500) + "..." }} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
                
                {/* Premium Teaser */}
                <div className="mt-10 p-8 md:p-12 rounded-3xl bg-primary text-primary-foreground text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <Zap className="w-10 h-10 text-accent mx-auto mb-6 fill-accent" />
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Contenu Réservé aux Membres</h3>
                  <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto leading-relaxed">
                    Découvrez l'intégralité de cette analyse stratégique et accédez à nos rapports exclusifs en rejoignant notre communauté Premium.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/pricing" className="px-10 py-3 bg-accent text-accent-foreground font-black uppercase tracking-widest text-xs rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-xl">
                      Devenir Premium
                    </Link>
                    <Link to="/login" className="px-10 py-3 bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/20 transition-all">
                      Se Connecter
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="prose prose-lg md:prose-xl max-w-none text-foreground/80 leading-relaxed prose-headings:text-foreground prose-headings:font-extrabold prose-a:text-primary prose-strong:text-foreground">
                <div dangerouslySetInnerHTML={{ __html: getLocalized(article.content, lang).split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('') }} />
              </div>
            )}

            {/* Actions Footer */}
            <div className="mt-20 pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex gap-4">
                 <Button variant="outline" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest gap-2 bg-muted/50 border-none hover:bg-muted" onClick={handleToggleSave}>
                   <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary text-primary")} /> {isSaved ? "Sauvegardé" : "Sauvegarder"}
                 </Button>
                 <Button variant="outline" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest gap-2 bg-muted/50 border-none hover:bg-muted" onClick={handleShare}>
                   <Share2 className="w-4 h-4" /> Partager
                 </Button>
               </div>
               <Link to="/news" className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                 Toutes les actualités <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Section */}
      {relatedArticles.length > 0 && (
        <section className="bg-muted/30 py-20 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold mb-10 tracking-tight">À lire ensuite</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((item) => (
                <Link key={item._id} to={`/news/${item.slug}`} className="group bg-card border border-border rounded-2xl overflow-hidden hover-lift flex flex-col h-full">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={resolveImageUrl(item.imageUrl) || IMAGE_FALLBACK}
                      alt={getLocalized(item.title, lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                      }}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-2 block">{getLocalized(item.sector as any, lang)}</span>
                    <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-4">{getLocalized(item.title, lang)}</h3>
                    <div className="mt-auto flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                       <Calendar className="w-3 h-3" /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default NewsArticlePage;
