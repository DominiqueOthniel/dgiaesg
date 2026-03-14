import { motion } from "framer-motion";
import { BookOpen, Lock, Search, Calendar, ArrowRight, Play, MapPin } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { resolveImageUrl } from "../lib/image";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useMagazines } from "../hooks/useMagazines";
import { TwoColumnPage } from "@/components/layout/TwoColumnPage";
import { SidebarStack } from "@/components/layout/SidebarStack";
import AdBanner from "../components/AdBanner";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../lib/utils";
import api from "../services/api";
import { useNews } from "../hooks/useNews";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useEvents } from "../hooks/useEvents";
import type { IMultimedia, PaginatedResponse } from "../types";

interface INewsletter {
    _id: string;
    title: { fr: string; en: string };
    summary: { fr: string; en: string };
    imageUrl: string;
    publishedAt: string | null;
}

function KioskPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const { data: reviews = [], isLoading } = useMagazines();
    const { data: relatedArticles } = useNews({ page: 1, limit: 3 });
    const { data: upcomingEvents } = useEvents({ published: true, limit: 2 });
    const { data: latestNewsletter } = useQuery({
        queryKey: ["latest-newsletter"],
        queryFn: async () => {
            const res = await api.get("/newsletter/latest");
            return res.data.data as INewsletter;
        },
    });
    const { data: relatedMedia } = useQuery<PaginatedResponse<IMultimedia>>({
        queryKey: ["kiosk-related-media"],
        queryFn: async () => {
            const response = await api.get("/multimedia", { params: { limit: 2, type: "video" } });
            return response.data;
        },
    });

    const filteredReviews = reviews.filter(
        (r) =>
            getLocalized(r.title, i18n.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
            new Date(r.publishDate)
                .toLocaleDateString(i18n.language, {
                    month: "long",
                    year: "numeric",
                })
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const handleOpenPdf = (pdfUrl: string) => {
        if (!isAuthenticated) {
            toast.error(t("kiosk.login_required", "Veuillez vous connecter pour accéder aux revues"));
            navigate("/login");
            return;
        }
        if (!user?.isPro) {
            toast.error(t("kiosk.pro_required", "Cet accès est réservé aux membres PRO"));
            navigate("/pricing");
            return;
        }
        window.open(pdfUrl, "_blank");
    };

    return (
        <TwoColumnPage
            title={t("kiosk.title", "Le Kiosque Digital")}
            subtitle={t("kiosk.subtitle", "Retrouvez toutes les éditions mensuelles de notre revue d'excellence. Analyses prospectives, rapports d'impact et actualités du réseau.")}
            headerMeta={t("kiosk.meta", "Archives & Revues Mensuelles")}
            children={{
                main: (
                    <>
                        {/* Search bar */}
                        <div className="mb-10">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t("kiosk.search_placeholder", "Rechercher une édition...")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface-base border border-surface-muted rounded-2xl py-4 pl-12 pr-6 text-brand-secondary text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Magazine grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-surface-base rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="py-24 text-center rounded-3xl border-2 border-dashed border-surface-muted bg-surface-base">
                                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                <h3 className="text-xl font-bold text-slate-400">{t("kiosk.empty", "Aucune revue trouvée")}</h3>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-brand-primary font-bold text-sm mt-4 hover:underline"
                                >
                                    {t("kiosk.reset_filters", "Réinitialiser les filtres")}
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {filteredReviews.map((review, idx) => (
                                    <motion.article
                                        key={review._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group"
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white border border-surface-muted shadow-lg hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 hover:-translate-y-2">
                                            {review.coverImageUrl ? (
                                                <img
                                                    src={resolveImageUrl(review.coverImageUrl)}
                                                    alt={getLocalized(review.title, i18n.language)}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-surface-base text-slate-300">
                                                    <BookOpen className="w-12 h-12" />
                                                </div>
                                            )}

                                            {/* PRO badge — always shown since PDFs are PRO-only */}
                                            <div className="absolute top-4 right-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-secondary/90 text-brand-accent text-[9px] font-black uppercase tracking-widest border border-brand-accent/40 shadow-lg">
                                                    <Lock className="w-3 h-3" /> PRO
                                                </span>
                                            </div>
                                            {review.featured && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 rounded-full bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest">
                                                        {t("kiosk.featured", "Édition Spéciale")}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(review.publishDate).toLocaleDateString(i18n.language, {
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                                <button
                                                    onClick={() => handleOpenPdf(review.pdfUrl)}
                                                    className="w-full py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-secondary transition-all border border-white/10"
                                                >
                                                    {isAuthenticated && user?.isPro
                                                        ? t("kiosk.download_pdf", "Télécharger le PDF")
                                                        : t("kiosk.unlock_pro", "Débloquer avec PRO")}
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="mt-5 text-lg font-serif font-bold text-brand-secondary group-hover:text-brand-primary transition-colors leading-snug">
                                            {getLocalized(review.title, i18n.language)}
                                        </h3>
                                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-2 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(review.publishDate).toLocaleDateString(i18n.language, {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </motion.article>
                                ))}
                            </div>
                        )}

                        {/* Related Articles */}
                        <section className="mt-16">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Related Articles</p>
                                    <h3 className="text-2xl font-bold text-brand-secondary mt-2">Analyses liées aux publications</h3>
                                </div>
                                <Link to="/news" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-secondary transition-colors">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                {relatedArticles?.data?.slice(0, 3).map((n: any) => (
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

                        {/* Related Multimedia */}
                        <section className="mt-16">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Watch Related Media</p>
                                    <h3 className="text-2xl font-bold text-brand-secondary mt-2">Interviews et analyses vidéo</h3>
                                </div>
                                <Link to="/multimedia" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-secondary transition-colors">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                {relatedMedia?.data?.slice(0, 2).map((item: any) => (
                                    <button
                                        key={item._id}
                                        onClick={() => window.open(item.embedUrl, "_blank")}
                                        className="group text-left rounded-2xl border border-surface-muted bg-white overflow-hidden hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all"
                                    >
                                        <div className="aspect-video bg-slate-50 relative overflow-hidden">
                                            {item.coverImageUrl ? (
                                                <img
                                                    src={resolveImageUrl(item.coverImageUrl)}
                                                    alt={getLocalized(item.title, i18n.language)}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Play className="w-10 h-10" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/30" />
                                        </div>
                                        <div className="p-6">
                                            <h4 className="text-lg font-bold text-brand-secondary group-hover:text-brand-primary transition-colors line-clamp-2">
                                                {getLocalized(item.title, i18n.language)}
                                            </h4>
                                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                                {getLocalized(item.description, i18n.language)}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </>
                ),
                sidebar: (
                    <SidebarStack>
                        {/* Upcoming Events */}
                        <section className="rounded-2xl border border-surface-muted bg-white p-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-4">Upcoming Events</h4>
                            <div className="space-y-4">
                                {(upcomingEvents || [])
                                    .slice()
                                    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                    .slice(0, 2)
                                    .map((event: any) => (
                                        <Link
                                            key={event._id}
                                            to={`/events/${event._id}`}
                                            className="block rounded-xl border border-surface-muted/60 p-4 hover:border-brand-primary/30 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                                {new Date(event.startDate).toLocaleDateString(i18n.language, {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            <p className="mt-2 text-sm font-bold text-brand-secondary line-clamp-2">{getLocalized(event.title, i18n.language)}</p>
                                            <p className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                                                {getLocalized(event.location, i18n.language)}
                                            </p>
                                        </Link>
                                    ))}
                            </div>
                        </section>

                        {/* Latest Newsletter */}
                        <section className="rounded-2xl bg-brand-secondary text-white p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-4">Latest Newsletter</p>
                            {latestNewsletter ? (
                                <div className="space-y-4">
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white/10">
                                        <img
                                            src={resolveImageUrl(latestNewsletter.imageUrl) || "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800"}
                                            alt={getLocalized(latestNewsletter.title, i18n.language)}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h5 className="text-lg font-bold">{getLocalized(latestNewsletter.title, i18n.language)}</h5>
                                    <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                                        {getLocalized(latestNewsletter.summary, i18n.language)}
                                    </p>
                                    <Link to={`/newsletter/${latestNewsletter._id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-accent">
                                        Lire la newsletter <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <h5 className="text-lg font-bold mb-2">Restez informé</h5>
                                    <p className="text-xs text-white/70 leading-relaxed">Recevez nos analyses et rapports exclusifs.</p>
                                </div>
                            )}
                        </section>

                        <AdBanner position="sidebar" />
                        <div className="p-8 bg-brand-secondary text-white rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <Lock className="w-8 h-8 text-brand-primary mb-6" />
                            <h4 className="text-lg font-bold mb-3">{t("kiosk.pro_cta_title", "Accès PRO requis")}</h4>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                {t("kiosk.pro_cta_desc", "Les éditions mensuelles et rapports PDF sont réservés aux membres PRO. Adhérez pour télécharger.")}
                            </p>
                            <Link to="/pricing" className="block">
                                <span className="inline-flex items-center gap-2 w-full justify-center py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-secondary transition-all">
                                    {t("kiosk.adhérer", "Adhérer")} <ArrowRight className="w-4 h-4" />
                                </span>
                            </Link>
                            <p className="mt-4 text-[9px] text-slate-500 text-center">
                                {t("kiosk.already_pro", "Déjà membre ?")}{" "}
                                <Link to="/login" className="text-brand-primary hover:text-white transition-colors underline">
                                    {t("kiosk.connect", "Connectez-vous")}
                                </Link>
                            </p>
                        </div>
                    </SidebarStack>
                ),
            }}
        />
    );
}

export default KioskPage;
