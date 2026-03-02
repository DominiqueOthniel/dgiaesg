import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper, ChevronRight, Calendar, ArrowRight, Share2, Bookmark, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "../hooks/useNews";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";
import { useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { ReviewKiosk } from "../components/ReviewKiosk";

const SECTOR_METADATA: Record<string, { title: string; desc: string; color: string }> = {
    finance: {
        title: "ESG & FINANCE DURABLE",
        desc: "L'actualité des marchés financiers, des investissements à impact et de la réglementation ESG en Afrique.",
        color: "from-emerald-600 to-teal-800"
    },
    governance: {
        title: "RSE & GOUVERNANCE",
        desc: "Transparence, éthique des affaires et responsabilité sociétale des entreprises sur le continent.",
        color: "from-blue-700 to-indigo-900"
    },
    tech: {
        title: "TECH & INNOVATION DURABLE",
        desc: "Solutions technologiques, GreenTech et transformation numérique responsable en Afrique.",
        color: "from-cyan-600 to-blue-800"
    },
    energy: {
        title: "ÉNERGIE & TRANSITION",
        desc: "Énergies renouvelables, décarbonation et grands projets d'infrastructure durable.",
        color: "from-amber-600 to-orange-800"
    },
    leadership: {
        title: "LEADERSHIP & IMPACT",
        desc: "Portraits de leaders, interviews exclusives et visions pour une Afrique durable.",
        color: "from-purple-700 to-violet-900"
    }
};

function SectorPage() {
    const { sector = "finance" } = useParams<{ sector: string }>();
    const [page, setPage] = useState(1);
    const meta = SECTOR_METADATA[sector] || SECTOR_METADATA.finance;

    const { data: newsData, isLoading, refetch } = useNews({
        page,
        limit: 9,
        sector: sector
    });

    const news = newsData?.data || [];
    const pagination = newsData?.pagination;
    const queryClient = useQueryClient();

    useEffect(() => {
        setPage(1);
        refetch();
    }, [sector, refetch]);

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
            {/* Dynamic Sector Hero */}
            <section className={cn("relative pt-32 pb-48 md:pb-64 overflow-hidden bg-gradient-to-br", meta.color)}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-12 backdrop-blur-sm"
                        >
                            <Zap className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                            Hub Sectoriel : {sector.toUpperCase()}
                        </motion.div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-10 leading-[0.9] uppercase italic">
                            {meta.title}
                        </h1>
                        <p className="text-xl text-white/80 font-medium leading-relaxed max-w-2xl border-l-4 border-brand-accent pl-8">
                            {meta.desc}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Stream */}
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
                                        <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">Flux Vierge</h3>
                                        <p className="text-sm font-bold text-slate-300 mt-2 uppercase">Aucune dépêche disponible dans ce secteur pour le moment.</p>
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
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                        <div className="absolute top-6 left-6">
                                                            <Badge className="rounded-full px-4 py-1.5 bg-brand-primary text-white border-none font-black text-[9px] uppercase tracking-widest shadow-lg italic">
                                                                {sector}
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

                                                        <h3 className="text-2xl font-black text-brand-secondary mb-6 leading-tight group-hover:text-brand-primary transition-colors uppercase tracking-tighter italic">
                                                            {item?.title}
                                                        </h3>

                                                        <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 mb-8">
                                                            {item?.excerpt || (item?.content ? item.content.substring(0, 150).replace(/<[^>]*>/g, '') + "..." : "Consultez l'intégralité de cet article pour découvrir les détails de cette actualité.")}
                                                        </p>

                                                        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                                            <span className="inline-flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] group-hover:gap-4 transition-all italic">
                                                                Dépêche complète <ArrowRight className="w-4 h-4" />
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
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-12">
                            <div className="sticky top-32">
                                <ReviewKiosk />

                                <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                    <h4 className="text-sm font-black text-brand-secondary uppercase tracking-widest mb-6 italic uppercase">En Direct : {sector}</h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic uppercase tracking-wider">
                                        Suivez les dernières tendances et analyses décryptées par nos experts du secteur {sector}.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="rounded-2xl px-10 h-16 border-2 border-slate-200 text-brand-secondary font-black text-xs uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary disabled:opacity-20 transition-all italic"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180 mr-3" /> Précédent
                            </Button>

                            <Button
                                variant="outline"
                                disabled={page === pagination.pages}
                                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="rounded-2xl px-10 h-16 border-2 border-slate-200 text-brand-secondary font-black text-xs uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary disabled:opacity-20 transition-all italic"
                            >
                                Suivant <ChevronRight className="w-4 h-4 ml-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default SectorPage;
