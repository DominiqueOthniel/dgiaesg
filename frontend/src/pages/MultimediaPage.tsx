import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Play, Mic, Filter, PlayCircle, Clock, Tag, ArrowRight, Calendar, MapPin } from "lucide-react";
import api from "../services/api";
import type { IMultimedia, PaginatedResponse } from "../types";
import { resolveImageUrl } from "../lib/image";
import { Badge } from "../components/ui/Badge";
import { cn, getLocalized } from "../lib/utils";
import { TwoColumnPage } from "@/components/layout/TwoColumnPage";
import { SidebarStack } from "@/components/layout/SidebarStack";
import { MultimediaSidebar } from "@/components/MultimediaSidebar";
import AdBanner from "@/components/AdBanner";
import { useNews } from "../hooks/useNews";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useEvents } from "../hooks/useEvents";

interface INewsletter {
    _id: string;
    title: { fr: string; en: string };
    summary: { fr: string; en: string };
    imageUrl: string;
    publishedAt: string | null;
}

const MultimediaPage = () => {
    const { i18n } = useTranslation();
    const [page, setPage] = useState(1);
    const [type, setType] = useState<string>("all");
    const [sector, setSector] = useState<string>("all");

    const { data, isLoading } = useQuery<PaginatedResponse<IMultimedia>>({
        queryKey: ["multimedia", page, type, sector],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "12",
            });
            if (type !== "all") params.append("type", type);
            if (sector !== "all") params.append("sector", sector);

            const response = await api.get(`/multimedia?${params.toString()}`);
            return response.data;
        },
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const items = data?.data || [];
    const { data: latestNews } = useNews({ page: 1, limit: 4, sector: sector !== "all" ? sector : undefined });
    const { data: upcomingEvents } = useEvents({ published: true, limit: 2 });
    const { data: latestNewsletter } = useQuery({
        queryKey: ["latest-newsletter"],
        queryFn: async () => {
            const res = await api.get("/newsletter/latest");
            return res.data.data as INewsletter;
        },
    });
    const sectors = [
        { value: 'finance', label: 'Finance' },
        { value: 'tech', label: 'Technologie' },
        { value: 'energy', label: 'Énergie' },
        { value: 'governance', label: 'Gouvernance' },
        { value: 'leadership', label: 'Leadership' }
    ];

    return (
        <TwoColumnPage
            title="Espace Médiatique"
            subtitle="Retrouvez nos analyses vidéo, interviews exclusives et podcasts sur les enjeux de la durabilité et de la RSE en Afrique."
            headerMeta="FA TV & Podcasts"
            children={{
                main: (
                    <>
                        {/* Filters */}
                        <section className="mb-10">
                            <div className="bg-white rounded-3xl shadow-xl p-4 border border-slate-100">
                                <div className="flex flex-col lg:flex-row gap-6 items-center">
                                    <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl w-fit">
                                        <button
                                            onClick={() => { setType("all"); setPage(1); }}
                                            className={cn(
                                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                type === "all" ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                            )}
                                        >
                                            Tous
                                        </button>
                                        <button
                                            onClick={() => { setType("video"); setPage(1); }}
                                            className={cn(
                                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                                type === "video" ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                            )}
                                        >
                                            <Play className="w-3 h-3" /> Vidéos
                                        </button>
                                        <button
                                            onClick={() => { setType("audio"); setPage(1); }}
                                            className={cn(
                                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                                type === "audio" ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                            )}
                                        >
                                            <Mic className="w-3 h-3" /> Podcasts
                                        </button>
                                    </div>

                                    <div className="flex-1 flex items-center gap-4 px-6 border-l border-slate-100">
                                        <Filter className="w-4 h-4 text-brand-primary" />
                                        <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-2">
                                            <button
                                                onClick={() => { setSector("all"); setPage(1); }}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                                    sector === "all" ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                                )}
                                            >
                                                Tous les secteurs
                                            </button>
                                            {sectors.map(s => (
                                                <button
                                                    key={s.value}
                                                    onClick={() => { setSector(s.value); setPage(1); }}
                                                    className={cn(
                                                        "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                                        sector === s.value ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                                    )}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Media Grid */}
                        <section>
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="aspect-video bg-slate-50 rounded-[2rem] animate-pulse" />
                                    ))}
                                </div>
                            ) : items.length === 0 ? (
                                <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50">
                                    <PlayCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                    <h3 className="text-xl font-bold text-slate-400">Aucun contenu trouvé</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                        >
                                            <div className="relative aspect-video overflow-hidden bg-slate-100">
                                                <img
                                                    src={resolveImageUrl(item.coverImageUrl) || (item.type === "video" ? "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800" : "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800")}
                                                    alt={getLocalized(item.title, i18n.language)}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <button
                                                        onClick={() => window.open(item.embedUrl, "_blank")}
                                                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300"
                                                    >
                                                        {item.type === "video" ? (
                                                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                                                        ) : (
                                                            <Mic className="w-6 h-6 text-white" />
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="absolute top-6 left-6">
                                                    <Badge className="rounded-full px-4 py-1.5 bg-brand-accent text-white border-none font-black text-[9px] uppercase tracking-widest shadow-lg">
                                                        {item.type === "video" ? "FA TV" : "PODCAST"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                                    <span className="flex items-center gap-2">
                                                        <Tag className="w-3.5 h-3.5 text-brand-primary" />
                                                        {item.sector}
                                                    </span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="flex items-center gap-2 text-slate-900">
                                                        <Clock className="w-3.5 h-3.5" /> 8 MIN
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-brand-secondary mb-6 line-clamp-2 min-h-[3.5rem] group-hover:text-brand-primary transition-colors">
                                                    {getLocalized(item.title, i18n.language)}
                                                </h3>
                                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8">
                                                    {getLocalized(item.description, i18n.language)}
                                                </p>
                                                <button
                                                    onClick={() => window.open(item.embedUrl, "_blank")}
                                                    className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest group/btn"
                                                >
                                                    Consulter le contenu <ArrowRight className="w-4 h-4 group-btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Related Articles */}
                        <section className="mt-16">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Related Articles</p>
                                    <h3 className="text-2xl font-bold text-brand-secondary mt-2">Analyses à lire après vos vidéos</h3>
                                </div>
                                <Link to="/news" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-secondary transition-colors">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                {latestNews?.data?.slice(0, 3).map((n: any) => (
                                    <ArticleCard
                                        key={n._id}
                                        variant="list"
                                        slug={n.slug}
                                        title={getLocalized(n.title, i18n.language)}
                                        excerpt={getLocalized(n.excerpt, i18n.language)}
                                        imageUrl={n.imageUrl}
                                        sector={n.sector}
                                        premium={n.premium}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Upcoming Events */}
                        <section className="mt-16">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Upcoming Events</p>
                                    <h3 className="text-2xl font-bold text-brand-secondary mt-2">Prochains rendez-vous</h3>
                                </div>
                                <Link to="/events" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-secondary transition-colors">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                {(upcomingEvents || [])
                                    .slice()
                                    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                    .slice(0, 2)
                                    .map((event: any) => (
                                        <Link
                                            key={event._id}
                                            to={`/events/${event._id}`}
                                            className="group rounded-2xl border border-slate-100 bg-white p-6 hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all"
                                        >
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <Calendar className="w-4 h-4 text-brand-primary" />
                                                {new Date(event.startDate).toLocaleDateString(i18n.language, {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            <h4 className="mt-3 text-lg font-bold text-brand-secondary group-hover:text-brand-primary transition-colors line-clamp-2">
                                                {getLocalized(event.title, i18n.language)}
                                            </h4>
                                            <p className="mt-2 text-sm text-slate-500 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-brand-primary" />
                                                {getLocalized(event.location, i18n.language)}
                                            </p>
                                            <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                                                Voir l'événement <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </Link>
                                    ))}
                            </div>
                        </section>

                        {/* Newsletter */}
                        <section className="mt-16">
                            <div className="rounded-3xl bg-brand-secondary text-white p-8 md:p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-4">Latest Newsletter</p>
                                {latestNewsletter ? (
                                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        <div className="w-full md:w-40 aspect-[4/3] rounded-2xl overflow-hidden bg-white/10">
                                            <img
                                                src={resolveImageUrl(latestNewsletter.imageUrl) || "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800"}
                                                alt={getLocalized(latestNewsletter.title, i18n.language)}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold mb-2">
                                                {getLocalized(latestNewsletter.title, i18n.language)}
                                            </h4>
                                            <p className="text-sm text-white/70 leading-relaxed">
                                                {getLocalized(latestNewsletter.summary, i18n.language)}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/newsletter/${latestNewsletter._id}`}
                                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-accent"
                                        >
                                            Lire la newsletter <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 className="text-xl font-bold mb-3">Restez informé</h4>
                                        <p className="text-sm text-white/70 leading-relaxed">
                                            Recevez nos analyses multimédias et les dernières informations sur la certification.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                ),
                sidebar: (
                    <SidebarStack>
                        <MultimediaSidebar />
                        <AdBanner position="sidebar" />
                        {/* Recent articles related to media */}
                        {latestNews && latestNews.data && (
                            <section className="mt-6 border-t border-surface-muted pt-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-4">
                                    Derniers articles
                                </h3>
                                <div className="space-y-3">
                                    {latestNews.data.slice(0, 3).map((n: any) => (
                                        <ArticleCard
                                            key={n._id}
                                            variant="compact"
                                            slug={n.slug}
                                            title={getLocalized(n.title, i18n.language)}
                                            sector={n.sector}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </SidebarStack>
                ),
            }}
        />
    );
};

export default MultimediaPage;
