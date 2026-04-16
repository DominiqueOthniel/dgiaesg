import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Play, Headphones, Filter, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { IMultimedia, PaginatedResponse } from "@/types";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/640x360/2a3347/94a3b8?text=Media";

function MultimediaPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [type, setType] = useState("all");

  const { data, isLoading } = useQuery<PaginatedResponse<IMultimedia>>({
    queryKey: ["multimedia", type],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "24" });
      if (type !== "all") params.append("type", type);
      const res = await api.get(`/multimedia?${params.toString()}`);
      return res.data;
    },
  });

  const items = data?.data || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-accent fill-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Médiathèque Institutionnelle</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              Multimédia & Insights
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl">
              Vidéos, podcasts et contenus audiovisuels de l'économie africaine certifiée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg flex flex-wrap gap-2">
          {[
            { value: "all", label: t("common.all") || "Tous", icon: Filter },
            { value: "video", label: "Vidéos", icon: Play },
            { value: "audio", label: "Podcasts", icon: Headphones },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                type === f.value ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <f.icon className="w-3.5 h-3.5" />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video bg-muted animate-pulse rounded-2xl shadow-sm" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, idx) => (
              <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <div className="group bg-card border border-border rounded-2xl overflow-hidden hover-lift h-full flex flex-col shadow-sm">
                  <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center">
                    {item.type === "video" && item.embedUrl ? (
                      <iframe 
                        src={item.embedUrl} 
                        className="w-full h-full absolute inset-0 z-10" 
                        allow="autoplay; encrypted-media" 
                        allowFullScreen 
                        title={getLocalized(item.title, lang)} 
                      />
                    ) : (
                      <>
                        {item.coverImageUrl ? (
                          <img 
                            src={resolveImageUrl(item.coverImageUrl)} 
                            alt="" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                            onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/30">
                            {item.type === "video" ? <Play className="w-12 h-12 text-muted-foreground/10" /> : <Headphones className="w-12 h-12 text-muted-foreground/10" />}
                          </div>
                        )}
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                           <div className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                             {item.type === "video" ? <Play className="w-6 h-6 fill-current" /> : <Headphones className="w-6 h-6" />}
                           </div>
                        </div>
                      </>
                    )}
                    <div className="absolute top-4 right-4 z-30">
                       <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                          {item.type}
                       </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-tight">
                      {getLocalized(item.title, lang)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6 flex-1">
                      {getLocalized(item.description, lang)}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Publié récemment</span>
                        <Share2 className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border">
            <Play className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-muted-foreground">Aucun contenu trouvé</h2>
            <p className="text-sm text-muted-foreground/60 mt-2">Revenez bientôt pour de nouveaux contenus exclusifs.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultimediaPage;
