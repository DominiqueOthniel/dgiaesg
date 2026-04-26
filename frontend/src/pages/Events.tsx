import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, MapPin, Search, ArrowRight, Clock, Bookmark, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { IEvent } from "@/types";
import { cn, getLocalized } from "@/lib/utils";
import { ControlsBar } from "@/components/ui/ControlsBar";
import { HubCinematicHero } from "@/components/hub/HubCinematicHero";

function EventsPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get("/events");
      return res.data.data as IEvent[];
    },
  });

  const categories = [
    { id: "all", label: t("common.all") || "Tous" },
    { id: "workshop", label: t("events.categories.workshop") || "Workshops" },
    { id: "conference", label: t("events.categories.conference") || "Conférences" },
    { id: "training", label: t("events.categories.training") || "Formations" },
    { id: "certification", label: t("events.categories.certification") || "Certification" },
  ];

  const filtered = events?.filter((e) => {
    const matchesFilter = filter === "all" || e.type === filter;
    const matchesSearch = getLocalized(e.title, lang).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <HubCinematicHero
        compact
        showScrollHint={false}
        badgeIcon={Calendar}
        badgeLabel={t("events.hero_badge")}
        titleLead={t("events.hero_title_lead")}
        titleBrand={t("events.hero_title_brand")}
        subtitle={t("events.hero_subtitle")}
      />

      <div className="gradient-flow-bg relative mt-2">
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-primary to-transparent opacity-30" />

        {/* ControlsBar */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ControlsBar
            footer={
              <>
                <div className="flex min-w-0 items-center gap-2.5 text-xs">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-2 text-xs font-black tabular-nums text-primary">
                    {filtered?.length ?? 0}
                  </span>
                  <span className="font-semibold text-muted-foreground">
                    événement{(filtered?.length ?? 0) > 1 ? "s" : ""} trouvé{(filtered?.length ?? 0) > 1 ? "s" : ""}
                  </span>
                </div>
                {(searchQuery || filter !== "all") && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setFilter("all"); }}
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
              <div className="relative flex h-12 items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 shadow-sm transition-all focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/10">
                <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder={t("events.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t("common.clear_search")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => {
                const active = filter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={cn(
                      "inline-flex h-12 items-center rounded-2xl px-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-all whitespace-nowrap",
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border border-border/60 bg-card text-foreground shadow-sm hover:border-primary/40 hover:text-primary"
                    )}
                    aria-pressed={active}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </ControlsBar>
        </div>

        {/* Events grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />)}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((event, idx) => {
                const start = new Date(event.startDate);
                return (
                  <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Link to={`/events/${event._id}`} className="group block bg-card border border-border rounded-2xl overflow-hidden hover-lift h-full flex flex-col shadow-sm">
                      {event.imageUrl && (
                        <div className="aspect-[16/8] bg-muted overflow-hidden relative">
                          <img src={event.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg flex flex-col items-center min-w-[50px]">
                            <span className="text-xl font-black text-primary leading-none">{start.getDate()}</span>
                            <span className="text-[9px] font-bold uppercase text-primary/60 mt-1">{start.toLocaleString(lang, { month: "short" })}</span>
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                            {event.type}
                          </span>
                          <Bookmark className="w-4 h-4 text-muted-foreground/30 hover:text-primary transition-colors" />
                        </div>
                        <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-tight">
                          {getLocalized(event.title, lang)}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed flex-1">
                          {getLocalized(event.description, lang)}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-t border-border pt-4">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent" />{getLocalized(event.location, lang)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent" />{start.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })}</span>
                          <ArrowRight className="w-4 h-4 text-primary ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border">
              <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
              <h2 className="text-xl font-bold text-muted-foreground">{t("common.no_results")}</h2>
              <p className="text-sm text-muted-foreground/60 mt-2">{t("events.no_events")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
