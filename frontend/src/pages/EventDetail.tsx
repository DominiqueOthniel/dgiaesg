import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Calendar, MapPin, ShieldCheck, ArrowLeft, ExternalLink, 
  Clock, Share2, Info, Users 
} from "lucide-react";
import api from "@/services/api";
import { getLocalized, cn } from "@/lib/utils";
import type { IEvent } from "@/types";
import { Button } from "@/components/ui/Button";

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}`);
      return res.data.data as IEvent;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Événement non trouvé</h2>
        <Link to="/events" className="text-sm font-semibold text-primary hover:underline">← Retour à l'agenda</Link>
      </div>
    );
  }

  const startDate = new Date(event.startDate);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t("events.back_to_list")}
          </Link>
          <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-white/10 text-primary-foreground/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  {event.type}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Événement Certifié
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-8 leading-tight">
                {getLocalized(event.title, lang)}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-primary-foreground/70 text-sm font-semibold uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-accent" /></div>
                  <div>
                    <p className="text-[10px] text-primary-foreground/40 leading-none mb-1">Date</p>
                    {startDate.toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-accent" /></div>
                  <div>
                    <p className="text-[10px] text-primary-foreground/40 leading-none mb-1">Lieu</p>
                    {getLocalized(event.location, lang)}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-96 shrink-0 aspect-[16/10] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
              <img src={event.imageUrl || "https://placehold.co/800x800/2a3347/white?text=Event"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {event.featured && (
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                  À La Une
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
              <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-8 flex items-center gap-3 decoration-accent decoration-2 underline-offset-8 underline">
                <Info className="w-4 h-4" /> Description de l'événement
              </h3>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium whitespace-pre-wrap">
                {getLocalized(event.description, lang)}
              </p>

              {/* Agenda Section */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="mt-16 pt-16 border-t border-border/50">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-10">{t("events.agenda_title")}</h4>
                  <div className="space-y-0">
                    {event.agenda.map((item, idx) => (
                      <div key={idx} className="flex group border-b last:border-0 border-border/50">
                        <div className="w-24 md:w-32 py-6 shrink-0 border-r border-border/50 font-black text-sm text-foreground tabular-nums group-hover:text-primary transition-colors">
                          {item.time}
                        </div>
                        <div className="flex-1 py-6 pl-6 md:pl-10 group-hover:bg-muted/30 transition-all rounded-r-xl">
                          <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-2 uppercase tracking-wide">
                            {getLocalized(item.label as any, lang)}
                          </h5>
                          {item.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed">{getLocalized(item.description as any, lang)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Registration Card */}
            <div className="bg-primary rounded-3xl p-8 text-primary-foreground shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-extrabold mb-6 leading-tight relative z-10">
                Participation & Inscription
              </h3>
              <a 
                href={event.registrationUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-accent text-accent-foreground hover:bg-white hover:text-primary rounded-xl py-6 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-black/20 transition-all active:scale-95">
                  S'inscrire Maintenant <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              <p className="mt-6 text-[10px] text-primary-foreground/50 font-medium leading-relaxed italic border-t border-white/10 pt-6">
                * Inscription requise pour l'accès aux supports et networking.
              </p>
            </div>

            {/* Organizer Card */}
            <div className="bg-card border border-border rounded-2xl p-8 flex items-center gap-5 group hover:border-primary/30 transition-all shadow-sm">
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Users className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">{t("events.organizer")}</p>
                <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                  {getLocalized(event.organizer, lang)}
                </h4>
              </div>
            </div>

            <Button variant="outline" className="w-full rounded-2xl h-14 border-border text-muted-foreground font-bold uppercase tracking-widest text-xs gap-2 hover:bg-muted/50 hover:text-primary">
              <Share2 className="w-4 h-4" /> Partager l'événement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
