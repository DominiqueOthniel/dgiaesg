import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Mic, Filter, PlayCircle, Clock, Tag, ArrowRight } from "lucide-react";
import api from "../services/api";
import type { IMultimedia, PaginatedResponse } from "../types";
import { resolveImageUrl } from "../lib/image";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

const MultimediaPage = () => {
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

    const items = data?.data || [];
    const sectors = ["finance", "governance", "tech", "energy", "leadership"];

    return (
        <div className="bg-white min-h-screen">
            {/* Elegant Header */}
            <section className="bg-brand-secondary pt-24 pb-32 md:pb-40 relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        Espace <span className="text-brand-accent">Médiatique</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-300 font-medium max-w-2xl mx-auto"
                    >
                        Retrouvez nos analyses vidéo, interviews exclusives et podcasts sur les enjeux de la durabilité et de la RSE en Afrique.
                    </motion.p>
                </div>
            </section>

            {/* Filters */}
            <section className="-mt-12 relative z-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                                            key={s}
                                            onClick={() => { setSector(s); setPage(1); }}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                                sector === s ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Media Grid */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                                    <div className="relative aspect-video overflow-hidden">
                                        {item.coverImageUrl ? (
                                            <img
                                                src={resolveImageUrl(item.coverImageUrl)}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                <Play className="w-12 h-12 text-white/20" />
                                            </div>
                                        )}
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
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8">
                                            {item.description}
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
                </div>
            </section>
        </div>
    );
};

export default MultimediaPage;
