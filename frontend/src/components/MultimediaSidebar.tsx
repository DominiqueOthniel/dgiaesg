import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { IMultimedia, PaginatedResponse } from "../types";
import { Play, Mic, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";

export const MultimediaSidebar = () => {
    const { data, isLoading } = useQuery<PaginatedResponse<IMultimedia>>({
        queryKey: ["multimedia", "featured"],
        queryFn: async () => {
            const response = await api.get("/multimedia?featured=true&limit=3");
            return response.data;
        },
    });

    const items = data?.data || [];

    if (isLoading) {
        return (
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-white flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-6 h-6 text-brand-primary animate-spin mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chargement FA TV...</p>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
                <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] italic">FA TV & Podcast</h4>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse delay-75" />
                    <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse delay-150" />
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-[2rem] bg-slate-900 aspect-video ring-1 ring-white/10 hover:ring-brand-accent/50 transition-all cursor-pointer"
                        onClick={() => window.open(item.embedUrl, "_blank")}
                    >
                        {item.coverImageUrl ? (
                            <img
                                src={item.coverImageUrl}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-60" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-300">
                                {item.type === "video" ? (
                                    <Play className="w-5 h-5 text-white fill-white ml-1" />
                                ) : (
                                    <Mic className="w-5 h-5 text-white" />
                                )}
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform">
                            <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest mb-2 block italic">
                                {item.type === "video" ? "Vidéo" : "Podcast"} • {item.sector}
                            </span>
                            <h5 className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand-accent transition-colors">
                                {item.title}
                            </h5>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-2xl border border-slate-100 text-slate-400 hover:text-brand-primary hover:bg-slate-50 font-black text-[9px] uppercase tracking-widest h-12"
            >
                Explorer la Médiathèque
            </Button>
        </div>
    );
};
