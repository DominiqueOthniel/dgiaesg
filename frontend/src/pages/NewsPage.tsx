import { motion } from "framer-motion";
import { Newspaper, ChevronRight, Calendar, User, ArrowRight, Share2, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "../hooks/useNews";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { useState } from "react";
import { cn } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";
import { useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

function NewsPage() {
    const [page, setPage] = useState(1);
    const { data: newsData, isLoading } = useNews({ page, limit: 9 });
    const news = newsData?.data || [];
    const pagination = newsData?.pagination;
    const queryClient = useQueryClient();

    const prefetchArticle = (slug: string) => {
        queryClient.prefetchQuery({
            queryKey: ["news", "slug", slug],
            queryFn: async () => {
                const response = await api.get(`/news/slug/${slug}`);
                return response.data.data;
            },
            staleTime: 1000 * 60 * 5,
        });
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Editorial Hero Header */}
            <section className="bg-brand-secondary pt-32 pb-48 md:pb-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-12"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                            Journal d'Impact & Actualités
                        </motion.div>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-10 leading-[0.9]">
                            Éclairer la <br /> <span className="text-brand-primary">Transition éthique.</span>
                        </h1>
                        <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
                            Analyses de fond, actualités du réseau et archives de certification. Suivez l'évolution des standards de la coopération éthique.
                        </p>
                    </div>
                </div>
            </section>

            {/* Editorial Stream Grid */}
            <section className="-mt-24 md:-mt-32 relative z-20 pb-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-slate-50 aspect-[4/5] rounded-[2.5rem] animate-pulse shadow-sm" />
                            ))
                        ) : news.length === 0 ? (
                            <div className="col-span-full py-48 text-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-8">
                                    <Newspaper className="w-8 h-8 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400">Aucun article trouvé</h3>
                                <p className="text-sm text-slate-300 mt-2">Le flux d'actualités est en cours de mise à jour.</p>
                            </div>
                        ) : (
                            news.map((item, idx) => (
                                <motion.article
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group"
                                    onMouseEnter={() => prefetchArticle(item.slug)}
                                >
                                    <Link to={`/news/${item.slug}`} className="block h-full">
                                        <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 overflow-hidden flex flex-col h-full bg-white group-hover:-translate-y-2">
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                {item.imageUrl ? (
                                                    <img src={resolveImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                        <Newspaper className="w-16 h-16" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                <div className="absolute top-6 left-6">
                                                    <Badge className="rounded-full px-4 py-1 bg-white/90 backdrop-blur-md text-brand-secondary border-none font-bold text-[9px] uppercase tracking-widest shadow-lg">
                                                        Actualité
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardContent className="p-8 md:p-10 flex flex-col flex-1">
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : "RECENT"}
                                                    </span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5" />
                                                        {(item?.author || "Auteur").toUpperCase()}
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl font-bold text-brand-secondary mb-6 leading-tight group-hover:text-brand-primary transition-colors">
                                                    {item?.title}
                                                </h3>

                                                <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 mb-8">
                                                    {item?.excerpt || (item?.content ? item.content.substring(0, 150).replace(/<[^>]*>/g, '') + "..." : "Consultez l'intégralité de cet article pour découvrir les détails de cette actualité.")}
                                                </p>

                                                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                                    <span className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest group-hover:gap-4 transition-all">
                                                        Lire l'article <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <button className="p-2 rounded-full hover:bg-slate-50 transition-colors">
                                                            <Share2 className="w-4 h-4 text-slate-300" />
                                                        </button>
                                                        <button className="p-2 rounded-full hover:bg-slate-50 transition-colors">
                                                            <Bookmark className="w-4 h-4 text-slate-300" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.article>
                            ))
                        )}
                    </div>

                    {/* Editorial Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="rounded-2xl px-8 h-14 border-slate-200 text-brand-secondary font-bold text-xs uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary disabled:opacity-20"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180 mr-3" /> Page Précédente
                            </Button>

                            <div className="flex items-center gap-3">
                                {Array.from({ length: pagination.pages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className={cn(
                                            "w-12 h-12 rounded-2xl font-bold text-xs transition-all",
                                            page === i + 1
                                                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                disabled={page === pagination.pages}
                                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="rounded-2xl px-8 h-14 border-slate-200 text-brand-secondary font-bold text-xs uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary disabled:opacity-20"
                            >
                                Page Suivante <ChevronRight className="w-4 h-4 ml-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default NewsPage;
