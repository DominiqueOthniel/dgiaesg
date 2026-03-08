import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Link, Navigate } from "react-router-dom";
import { Calendar, ArrowRight, Bookmark, Trash2, Library } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveImageUrl } from "../lib/image";
import { toast } from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { cn } from "../lib/utils";

function SavedArticles() {
    const { isAuthenticated, isLoading: authLoading, updateSavedArticles, updateSavedLabels } = useAuth();
    const [activeTab, setActiveTab] = useState<'articles' | 'labels'>('articles');

    const { data: savedItems, isLoading, refetch } = useQuery({
        queryKey: ["savedItems"],
        queryFn: async () => {
            const response = await api.get("/users/saved-items");
            return response.data.data;
        },
        enabled: isAuthenticated
    });

    if (authLoading) return null;
    if (!isAuthenticated) return <Navigate to="/login" />;

    const articles = savedItems?.articles || [];
    const labels = savedItems?.labels || [];

    const handleRemoveArticle = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await api.post('/users/save-article', { articleId: id });
            if (response.data.success) {
                updateSavedArticles(response.data.data);
                refetch();
                toast.success("Article retiré de votre bibliothèque");
            }
        } catch (error) {
            toast.error("Une erreur est survenue.");
        }
    };

    const handleRemoveLabel = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await api.post('/users/save-label', { labelId: id });
            if (response.data.success) {
                updateSavedLabels(response.data.data);
                refetch();
                toast.success("Protocole retiré de votre bibliothèque");
            }
        } catch (error) {
            toast.error("Une erreur est survenue.");
        }
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-32">
            <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 italic">
                            <Library className="w-3.5 h-3.5" /> Ma Bibliothèque Portal
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-brand-secondary leading-[0.9] uppercase italic">
                            Ma <span className="text-brand-primary">Bibliothèque</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium mt-8 border-l-4 border-brand-primary pl-8 max-w-2xl">
                            Retrouvez ici toutes vos analyses, enquêtes et protocoles favoris pour une consultation ultérieure.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                        <div className="text-right">
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Archivé</span>
                            <span className="text-2xl font-black text-brand-secondary italic">{articles.length + labels.length} ITEMS</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/30">
                            <Bookmark className="w-5 h-5 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mt-16 pb-2 border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={cn(
                            "px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative italic",
                            activeTab === 'articles' ? "text-brand-primary" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Journal ({articles.length})
                        {activeTab === 'articles' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('labels')}
                        className={cn(
                            "px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative italic",
                            activeTab === 'labels' ? "text-brand-primary" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Protocoles ({labels.length})
                        {activeTab === 'labels' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary" />}
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-slate-50 h-96 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : activeTab === 'articles' ? (
                    articles.length === 0 ? (
                        <EmptyState message="Vous n'avez pas encore sauvegardé d'articles." link="/news" label="Parcourir les actualités" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {articles.map((item: any) => (
                                    <SavedArticleCard key={item._id} item={item} onRemove={handleRemoveArticle} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                ) : (
                    labels.length === 0 ? (
                        <EmptyState message="Vous n'avez pas encore sauvegardé de protocoles." link="/labels" label="Parcourir les labels" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {labels.map((item: any) => (
                                    <SavedLabelCard key={item._id} item={item} onRemove={handleRemoveLabel} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                )}
            </main>
        </div>
    );
}

function EmptyState({ message, link, label }: { message: string, link: string, label: string }) {
    return (
        <div className="py-32 text-center rounded-[4rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl mb-10">
                <Bookmark className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest italic">Bibliothèque Vide</h3>
            <p className="text-slate-400 mt-4 max-w-sm font-medium">{message}</p>
            <Link to={link} className="mt-12">
                <Button className="rounded-2xl px-12 h-14 bg-brand-primary text-white hover:bg-brand-secondary transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20">
                    {label}
                </Button>
            </Link>
        </div>
    );
}

function SavedArticleCard({ item, onRemove }: { item: any, onRemove: (id: string, e: React.MouseEvent) => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="group"
        >
            <Link to={`/news/${item.slug}`} className="block h-full relative">
                <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 overflow-hidden flex flex-col h-full bg-white group-hover:-translate-y-2">
                    <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={resolveImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <button
                            onClick={(e) => onRemove(item._id, e)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all z-20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute top-6 left-6">
                            <Badge className="rounded-full px-4 py-1.5 bg-brand-primary text-white border-none font-black text-[9px] uppercase tracking-widest shadow-lg italic">
                                {item.sector || 'ESG'}
                            </Badge>
                        </div>
                    </div>
                    <CardContent className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">
                            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : "RECENT"}
                        </div>
                        <h3 className="text-xl font-black text-brand-secondary mb-4 leading-tight group-hover:text-brand-primary transition-colors uppercase italic tracking-tighter line-clamp-2">
                            {item.title}
                        </h3>
                        <div className="mt-auto pt-6 border-t border-slate-50">
                            <span className="inline-flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] group-hover:gap-4 transition-all italic">
                                Relire l'article <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

function SavedLabelCard({ item, onRemove }: { item: any, onRemove: (id: string, e: React.MouseEvent) => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="group"
        >
            <Link to={`/labels/${item._id}`} className="block h-full relative">
                <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 overflow-hidden flex flex-col h-full bg-white group-hover:-translate-y-2">
                    <div className="relative aspect-[16/10] bg-brand-secondary overflow-hidden flex items-center justify-center p-12">
                        {item.logoUrl ? (
                            <img src={resolveImageUrl(item.logoUrl)} alt={item.name} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <Library className="w-20 h-20 text-white/10" />
                        )}
                        <button
                            onClick={(e) => onRemove(item._id, e)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all z-20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <CardContent className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge className="rounded-full px-3 py-1 bg-brand-primary/10 text-brand-primary border-none font-bold text-[8px] uppercase tracking-widest">
                                {item.sector}
                            </Badge>
                        </div>
                        <h3 className="text-xl font-black text-brand-secondary mb-4 leading-tight group-hover:text-brand-primary transition-colors uppercase italic tracking-tighter">
                            {item.name}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6">
                            {item.description}
                        </p>
                        <div className="mt-auto pt-6 border-t border-slate-50">
                            <span className="inline-flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] group-hover:gap-4 transition-all italic">
                                Voir le protocole <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

export default SavedArticles;
