import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Play, Headphones, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { IMultimedia, PaginatedResponse } from "@/types";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/640x360/e2e8f0/94a3b8?text=Media";

function MultimediaPage() {
  const { i18n } = useTranslation();
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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Médiathèque</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              Multimédia
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
            { value: "all", label: "Tous", icon: Filter },
            { value: "video", label: "Vidéos", icon: Play },
            { value: "audio", label: "Podcasts", icon: Headphones },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all",
                type === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <div className="group bg-card border border-border rounded-xl overflow-hidden hover-lift">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {item.type === "video" && item.embedUrl ? (
                      <iframe src={item.embedUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={getLocalized(item.title, lang)} />
                    ) : item.coverImageUrl ? (
                      <img src={resolveImageUrl(item.coverImageUrl)} alt={getLocalized(item.title, lang)} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.type === "video" ? <Play className="w-10 h-10 text-muted-foreground/20" /> : <Headphones className="w-10 h-10 text-muted-foreground/20" />}
                      </div>
                    )}
                    {item.type === "audio" && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-accent-foreground text-[10px] font-bold uppercase rounded">
                        Podcast
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-1">
                      {getLocalized(item.title, lang)}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {getLocalized(item.description, lang)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Play className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun contenu multimédia pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultimediaPage;
