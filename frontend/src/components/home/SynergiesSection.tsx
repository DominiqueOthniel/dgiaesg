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
  SCALE_IN,
} from "./_shared";

/**
 * 7. SYNERGIES & ÉVÉNEMENTS (Newsletter + Events)
 * Redesigned with compact newsletter portal and elevated event cards.
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
      variants={SCALE_IN}
      className="relative py-8 md:py-12 border-b border-border bg-[linear-gradient(140deg,_color-mix(in_oklch,var(--brand-deep)_92%,black)_0%,_var(--brand-forest)_55%,_color-mix(in_oklch,var(--brand-emerald)_85%,black)_100%)]"
    >
      {/* Deep forest emerald — soft gold weave + warm halos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, color-mix(in oklch, var(--brand-gold) 65%, transparent) 0 1px, transparent 1px 22px), repeating-linear-gradient(-45deg, color-mix(in oklch, var(--brand-gold) 50%, transparent) 0 1px, transparent 1px 22px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 20% 25%, var(--brand-gold), transparent 60%), radial-gradient(1px 1px at 78% 30%, #ffffff, transparent 60%), radial-gradient(1.5px 1.5px at 42% 78%, var(--brand-gold), transparent 60%), radial-gradient(1px 1px at 88% 72%, #ffffff, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-brand-emerald/25 blur-[170px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-[480px] h-[480px] rounded-full bg-brand-gold/15 blur-[160px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionHeader
          icon={Mail}
          title={t("home.synergies.title") || "Synergies & Événements"}
          subtitle={t("home.synergies.subtitle") || "Connecter l'économie réelle à l'intelligence stratégique"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7">
          <div className="relative rounded-2xl p-5 md:p-7 overflow-hidden shadow-2xl shadow-primary/20 bg-gradient-to-br from-brand-deep via-primary to-brand-forest text-primary-foreground border border-brand-emerald/30 group/newsletter">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-emerald/30 rounded-full blur-[110px]" />
            <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-brand-gold/20 rounded-full blur-[100px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 mb-6 backdrop-blur-md">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                  {t("home.newsletter.badge") || "RESTONS CONNECTÉS"}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-2 tracking-tighter italic text-balance uppercase leading-tight">
                {t("home.newsletter.title") || "Newsletter Stratégique"}
              </h3>
              <p className="text-xs text-primary-foreground/70 leading-relaxed mb-5 font-medium max-w-md">
                {t("home.newsletter.desc") || "Analyses stratégiques, rapports d'audits et tendances panafricaines, livrés exclusivement chaque mois."}
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    api.post("/newsletter/subscribe", { email }).catch(() => {});
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
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-xs outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all font-bold backdrop-blur-md"
                />
                <button
                  type="submit"
                  className="group relative overflow-hidden px-6 md:px-8 py-3 bg-brand-gold text-brand-gold-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-2xl shadow-brand-gold/40 shrink-0"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:animate-shine-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <span className="relative">{t("home.newsletter.submit") || "S'ABONNER"}</span>
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-[11px] font-black text-brand-dark flex items-center gap-2 uppercase tracking-[0.3em]">
                  {t("home.events.title") || "Événements"}
                </h3>
              </div>
              <Link
                to="/events"
                className="text-[11px] font-black text-primary hover:text-brand-gold-dark transition-colors flex items-center gap-1.5 uppercase tracking-widest group"
              >
                {t("home.events.view_all") || "Voir tout"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>

            {eventsLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-3xl" />
              ))
            ) : events && events.length > 0 ? (
              <div className="flex flex-col gap-2.5 md:gap-3">
                {events.slice(0, 3).map((event: any) => {
                  const startDate = new Date(event.startDate);
                  return (
                    <Link
                      key={event._id}
                      to={`/events/${event._id}`}
                      className="group relative block rounded-xl bg-white p-3 md:p-3.5 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_28px_-12px_rgba(13,77,51,0.22)] hover:shadow-[0_18px_38px_-12px_rgba(188,154,82,0.4)] border border-brand-gold/20 hover:border-brand-gold overflow-hidden"
                    >
                      <div className="relative flex gap-3.5">
                        <div className="shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 shadow-inner group-hover:scale-105 transition-transform duration-500">
                          <span className="text-lg font-black text-brand-dark leading-none italic">
                            {startDate.getDate()}
                          </span>
                          <span className="text-[8px] font-black uppercase text-brand-gold-dark/60 mt-0.5 tracking-widest">
                            {startDate.toLocaleString("fr", { month: "short" })}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold-dark bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                              {event.type}
                            </span>
                          </div>
                          <h4 className="text-[12px] font-black text-brand-dark group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight italic">
                            {getLocalized(event.title, lang)}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-brand-dark/50 font-black uppercase tracking-[0.15em]">
                            <MapPin className="w-3 h-3 text-brand-gold-dark" />
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
                {t("home.events.no_events") || "Aucun événement prioritaire à l'agenda."}
              </p>
            )}
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}
