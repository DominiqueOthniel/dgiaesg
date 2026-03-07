import { motion } from "framer-motion";
import { Newspaper, Calendar, ArrowRight, Share2, Bookmark, Zap } from "lucide-react";
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
import { ReviewKiosk } from "../components/ReviewKiosk";
import { MultimediaSidebar } from "../components/MultimediaSidebar";

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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Feed */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
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
                                                            <Badge className="rounded-full px-4 py-1.5 bg-brand-primary text-white border-none font-black text-[9px] uppercase tracking-widest shadow-lg italic">
                                                                {item.sector || 'ACTUALITÉ'}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <CardContent className="p-8 md:p-10 flex flex-col flex-1">
                                                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">
                                                            <span className="flex items-center gap-2">
                                                                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                                                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : "RÉCENT"}
                                                            </span>
                                                            <div className="w-1 h-1 rounded-full bg-brand-primary" />
                                                            <span className="text-slate-900 font-black">
                                                                {item.readingTime || "3 MIN"} READ
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

                            {/* Pagination Interface */}
                            {pagination && pagination.pages > 1 && (
                                <div className="mt-24 flex items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="rounded-xl px-6 border-slate-200 text-brand-secondary font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Précédent
                                    </Button>
                                    <div className="flex gap-2">
                                        {Array.from({ length: pagination.pages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i + 1)}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl font-black text-[10px] transition-all",
                                                    page === i + 1 ? "bg-brand-secondary text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        disabled={page === pagination.pages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="rounded-xl px-6 border-slate-200 text-brand-secondary font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Suivant
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-12">
                            {/* Premium Analysis Widget */}
                            <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/30 transition-colors" />
                                <Zap className="w-8 h-8 text-brand-accent mb-8" />
                                <h4 className="text-xl font-bold mb-4">Analyses Premium</h4>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">Accédez à nos rapports trimestriels détaillés sur l'état de la coopération en Afrique.</p>
                                <Link to="/kiosk" className="w-full">
                                    <Button
                                        className="w-full rounded-2xl bg-white text-slate-900 hover:bg-brand-accent hover:text-white transition-all font-black text-[10px] uppercase tracking-widest h-14"
                                    >
                                        Découvrir les Rapports
                                    </Button>
                                </Link>
                            </div>

                            {/* FA TV & Podcast */}
                            <div id="multimedia">
                                <MultimediaSidebar />
                            </div>

                            {/* Digital Review Kiosk Sidebar Toggle/View */}
                            <div id="reports" className="space-y-4">
                                <ReviewKiosk />
                                <Link to="/kiosk" className="flex items-center justify-center gap-3 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] py-5 border-2 border-brand-primary/10 bg-brand-primary/5 rounded-2xl hover:bg-brand-primary hover:text-white transition-all italic shadow-sm group">
                                    Voir tout le kiosque <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Trending Topics / Sectors */}
                            <div className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50">
                                <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-8 italic">Thématiques Clés</h4>
                                <div className="flex flex-wrap gap-3">
                                    {['Governance', 'Environment', 'Social Impact', 'Agro-Business', 'Financial Inclusion'].map(tag => (
                                        <Link key={tag} to={`/news?search=${tag}`}>
                                            <span className="px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[10px] font-bold text-slate-500 hover:border-brand-primary hover:text-brand-primary transition-all cursor-pointer shadow-sm">
                                                {tag}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default NewsPage;
