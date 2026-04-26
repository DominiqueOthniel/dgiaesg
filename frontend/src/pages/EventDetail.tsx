import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar, MapPin, ShieldCheck, ArrowLeft, ExternalLink,
  Share2, Info, Users
} from "lucide-react";
import api from "@/services/api";
import { getLocalized } from "@/lib/utils";
import type { IEvent } from "@/types";
import { Button } from "@/components/ui/Button";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Événement non trouvé</h2>
        <Link to="/events" className="text-sm font-semibold text-primary hover:underline">← {t("events.back_to_list")}</Link>
      </div>
    );
  }

  const startDate = new Date(event.startDate);

  return (
    <HubSubpageShell
      badgeIcon={Calendar}
      badgeLabel={t("events.detail_badge")}
      titleLead={getLocalized(event.title, lang)}
      titleBrand={t("events.detail_hero_brand")}
      subtitle={`${startDate.toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" })} · ${getLocalized(event.location, lang)}`}
      beforeBadge={
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" /> {t("events.back_to_list")}
        </Link>
      }
      heroFooter={
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80">
            <Calendar className="w-4 h-4 text-brand-gold" />
            {startDate.toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80">
            <MapPin className="w-4 h-4 text-brand-gold" />
            {getLocalized(event.location, lang)}
          </span>
          {event.type && (
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80">
              {event.type}
            </span>
          )}
          {event.featured && (
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-gold/20 border border-brand-gold/40 backdrop-blur-sm text-[11px] font-black uppercase tracking-wider text-brand-gold">
              <ShieldCheck className="w-4 h-4" /> À la une
            </span>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main */}
        <div className="lg:col-span-2 space-y-10">
          {event.imageUrl && (
            <div className="aspect-[16/8] rounded-3xl overflow-hidden shadow-2xl border border-border/50">
              <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="golden-glow relative rounded-3xl border-border/90 bg-card p-8 md:p-10 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <Info className="w-4 h-4" /> Description de l'événement
            </h3>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium whitespace-pre-wrap">
              {getLocalized(event.description, lang)}
            </p>

            {event.agenda && event.agenda.length > 0 && (
              <div className="mt-12 pt-10 border-t border-border/50">
                <h4 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-8">{t("events.agenda_title")}</h4>
                <div className="space-y-0">
                  {event.agenda.map((item, idx) => (
                    <div key={idx} className="flex group border-b last:border-0 border-border/50">
                      <div className="w-24 md:w-32 py-5 shrink-0 border-r border-border/50 font-black text-sm text-foreground tabular-nums group-hover:text-primary transition-colors">
                        {item.time}
                      </div>
                      <div className="flex-1 py-5 pl-6 md:pl-10 group-hover:bg-muted/30 transition-all rounded-r-xl">
                        <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1.5 uppercase tracking-wide">
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
        <div className="space-y-6">
          <div className="golden-glow relative rounded-3xl bg-primary p-8 text-primary-foreground shadow-2xl overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.15),transparent_70%)]" />
            <h3 className="text-lg font-extrabold mb-5 leading-tight relative z-10">
              Participation & Inscription
            </h3>
            <a
              href={event.registrationUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 block"
            >
              <Button className="w-full bg-brand-gold text-brand-dark hover:brightness-110 rounded-xl py-6 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-black/20 transition-all active:scale-95">
                {t("events.register")} <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <p className="relative z-10 mt-5 text-[10px] text-primary-foreground/50 font-medium leading-relaxed italic border-t border-white/10 pt-5">
              * Inscription requise pour l'accès aux supports et networking.
            </p>
          </div>

          <div className="golden-glow relative rounded-3xl border-border/90 bg-card p-6 flex items-center gap-5 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
            <div className="relative w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div className="relative min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">{t("events.organizer")}</p>
              <h4 className="text-sm font-extrabold text-foreground truncate">
                {getLocalized(event.organizer, lang)}
              </h4>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-2xl h-12 border-border text-muted-foreground font-bold uppercase tracking-widest text-xs gap-2 hover:bg-muted/50 hover:text-primary"
          >
            <Share2 className="w-4 h-4" /> Partager l'événement
          </Button>
        </div>
      </div>
    </HubSubpageShell>
  );
}

export default EventDetailPage;
