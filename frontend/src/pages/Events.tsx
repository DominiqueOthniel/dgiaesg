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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Agenda ESG</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              Événements & Agenda
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl">
              Participez aux moments clés de la transformation économique africaine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <ControlsBar
          footer={
            <>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center justify-center min-w-[1.75rem] h-6 px-2 rounded-full bg-primary/10 text-primary text-[11px] font-black">
                  {filtered?.length ?? 0}
                </span>
                <span className="font-semibold text-muted-foreground">
                  événement{(filtered?.length ?? 0) > 1 ? "s" : ""} trouvé{(filtered?.length ?? 0) > 1 ? "s" : ""}
                </span>
              </div>
              {(searchQuery || filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("all");
                  }}
                  className="inline-flex items-center gap-1.5 text-[10px] text-primary font-black uppercase tracking-[0.18em] hover:underline"
                >
                  <X className="w-3 h-3" />
                  Réinitialiser
                </button>
              )}
            </>
          }
        >
          <div className="relative flex-1 group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/15 via-transparent to-[hsl(var(--brand-gold)/0.2)] opacity-0 group-focus-within:opacity-100 blur-md transition-opacity" />
            <div className="relative flex items-center gap-3 px-4 h-12 rounded-2xl bg-background/70 border border-border/60 focus-within:border-primary/50 focus-within:bg-background transition-all">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={t("events.search_placeholder") || "Rechercher un événement..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Effacer la recherche"
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
                    "inline-flex items-center h-12 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.16em] transition-all whitespace-nowrap",
                    active
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-background/70 border border-border/60 text-foreground hover:border-primary/40 hover:text-primary"
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

      {/* Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <p className="text-sm text-muted-foreground/60 mt-2">Aucun événement ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
