import { Newspaper, Calendar, MapPin, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useNews } from "../hooks/useNews";
import AdBanner from "../components/AdBanner";
import { TwoColumnPage } from "@/components/layout/TwoColumnPage";
import { SidebarStack } from "@/components/layout/SidebarStack";
import { useEvents } from "../hooks/useEvents";
import { useMagazines } from "../hooks/useMagazines";
import { resolveImageUrl } from "../lib/image";
import { getLocalized } from "../lib/utils";
import api from "../services/api";
import { toast } from "react-hot-toast";

function NewsPage() {
    const { t, i18n } = useTranslation();
    const [sectorFilter, setSectorFilter] = useState("all");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: newsData, isLoading } = useNews({
        page: 1,
        limit: 9,
        sector: sectorFilter === "all" ? undefined : sectorFilter,
    });
    const news = newsData?.data || [];

    const { data: eventsData } = useEvents({ published: true, limit: 2 });
    const events = eventsData || [];
    const { data: magazines = [] } = useMagazines();

    const { data: relatedMedia } = useQuery({
        queryKey: ["news-related-media"],
        queryFn: async () => {
            const res = await api.get("/multimedia?limit=2&published=true");
            return res.data.data || [];
        },
    });

    const { data: latestNewsletter } = useQuery({
        queryKey: ["latest-newsletter"],
        queryFn: async () => {
            const res = await api.get("/newsletter/latest");
            return res.data.data;
        },
    });

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setIsSubmitting(true);
        try {
            await api.post("/newsletter/subscribe", { email });
            toast.success("Merci ! Vous êtes inscrit à la newsletter.");
            setEmail("");
        } catch (error) {
            toast.error("Impossible d'inscrire cet email.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const sectors = [
        { id: "all", label: t("common.all", "Tous") },
        { id: "finance", label: t("sectors.finance") },
        { id: "governance", label: t("sectors.governance") },
        { id: "tech", label: t("sectors.tech") },
        { id: "energy", label: t("sectors.energy") },
        { id: "leadership", label: t("sectors.leadership") },
    ];

    const hasNoNews = !isLoading && news.length === 0;

    return (
        <TwoColumnPage
            title="Journal"
            subtitle="Analyses, décryptages et actualités ESG & finance en Afrique."
            headerMeta="Dernières publications"
            children={{
                main: isLoading ? (
                    <div className="space-y-4">
                        <div className="h-40 bg-slate-100 animate-pulse" />
                        <div className="h-40 bg-slate-100 animate-pulse" />
                        <div className="h-40 bg-slate-100 animate-pulse" />
                    </div>
                ) : hasNoNews ? (
                    <div className="py-32 text-center rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                            <Newspaper className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">Aucun article trouvé</h3>
                        <p className="text-sm text-slate-300 mt-2">
                            Le flux d'actualités est en cours de mise à jour.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <AdBanner position="top" className="mb-12" />
                        {news[0] && (
                            <section className="rounded-3xl overflow-hidden border border-surface-muted bg-white shadow-sm">
                                <Link to={`/news/${news[0].slug}`} className="block">
                                    <div className="relative aspect-[21/9] bg-slate-100">
                                        <img
                                            src={resolveImageUrl(news[0].imageUrl) || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400"}
                                            alt={getLocalized(news[0].title, i18n.language)}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent">
                                                {news[0].sector || "ACTUALITÉ"}
                                            </p>
                                            <h2 className="text-2xl md:text-4xl font-serif font-black text-white mt-3">
                                                {getLocalized(news[0].title, i18n.language)}
                                            </h2>
                                            <p className="text-sm text-white/70 mt-3 line-clamp-2 max-w-3xl">
                                                {getLocalized(news[0].excerpt, i18n.language) ||
                                                    getLocalized(news[0].content, i18n.language)
                                                        .replace(/<[^>]*>/g, "")
                                                        .slice(0, 160) + "..."}
                                            </p>
                                            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary mt-5">
                                                Lire l'article
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </section>
                        )}

                        <section className="border-b border-surface-muted pb-6">
                            <div className="flex flex-wrap gap-2">
                                {sectors.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setSectorFilter(s.id)}
                                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                                            sectorFilter === s.id
                                                ? "bg-brand-primary text-white border-brand-primary"
                                                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-brand-primary/30"
                                        }`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {news.slice(1).map((item) => (
                                    <Link
                                        key={item._id}
                                        to={`/news/${item.slug}`}
                                        className="group rounded-2xl border border-surface-muted bg-white overflow-hidden hover:shadow-xl hover:shadow-brand-primary/10 transition-all"
                                    >
                                        <div className="aspect-video bg-slate-100 overflow-hidden">
                                            <img
                                                src={resolveImageUrl(item.imageUrl)}
                                                alt={getLocalized(item.title, i18n.language)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary">
                                                {item.sector || "ACTUALITÉ"}
                                            </p>
                                            <h3 className="mt-3 text-lg font-serif font-bold text-brand-secondary group-hover:text-brand-primary transition-colors line-clamp-2">
                                                {getLocalized(item.title, i18n.language)}
                                            </h3>
                                            <p className="mt-3 text-sm text-text-muted leading-relaxed line-clamp-3">
                                                {getLocalized(item.excerpt, i18n.language) ||
                                                    getLocalized(item.content, i18n.language)
                                                        .replace(/<[^>]*>/g, "")
                                                        .slice(0, 140) + "..."}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section className="mt-12 rounded-3xl border border-surface-muted bg-white p-8 md:p-10">
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">
                                        Stay Updated
                                    </p>
                                    <h3 className="text-2xl font-bold text-brand-secondary mt-3">
                                        Abonnez-vous à la newsletter
                                    </h3>
                                    <p className="text-sm text-text-muted mt-3">
                                        Recevez les insights, annonces et analyses directement dans votre boîte mail.
                                    </p>
                                    {latestNewsletter && (
                                        <Link
                                            to={`/newsletter/${latestNewsletter._id}`}
                                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary mt-4"
                                        >
                                            Lire la dernière newsletter
                                        </Link>
                                    )}
                                </div>
                                <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Votre email"
                                        className="w-full sm:w-72 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-secondary transition-colors"
                                    >
                                        {isSubmitting ? "Envoi..." : "S'abonner"}
                                    </button>
                                </form>
                            </div>
                        </section>
                    </div>
                ),
                sidebar: (
                    <SidebarStack>
                        <section className="rounded-2xl border border-surface-muted bg-white p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Related Media</h3>
                                <Link to="/multimedia" className="text-[9px] font-bold uppercase tracking-widest text-text-muted hover:text-brand-primary">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {(relatedMedia || []).slice(0, 2).map((item: any) => (
                                    <a
                                        key={item._id}
                                        href={item.embedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex gap-4 items-center group"
                                    >
                                        <div className="w-16 h-12 bg-slate-100 overflow-hidden">
                                            <img
                                                src={resolveImageUrl(item.coverImageUrl)}
                                                alt={getLocalized(item.title, i18n.language)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-brand-primary">
                                                {item.type}
                                            </p>
                                            <p className="text-sm font-bold text-brand-secondary line-clamp-2 group-hover:text-brand-primary transition-colors">
                                                {getLocalized(item.title, i18n.language)}
                                            </p>
                                        </div>
                                        <Play className="w-4 h-4 text-brand-primary" />
                                    </a>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-surface-muted bg-white p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Publications</h3>
                                <Link to="/kiosk" className="text-[9px] font-bold uppercase tracking-widest text-text-muted hover:text-brand-primary">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {magazines.slice(0, 2).map((mag) => (
                                    <a
                                        key={mag._id}
                                        href={mag.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex gap-4 items-center group"
                                    >
                                        <div className="w-12 h-16 bg-slate-100 overflow-hidden border border-surface-muted">
                                            <img
                                                src={resolveImageUrl(mag.coverImageUrl)}
                                                alt={getLocalized(mag.title, i18n.language)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
                                                {new Date(mag.publishDate).toLocaleDateString(i18n.language, {
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <p className="text-sm font-bold text-brand-secondary line-clamp-2 group-hover:text-brand-primary transition-colors">
                                                {getLocalized(mag.title, i18n.language)}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-surface-muted bg-white p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Upcoming Events</h3>
                                <Link to="/events" className="text-[9px] font-bold uppercase tracking-widest text-text-muted hover:text-brand-primary">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {events.slice(0, 2).map((ev) => (
                                    <Link key={ev._id} to={`/events/${ev._id}`} className="block group">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                            {new Date(ev.startDate).toLocaleDateString(i18n.language, {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                            <span className="flex items-center gap-1 text-[8px]">
                                                <MapPin className="w-3 h-3" /> {getLocalized(ev.location, i18n.language)}
                                            </span>
                                        </p>
                                        <p className="text-sm font-bold text-brand-secondary line-clamp-2 group-hover:text-brand-primary transition-colors">
                                            {getLocalized(ev.title, i18n.language)}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <AdBanner position="sidebar" />
                    </SidebarStack>
                ),
            }}
        />
    );
}

export default NewsPage;

