import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  Share2,
  Info,
  Clock,
  Star,
  Check,
  Copy,
  Mic2,
  LayoutGrid,
  GraduationCap,
  Network,
  Building2,
  ChevronRight,
} from "lucide-react";
import api from "@/services/api";
import { getLocalized, cn } from "@/lib/utils";
import type { IEvent } from "@/types";
import { Button } from "@/components/ui/Button";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

/* ─── Type config (mirrors Events.tsx) ──────────────────────── */

const TYPE_META: Record<IEvent["type"], { label: string; icon: React.ElementType; color: string; bg: string; border: string; bar: string }> = {
  conference: {
    label: "Conférence",
    icon: Mic2,
    color: "text-[hsl(var(--brand-emerald))]",
    bg: "bg-[hsl(var(--brand-emerald)/0.10)]",
    border: "border-[hsl(var(--brand-emerald)/0.25)]",
    bar: "bg-[hsl(var(--brand-emerald))]",
  },
  workshop: {
    label: "Atelier",
    icon: LayoutGrid,
    color: "text-[hsl(var(--primary))]",
    bg: "bg-[hsl(var(--primary)/0.10)]",
    border: "border-[hsl(var(--primary)/0.22)]",
    bar: "bg-[hsl(var(--primary))]",
  },
  training: {
    label: "Formation",
    icon: GraduationCap,
    color: "text-[hsl(var(--brand-gold-dark))]",
    bg: "bg-[hsl(var(--brand-gold)/0.14)]",
    border: "border-[hsl(var(--brand-gold)/0.35)]",
    bar: "bg-[hsl(var(--brand-gold))]",
  },
  certification: {
    label: "Certification",
    icon: ShieldCheck,
    color: "text-[hsl(var(--brand-gold-dark))]",
    bg: "bg-[hsl(var(--brand-gold)/0.14)]",
    border: "border-[hsl(var(--brand-gold)/0.35)]",
    bar: "bg-[hsl(var(--brand-gold))]",
  },
  networking: {
    label: "Networking",
    icon: Network,
    color: "text-[hsl(var(--brand-emerald))]",
    bg: "bg-[hsl(var(--brand-emerald)/0.10)]",
    border: "border-[hsl(var(--brand-emerald)/0.25)]",
    bar: "bg-[hsl(var(--brand-emerald))]",
  },
  other: {
    label: "Autre",
    icon: Calendar,
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
    bar: "bg-muted-foreground/60",
  },
};

/* ─── Helpers ────────────────────────────────────────────────── */

function daysUntil(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDuration(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60));
  if (diff < 24) return `${diff}h`;
  return `${Math.round(diff / 24)} jour${Math.round(diff / 24) > 1 ? "s" : ""}`;
}

/* ─── Components ─────────────────────────────────────────────── */

function Countdown({ dateStr }: { dateStr: string }) {
  const days = daysUntil(dateStr);
  if (days < 0) return null;
  if (days === 0) return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-center">
      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">Aujourd'hui !</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
      <p className="mb-2 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Compte à rebours</p>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl font-black tabular-nums text-foreground">{days}</span>
        <span className="text-sm font-bold text-muted-foreground">jour{days > 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-black uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copié !" : "Copier le lien"}
      </button>
      <button
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function AgendaTimeline({ agenda, lang }: { agenda: NonNullable<IEvent["agenda"]>; lang: string }) {
  // Keep agenda markers theme-aligned (few colors)
  const colors = ["emerald", "gold", "primary"];
  return (
    <div className="space-y-0 divide-y divide-border/40">
      {agenda.map((item, idx) => {
        const color = colors[idx % colors.length];
        const dotColor =
          color === "emerald"
            ? "bg-[hsl(var(--brand-emerald))]"
            : color === "gold"
            ? "bg-[hsl(var(--brand-gold))]"
            : "bg-[hsl(var(--primary))]";
        const timeColor =
          color === "emerald"
            ? "text-[hsl(var(--brand-emerald))]"
            : color === "gold"
            ? "text-[hsl(var(--brand-gold-dark))]"
            : "text-[hsl(var(--primary))]";

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: idx * 0.07, duration: 0.4 }}
            className="group flex gap-4 py-4 transition-colors hover:bg-muted/20"
          >
            {/* Time + dot */}
            <div className="flex w-20 shrink-0 flex-col items-end gap-1.5 pt-0.5">
              <span className={cn("text-sm font-black tabular-nums", timeColor)}>{item.time}</span>
              <span className={cn("h-2 w-2 rounded-full", dotColor)} />
            </div>
            {/* Separator */}
            <div className="w-px bg-border/50" />
            {/* Content */}
            <div className="flex-1 pt-0.5">
              <h5 className="text-sm font-extrabold tracking-tight text-foreground">
                {getLocalized(item.label as any, lang)}
              </h5>
              {item.description && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {getLocalized(item.description as any, lang)}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Événement non trouvé</h2>
        <Link to="/events" className="text-sm font-semibold text-primary hover:underline">
          ← {t("events.back_to_list")}
        </Link>
      </div>
    );
  }

  const meta = TYPE_META[event.type] ?? TYPE_META.other;
  const TypeIcon = meta.icon;
  const startDate = new Date(event.startDate);
  const days = daysUntil(event.startDate);
  const duration = formatDuration(event.startDate, event.endDate);
  const isPast = days < 0;

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
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm transition-colors hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" /> {t("events.back_to_list")}
        </Link>
      }
      heroFooter={
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[11px] font-black uppercase tracking-wider", meta.color, meta.bg, meta.border)}>
            <TypeIcon className="h-4 w-4" />
            {meta.label}
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80 backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-brand-gold" />
            {startDate.toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-brand-gold" />
            {getLocalized(event.location, lang)}
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-2 rounded-xl border border-brand-gold/40 bg-brand-gold/20 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-brand-gold backdrop-blur-sm">
              <Star className="h-4 w-4" /> À la une
            </span>
          )}
          {isPast && (
            <span className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Événement passé
            </span>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* ── Main content ── */}
        <div className="space-y-8 lg:col-span-2">

          {/* Image */}
          {event.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="aspect-[16/8] overflow-hidden rounded-3xl border border-border/50 shadow-2xl"
            >
              <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="golden-glow relative overflow-hidden rounded-3xl border-border/90 bg-card p-7 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)] md:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.09),transparent_60%)]" />
            <div className={cn("pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b", meta.bar)} />
            <div className="relative">
              <h3 className="mb-5 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                <Info className="h-4 w-4" /> Description de l'événement
              </h3>
              <p className="text-base font-medium leading-relaxed text-foreground/80 whitespace-pre-wrap md:text-lg">
                {getLocalized(event.description, lang)}
              </p>
            </div>
          </motion.div>

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_20px_56px_-24px_rgba(13,77,51,0.4)]"
            >
              <div className="border-b border-border/50 px-6 py-4 md:px-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2.5">
                  <Clock className="h-4 w-4" /> {t("events.agenda_title")}
                </h4>
              </div>
              <div className="px-6 py-2 md:px-8">
                <AgendaTimeline agenda={event.agenda} lang={lang} />
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">

          {/* Countdown */}
          {!isPast && <Countdown dateStr={event.startDate} />}

          {/* Registration CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="golden-glow relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground shadow-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.2),transparent_65%)]" />
            <div className="relative">
              <h3 className="mb-1.5 text-lg font-extrabold leading-tight">
                {isPast ? "Cet événement est passé" : "Participation & Inscription"}
              </h3>
              {!isPast && (
                <p className="mb-5 text-xs text-primary-foreground/60">Places limitées — inscription recommandée.</p>
              )}
              {!isPast ? (
                <a href={event.registrationUrl || "#"} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full rounded-xl bg-brand-gold py-5 text-xs font-black uppercase tracking-widest text-brand-dark shadow-xl shadow-black/20 transition-all hover:brightness-110 active:scale-95 gap-2">
                    {t("events.register")} <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link to="/events" className="block">
                  <Button className="w-full rounded-xl bg-white/10 py-5 text-xs font-black uppercase tracking-widest text-primary-foreground gap-2 hover:bg-white/15">
                    Voir les prochains événements <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {!isPast && (
                <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4">
                  {["Accès aux supports de présentation", "Certificat de participation", "Networking avec les intervenants"].map((b) => (
                    <div key={b} className="flex items-start gap-2 text-[11px] text-primary-foreground/70">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-brand-gold" />
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Event info card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_16px_40px_-16px_rgba(13,77,51,0.35)]"
          >
            <div className="border-b border-border/50 px-5 py-3.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Informations</p>
            </div>
            <div className="px-5 py-2">
              <InfoRow
                icon={TypeIcon}
                label="Type"
                value={meta.label}
              />
              <InfoRow
                icon={Calendar}
                label="Date de début"
                value={startDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              />
              <InfoRow
                icon={Clock}
                label="Durée"
                value={duration}
              />
              <InfoRow
                icon={MapPin}
                label={t("events.location")}
                value={getLocalized(event.location, lang)}
              />
              <InfoRow
                icon={Building2}
                label={t("events.organizer")}
                value={getLocalized(event.organizer, lang)}
              />
            </div>
          </motion.div>

          {/* Share */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <ShareButton />
          </motion.div>

          {/* Back link */}
          <Link
            to="/events"
            className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/60 py-2.5 text-xs font-black uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {t("events.back_to_list")}
          </Link>
        </div>
      </div>
    </HubSubpageShell>
  );
}

export default EventDetailPage;
