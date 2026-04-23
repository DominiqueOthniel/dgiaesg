import { useParams } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNews } from "../hooks/useNews";
import { useState, useEffect } from "react";
import { cn, getLocalized } from "../lib/utils";
import { TwoColumnPage } from "@/components/layout/TwoColumnPage";
import { ArticleListSection } from "@/components/articles/ArticleListSection";
import { SidebarStack } from "@/components/layout/SidebarStack";

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
    const { i18n } = useTranslation();
    const { sector = "finance" } = useParams<{ sector: string }>();
    const [page, setPage] = useState(1);
    const meta = SECTOR_METADATA[sector] || SECTOR_METADATA.finance;

    const { data: newsData, isLoading, refetch } = useNews({
        page,
        limit: 9,
        sector: sector
    });

    const news = newsData?.data || [];

    useEffect(() => {
        setPage(1);
    }, [sector]);

    const hasNoNews = !isLoading && news.length === 0;

    return (
        <TwoColumnPage
            title={meta.title}
            subtitle={meta.desc}
            headerMeta={`Hub sectoriel : ${sector.toUpperCase()}`}
            className={cn("bg-background min-h-screen")}
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
                        <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">
                            Flux vierge
                        </h3>
                        <p className="text-sm font-bold text-slate-300 mt-2 uppercase">
                            Aucune dépêche disponible dans ce secteur pour le moment.
                        </p>
                    </div>
                ) : (
                    <ArticleListSection
                        title="Dernières dépêches"
                        articles={news.map((item: any) => ({
                            slug: item.slug,
                            title: getLocalized(item.title, i18n.language),
                            excerpt:
                                getLocalized(item.excerpt, i18n.language) ||
                                getLocalized(item.content, i18n.language)
                                    .replace(/<[^>]*>/g, "")
                                    .slice(0, 150) + "...",
                            imageUrl: item.imageUrl,
                            sector,
                            premium: item.premium,
                            dateLabel: item.publishedAt
                                ? new Date(item.publishedAt).toLocaleDateString(i18n.language, {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                  })
                                : undefined,
                        }))}
                    />
                ),
                sidebar: (
                    <SidebarStack>
                        {/* simple contextual sidebar */}
                        <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                            <h4 className="text-xs font-black text-brand-secondary uppercase tracking-widest mb-4">
                                En direct : {sector}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Suivez les dernières tendances et analyses décryptées par nos experts du secteur {sector}.
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="mt-4 w-full h-9 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.16em] hover:brightness-110 transition-all"
                            >
                                Actualiser
                            </button>
                        </div>
                    </SidebarStack>
                ),
            }}
        />
    );
}

export default SectorPage;
