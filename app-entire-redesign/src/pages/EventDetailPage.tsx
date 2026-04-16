import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft, ExternalLink, ShieldCheck, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { IEvent } from "@/types";
import { getLocalized } from "@/lib/utils";

function EventDetailPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { id } = useParams();

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
        <h2 className="text-xl font-bold text-foreground">Événement introuvable</h2>
        <Link to="/events" className="text-sm font-semibold text-primary hover:underline">← Retour à l'agenda</Link>
      </div>
    );
  }

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l'agenda
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">{event.type}</span>
            {event.featured && <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50">· À l'affiche</span>}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary-foreground tracking-tight mb-4">
            {getLocalized(event.title, lang)}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            {getLocalized(event.location, lang) && (
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{getLocalized(event.location, lang)}</span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - {end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {event.imageUrl && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border">
                <img src={event.imageUrl} alt={getLocalized(event.title, lang)} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {getLocalized(event.description, lang) || "Aucune description disponible."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Informations</h3>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-muted-foreground text-xs">Type</dt><dd className="font-semibold text-foreground capitalize">{event.type}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Début</dt><dd className="font-semibold text-foreground">{start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Fin</dt><dd className="font-semibold text-foreground">{end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Organisateur</dt><dd className="font-semibold text-foreground">{getLocalized(event.organizer, lang) || "—"}</dd></div>
              </dl>
            </div>

            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-accent-foreground text-sm font-semibold rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg"
              >
                S'inscrire à l'événement <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <Link to="/events" className="flex items-center justify-center w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95">
              Voir tout l'agenda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
