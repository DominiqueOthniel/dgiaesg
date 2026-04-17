import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import api from "@/services/api";
import {
  getLocalized,
  SectionHeader,
  Skeleton,
  ViewportSection,
} from "./_shared";

/**
 * 7. SYNERGIES & ÉVÉNEMENTS (Newsletter + Events)
 */
export function SynergiesSection({
  events,
  eventsLoading,
}: {
  events: any[] | undefined;
  eventsLoading: boolean;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [email, setEmail] = useState("");

  return (
    <ViewportSection
      id="synergies"
      className="py-12 md:py-16 bg-background border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionHeader
          icon={Mail}
          title="Synergies & Événements"
          subtitle="Connecter l'économie réelle à l'intelligence stratégique"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Newsletter — brand-green portal */}
          <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden shadow-2xl shadow-primary/20 bg-gradient-to-br from-brand-deep via-primary to-brand-forest text-primary-foreground border border-brand-emerald/30 group/newsletter">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-emerald/30 rounded-full blur-[110px] animate-aurora" />
            <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-brand-gold/20 rounded-full blur-[100px] animate-aurora-slow" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 mb-6 backdrop-blur-md">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                  RESTONS CONNECTÉS
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 tracking-tighter italic text-balance uppercase leading-tight">
                Newsletter Stratégique
              </h3>
              <p className="text-sm text-primary-foreground/70 leading-relaxed mb-8 font-medium max-w-md">
                Analyses stratégiques, rapports d'audits et tendances
                panafricaines, livrés exclusivement chaque mois.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    api
                      .post("/newsletter/subscribe", { email })
                      .catch(() => {});
                    setEmail("");
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.organisation@email.id"
                  className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-xs outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all font-bold backdrop-blur-md"
                />
                <button
                  type="submit"
                  className="group relative overflow-hidden px-8 md:px-10 py-4 bg-brand-gold text-brand-gold-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-2xl shadow-brand-gold/40 shrink-0"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:animate-shine-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <span className="relative">S'ABONNER</span>
                </button>
              </form>
            </div>
          </div>

          {/* Events */}
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-[11px] font-black text-brand-dark flex items-center gap-2 uppercase tracking-[0.3em]">
                  {t("home.events.title")}
                </h3>
              </div>
              <Link
                to="/events"
                className="text-[11px] font-black text-primary hover:text-brand-gold-dark transition-colors flex items-center gap-1.5 uppercase tracking-widest group"
              >
                {t("home.events.view_all")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>

            {eventsLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-3xl" />
              ))
            ) : events && events.length > 0 ? (
              <div className="flex flex-col gap-3 md:gap-4">
                {events.slice(0, 3).map((event: any, idx: number) => {
                  const startDate = new Date(event.startDate);
                  return (
                    <Link
                      key={event._id}
                      to={`/events/${event._id}`}
                      className="group relative block rounded-2xl bg-white p-4 md:p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_12px_35px_-15px_rgba(13,77,51,0.22)] hover:shadow-[0_25px_50px_-15px_rgba(188,154,82,0.4)] border-2 border-brand-gold/20 hover:border-brand-gold overflow-hidden"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:animate-shine-sweep bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

                      <div className="relative flex gap-5">
                        <div className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 shadow-inner group-hover:scale-105 transition-transform duration-500">
                          <span className="text-2xl font-black text-brand-dark leading-none italic">
                            {startDate.getDate()}
                          </span>
                          <span className="text-[10px] font-black uppercase text-brand-gold-dark/60 mt-1 tracking-widest">
                            {startDate.toLocaleString("fr", {
                              month: "short",
                            })}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold-dark bg-brand-gold/10 px-2.5 py-0.5 rounded-lg border border-brand-gold/20">
                              {event.type}
                            </span>
                          </div>
                          <h4 className="text-[15px] font-black text-brand-dark group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight italic">
                            {getLocalized(event.title, lang)}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-brand-dark/50 font-black uppercase tracking-[0.15em]">
                            <MapPin className="w-3.5 h-3.5 text-brand-gold-dark" />
                            <span>{getLocalized(event.location, lang)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic py-12 text-center border-2 border-dashed border-border rounded-3xl">
                Aucun événement prioritaire à l'agenda.
              </p>
            )}
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}
