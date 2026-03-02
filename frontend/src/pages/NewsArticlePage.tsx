import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    User,
    Share2,
    Bookmark,
    Newspaper,
    ShieldCheck,
    ChevronRight,
    MessageSquare,
    Clock,
    Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useNewsArticle } from "../hooks/useNews";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { resolveImageUrl } from "../lib/image";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { cn } from "../lib/utils";

function NewsArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const { data: article, isLoading } = useNewsArticle(slug);
    const { user, isAuthenticated } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user && article) {
            setIsSaved(user.savedArticles.includes(article._id));
        }
    }, [user, article]);

    const handleToggleSave = async () => {
        if (!isAuthenticated) {
            toast.error("Veuillez vous connecter pour sauvegarder des articles.");
            return;
        }

        setIsSaving(true);
        try {
            await api.post('/users/save-article', { articleId: article?._id });
            setIsSaved(!isSaved);
            toast.success(isSaved ? "Retiré de votre bibliothèque" : "Ajouté à votre bibliothèque");
        } catch (error) {
            toast.error("Une erreur est survenue.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="h-12 w-48 bg-slate-50 rounded-full animate-pulse mb-12" />
                    <div className="h-24 w-full bg-slate-50 rounded-3xl animate-pulse mb-16" />
                    <div className="aspect-[21/9] w-full bg-slate-50 rounded-[3rem] animate-pulse" />
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Newspaper className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-brand-secondary">Article non trouvé</h1>
                    <Link to="/news" className="text-brand-primary font-bold mt-4 inline-block hover:underline">REVENIR AU JOURNAL</Link>
                </div>
            </div>
        );
    }

    return (
        <article className="bg-white min-h-screen pb-32">
            {/* Editorial Article Header */}
            <header className="bg-brand-secondary pt-32 pb-48 md:pb-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/4 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/4" />

                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to={`/news/sector/${article.sector || 'finance'}`} className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-16 hover:text-brand-accent transition-colors">
                            <ArrowLeft className="w-4 h-4" /> REVENIR AU HUB {article.sector?.toUpperCase() || 'ESG'}
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center gap-6 mb-12"
                    >
                        <Link to={`/news/sector/${article.sector || 'finance'}`}>
                            <Badge variant="secondary" className="rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest bg-brand-primary text-white border-none hover:bg-brand-accent transition-all italic">
                                {article.sector?.toUpperCase() || "ACTUALITÉ"}
                            </Badge>
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4 text-brand-accent" /> Source Vérifiée
                        </div>
                    </motion.div>

                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-16 leading-[1.1]">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-12 pt-12 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                <User className="text-brand-primary w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Publié par</span>
                                <span className="text-xs font-bold text-white uppercase tracking-widest">{article.author}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                <Calendar className="text-slate-400 w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Date d'émission</span>
                                <span className="text-xs font-bold text-white uppercase tracking-widest">
                                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : "RECENT"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                <Clock className="text-slate-400 w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Temps de lecture</span>
                                <span className="text-xs font-bold text-white uppercase tracking-widest">{article.readingTime || "6 MIN"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image Section */}
            <section className="-mt-32 md:-mt-48 relative z-20 pb-20 md:pb-32">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-secondary/20 border-8 border-white/5 backdrop-blur-xl relative aspect-[21/9]"
                    >
                        {article.imageUrl ? (
                            <img src={resolveImageUrl(article.imageUrl)} alt={article.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-100">
                                <Newspaper className="w-48 h-48" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/40 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </section>

            {/* Article Content Section */}
            <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Floating Social Sidebar - Desktop */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-32 flex flex-col gap-6">
                        <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleToggleSave}
                            disabled={isSaving}
                            className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                                isSaved ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-400 hover:bg-brand-primary/10"
                            )}
                        >
                            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="lg:col-span-11">
                    <div
                        className="prose prose-xl md:prose-2xl prose-slate max-w-none prose-p:text-slate-600 prose-p:font-medium prose-p:leading-[1.8] prose-p:mb-10 prose-headings:font-bold prose-headings:text-brand-secondary prose-headings:tracking-tight prose-headings:mb-10 prose-blockquote:border-l-4 prose-blockquote:border-brand-primary prose-blockquote:bg-brand-primary/5 prose-blockquote:rounded-r-3xl prose-blockquote:p-12 prose-blockquote:not-prose prose-blockquote:text-brand-secondary prose-blockquote:font-bold prose-blockquote:italic"
                        dangerouslySetInnerHTML={{ __html: article.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('') }}
                    />

                    {/* Interaction & Navigation Matrix */}
                    <div className="mt-32 pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex gap-4">
                            <Button variant="outline" className="rounded-2xl px-8 h-14 border-slate-200 text-brand-secondary font-bold text-xs uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all">
                                <Share2 className="w-4 h-4 mr-3" /> Partager
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleToggleSave}
                                disabled={isSaving}
                                className={cn(
                                    "rounded-2xl px-8 h-14 border-slate-200 font-bold text-xs uppercase tracking-widest transition-all",
                                    isSaved ? "bg-brand-primary text-white border-brand-primary" : "text-brand-secondary hover:border-brand-primary hover:text-brand-primary"
                                )}
                            >
                                <Bookmark className={cn("w-4 h-4 mr-3", isSaved && "fill-current")} />
                                {isSaved ? "Sauvegardé" : "Sauvegarder"}
                            </Button>
                        </div>

                        <Link to="/news">
                            <Button className="rounded-2xl px-12 h-14 bg-brand-primary text-white hover:bg-brand-secondary shadow-xl shadow-brand-primary/20 transition-all font-bold text-xs uppercase tracking-widest group">
                                Voir d'autres analyses <ChevronRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {/* Author Bio Section */}
                    <div className="mt-20 p-10 md:p-14 bg-slate-50 rounded-[3rem] flex flex-col md:flex-row gap-10 items-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Award className="w-10 h-10" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <h4 className="text-xl font-bold text-brand-secondary">À propos de l'auteur</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Expert en transition éthique et standards de labellisation, {article.author} analyse les dynamiques de l'économie sociale et solidaire au sein du réseau COOP_LOGIC.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </article>
    );
}

export default NewsArticlePage;
