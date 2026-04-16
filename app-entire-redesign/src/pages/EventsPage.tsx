import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, MapPin, Search, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { IEvent } from "@/types";
import { cn, getLocalized } from "@/lib/utils";

const categories = [
  { id: "all", label: "Tous" },
  { id: "workshop", label: "Workshops" },
  { id: "conference", label: "Conférences" },
  { id: "training", label: "Formations" },
  { id: "certification", label: "Certification" },
];

function EventsPage() {
  const { i18n } = useTranslation();
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

  const filtered = events?.filter((e) => {
    const matchesFilter = filter === "all" || e.type === filter;
    const matchesSearch = getLocalized(e.title, lang).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  filter === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((event, idx) => {
              const start = new Date(event.startDate);
              const end = new Date(event.endDate);
              return (
                <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Link to={`/events/${event._id}`} className="group block bg-card border border-border rounded-xl overflow-hidden hover-lift">
                    {event.imageUrl && (
                      <div className="aspect-[16/8] bg-muted overflow-hidden">
                        <img src={event.imageUrl} alt={getLocalized(event.title, lang)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5 flex gap-4">
                      <div className="shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-primary leading-none">{start.getDate()}</span>
                        <span className="text-[10px] font-semibold uppercase text-primary/70 mt-0.5">
                          {start.toLocaleString("fr", { month: "short" })}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded inline-block mb-2">
                          {event.type}
                        </span>
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                          {getLocalized(event.title, lang)}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {getLocalized(event.location, lang) && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{getLocalized(event.location, lang)}</span>
                          )}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun événement pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
