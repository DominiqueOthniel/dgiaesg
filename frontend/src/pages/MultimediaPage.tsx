import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Play, Headphones, Share2, Sparkles, X, LayoutGrid, Rows3, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { IMultimedia, PaginatedResponse } from "@/types";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import { ControlsBar } from "@/components/ui/ControlsBar";

const IMAGE_FALLBACK = "https://placehold.co/640x360/2a3347/94a3b8?text=Media";

function MultimediaPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [type, setType] = useState<"all" | "video" | "audio">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">("grid");

  const { data, isLoading } = useQuery<PaginatedResponse<IMultimedia>>({
    queryKey: ["multimedia", type],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "24" });
      if (type !== "all") params.append("type", type);
      const res = await api.get(`/multimedia?${params.toString()}`);
      return res.data;
    },
  });

  const items = (data?.data || []).filter((i) =>
    getLocalized(i.title, lang).toLowerCase().includes(search.trim().toLowerCase())
  );

  const mockCount = 6;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 110%, hsl(var(--brand-gold) / 0.18), transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-accent fill-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">
                {t("pages.multimedia.hero_kicker")}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              {t("pages.multimedia.hero_title")}
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl">
              {t("pages.multimedia.hero_subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <ControlsBar
          footer={
            <>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center justify-center min-w-[1.75rem] h-6 px-2 rounded-full bg-primary/10 text-primary text-[11px] font-black">
                  {items.length}
                </span>
                <span className="font-semibold text-muted-foreground">
                  {t("pages.multimedia.contents", { count: items.length })}
                </span>
              </div>
              {(search || type !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setType("all");
                  }}
                  className="inline-flex items-center gap-1.5 text-[10px] text-primary font-black uppercase tracking-[0.18em] hover:underline"
                >
                  <X className="w-3 h-3" />
                  {t("common.reset_filters")}
                </button>
              )}
            </>
          }
        >
          <div className="relative flex-1 group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/15 via-transparent to-[hsl(var(--brand-gold)/0.2)] opacity-0 group-focus-within:opacity-100 blur-md transition-opacity" />
            <div className="relative flex items-center gap-3 px-4 h-12 rounded-2xl bg-background/70 border border-border/60 focus-within:border-primary/50 focus-within:bg-background transition-all">
              <LayoutGrid className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={t("pages.multimedia.search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={t("common.clear_search")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            {[
              { value: "all", label: t("common.all"), icon: Sparkles },
              { value: "video", label: t("pages.multimedia.filter_videos"), icon: Play },
              { value: "audio", label: t("pages.multimedia.filter_podcasts"), icon: Headphones },
            ].map((f) => {
              const active = type === (f.value as typeof type);
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setType(f.value as typeof type)}
                  className={cn(
                    "inline-flex items-center gap-2 h-12 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.16em] transition-all",
                    active
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-background/70 border border-border/60 text-foreground hover:border-primary/40 hover:text-primary"
                  )}
                  aria-pressed={active}
                >
                  <f.icon className={cn("w-3.5 h-3.5", active && f.icon === Sparkles && "fill-current")} />
                  {f.label}
                </button>
              );
            })}

            <div className="inline-flex items-center h-12 rounded-2xl bg-background/70 border border-border/60 p-1 w-full sm:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "h-10 px-3 rounded-xl inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all whitespace-nowrap",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("common.view_grid")}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                className={cn(
                  "h-10 px-3 rounded-xl inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all whitespace-nowrap",
                  viewMode === "compact"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("common.view_compact")}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-10 px-3 rounded-xl inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all whitespace-nowrap",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("common.view_list")}</span>
              </button>
            </div>
          </div>
        </ControlsBar>
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
          <div className={cn(
            "grid gap-8",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : viewMode === "compact"
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1"
          )}>
            {items.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <div className={cn(
                  "group bg-card border border-border rounded-2xl overflow-hidden hover-lift h-full shadow-sm",
                  viewMode === "grid" ? "flex flex-col" : "flex"
                )}>
                  <div className={cn(
                    "bg-black relative overflow-hidden flex items-center justify-center",
                    viewMode === "grid"
                      ? "aspect-video"
                      : viewMode === "compact"
                        ? "w-56 md:w-64 shrink-0"
                        : "w-44 md:w-52 shrink-0"
                  )}>
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
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/30">
                            {item.type === "video" ? (
                              <Play className="w-12 h-12 text-muted-foreground/10" />
                            ) : (
                              <Headphones className="w-12 h-12 text-muted-foreground/10" />
                            )}
                          </div>
                        )}
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                          <div className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                            {item.type === "video" ? (
                              <Play className="w-6 h-6 fill-current" />
                            ) : (
                              <Headphones className="w-6 h-6" />
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="absolute top-4 right-4 z-30">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                        {item.type === "video"
                          ? t("pages.multimedia.filter_videos")
                          : t("pages.multimedia.filter_podcasts")}
                      </span>
                    </div>
                  </div>
                  <div className={cn("p-6 flex-1 flex flex-col", viewMode !== "grid" && "py-4")}>
                    <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-tight">
                      {getLocalized(item.title, lang)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6 flex-1">
                      {getLocalized(item.description, lang)}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {t("pages.multimedia.published_recently")}
                      </span>
                      <Share2 className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
            }}
          >
            {Array.from({ length: mockCount }).map((_, idx) => (
              <motion.div
                key={`mock-${idx}`}
                className="group hover-lift-soft"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-md bg-gradient-to-br from-primary/20 via-primary/10 to-[hsl(var(--brand-gold)/0.15)] relative">
                  <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.4)_0_2px,transparent_2px_14px)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {idx % 2 === 0 ? <Play className="w-6 h-6 fill-current" /> : <Headphones className="w-6 h-6" />}
                    </motion.div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/55 to-transparent">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                      {idx % 2 === 0 ? t("pages.multimedia.mock_video") : t("pages.multimedia.mock_podcast")} ·{" "}
                      {t("pages.multimedia.mock_episode")} {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 rounded-full bg-muted" />
                  <div className="h-3 rounded-full bg-muted/70 w-4/5" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MultimediaPage;
