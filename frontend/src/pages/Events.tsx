import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  MapPin,
  Search,
  ArrowRight,
  Clock,
  X,
  Star,
  Bookmark,
  Users,
  GraduationCap,
  Mic2,
  Network,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { IEvent } from "@/types";
import { cn, getLocalized } from "@/lib/utils";
import { ControlsBar } from "@/components/ui/ControlsBar";
import { HubCinematicHero } from "@/components/hub/HubCinematicHero";

/* ─── Type config ────────────────────────────────────────────── */

const TYPE_META: Record<
  IEvent["type"],
  { label: string; icon: React.ElementType; color: string; bg: string; border: string; bar: string }
> = {
  conference: {
    label: "Conférence",
    icon: Mic2,
    // Theme-aligned palette (few colors only)
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

/* ─── Mock data fallback ─────────────────────────────────────── */

const MOCK_EVENTS: IEvent[] = [
  {
    _id: "m1",
    title: { fr: "Forum ESG Afrique 2026", en: "ESG Africa Forum 2026" },
    description: { fr: "Le rendez-vous annuel des décideurs et praticiens de la durabilité en Afrique. Trois jours de panels, ateliers et networking autour des enjeux ESG continentaux.", en: "The annual meeting of sustainability decision-makers and practitioners in Africa." },
    type: "conference",
    startDate: "2026-06-15T09:00:00Z",
    endDate: "2026-06-17T18:00:00Z",
    location: { fr: "Abidjan, Côte d'Ivoire", en: "Abidjan, Ivory Coast" },
    organizer: { fr: "DGIAESG & BRVM", en: "DGIAESG & BRVM" },
    imageUrl: "",
    registrationUrl: "#",
    published: true,
    featured: true,
    createdAt: "",
    updatedAt: "",
    agenda: [
      { time: "09:00", label: { fr: "Cérémonie d'ouverture", en: "Opening ceremony" }, description: { fr: "Allocutions officielles et présentation du rapport ESG Africa 2026", en: "" } },
      { time: "11:00", label: { fr: "Panel : Finance climatique africaine", en: "Panel: African Climate Finance" }, description: { fr: "Mobilisation des capitaux verts et obligations durables", en: "" } },
      { time: "14:00", label: { fr: "Ateliers thématiques", en: "Thematic workshops" }, description: { fr: "5 ateliers parallèles : E, S, G, Reporting, Investisseurs", en: "" } },
    ],
  },
  {
    _id: "m2",
    title: { fr: "Certification ESG — Session Dakar", en: "ESG Certification — Dakar Session" },
    description: { fr: "Formation intensive de 3 jours pour obtenir la certification ESG Africa. Programme académique accrédité, études de cas et examen final.", en: "" },
    type: "certification",
    startDate: "2026-05-20T08:30:00Z",
    endDate: "2026-05-22T17:00:00Z",
    location: { fr: "Dakar, Sénégal", en: "Dakar, Senegal" },
    organizer: { fr: "DGIAESG Academy", en: "DGIAESG Academy" },
    imageUrl: "",
    registrationUrl: "#",
    published: true,
    featured: false,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "m3",
    title: { fr: "Atelier Reporting IFRS S1/S2", en: "IFRS S1/S2 Reporting Workshop" },
    description: { fr: "Comprendre et appliquer les nouvelles normes IFRS de durabilité S1 (risques généraux) et S2 (risques climatiques) pour les entreprises africaines.", en: "" },
    type: "workshop",
    startDate: "2026-05-08T09:00:00Z",
    endDate: "2026-05-08T17:00:00Z",
    location: { fr: "Casablanca, Maroc", en: "Casablanca, Morocco" },
    organizer: { fr: "CGEM ESG Lab", en: "CGEM ESG Lab" },
    imageUrl: "",
    registrationUrl: "#",
    published: true,
    featured: false,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "m4",
    title: { fr: "Formation : Analyse ESG pour investisseurs", en: "Training: ESG Analysis for Investors" },
    description: { fr: "Programme de 2 jours couvrant l'intégration ESG dans les décisions d'investissement, les outils de screening et les stratégies d'engagement actionnarial.", en: "" },
    type: "training",
    startDate: "2026-07-03T09:00:00Z",
    endDate: "2026-07-04T17:00:00Z",
    location: { fr: "Nairobi, Kenya", en: "Nairobi, Kenya" },
    organizer: { fr: "Nairobi Securities Exchange", en: "Nairobi Securities Exchange" },
    imageUrl: "",
    registrationUrl: "#",
    published: true,
    featured: false,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "m5",
    title: { fr: "Networking ESG — Johannesburg", en: "ESG Networking — Johannesburg" },
    description: { fr: "Soirée networking dédiée aux professionnels ESG d'Afrique australe. Échanges informels et présentations flash de projets durables.", en: "" },
    type: "networking",
    startDate: "2026-06-04T18:00:00Z",
    endDate: "2026-06-04T21:00:00Z",
    location: { fr: "Johannesburg, Afrique du Sud", en: "Johannesburg, South Africa" },
    organizer: { fr: "ESG Africa Network", en: "ESG Africa Network" },
    imageUrl: "",
    registrationUrl: "#",
    published: true,
    featured: false,
    createdAt: "",
    updatedAt: "",
  },
];

/* ─── Helpers ────────────────────────────────────────────────── */

function daysUntil(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatShortDate(dateStr: string, lang: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString(lang, { month: "short" }),
    year: d.getFullYear(),
  };
}

/* ─── Components ─────────────────────────────────────────────── */

function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="h-1 animate-pulse bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-muted" />
        <div className="mt-4 flex gap-3">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

function FeaturedEventCard({ event, lang }: { event: IEvent; lang: string }) {
  const meta = TYPE_META[event.type] ?? TYPE_META.other;
  const Icon = meta.icon;
  const { day, month, year } = formatShortDate(event.startDate, lang);
  const days = daysUntil(event.startDate);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="golden-glow relative col-span-full mb-4 overflow-hidden rounded-3xl border-border/90 bg-card shadow-[0_40px_90px_-30px_rgba(13,77,51,0.6)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-gold)/0.13),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--brand-emerald)/0.09),transparent_55%)]" />
      {/* Featured color bar */}
      <div className={cn("h-1.5 w-full opacity-85", meta.bar)} />

      <div className="relative grid grid-cols-1 gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-8 lg:p-10">
        {/* Date block */}
        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/40 shadow-inner">
          <span className="text-3xl font-black leading-none text-primary">{day}</span>
          <span className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{month} {year}</span>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">
              <Star className="h-3 w-3" /> À la une
            </span>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider", meta.color, meta.bg, meta.border)}>
              <Icon className="h-3 w-3" /> {meta.label}
            </span>
          </div>
          <h2 className="mb-2 text-xl font-black tracking-tight text-foreground md:text-2xl">
            {getLocalized(event.title, lang)}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {getLocalized(event.description, lang)}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {getLocalized(event.location, lang)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              {getLocalized(event.organizer, lang)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex shrink-0 flex-col items-end gap-3">
          {days > 0 && (
            <div className="rounded-2xl border border-border/50 bg-muted/40 px-4 py-2 text-center">
              <p className="text-2xl font-black tabular-nums text-foreground leading-none">{days}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">jours</p>
            </div>
          )}
          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110"
          >
            Voir l'événement <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function EventCard({ event, idx, lang }: { event: IEvent; idx: number; lang: string }) {
  const meta = TYPE_META[event.type] ?? TYPE_META.other;
  const Icon = meta.icon;
  const { day, month } = formatShortDate(event.startDate, lang);
  const days = daysUntil(event.startDate);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/events/${event._id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_16px_48px_-20px_rgba(13,77,51,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_-20px_rgba(13,77,51,0.5)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.05),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Type bar */}
        <div className={cn("h-1 w-full opacity-75", meta.bar)} />

        {/* Image or placeholder */}
        {event.imageUrl ? (
          <div className="aspect-[16/7] overflow-hidden bg-muted relative">
            <img src={event.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute top-3 left-3 flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-white/20 bg-black/50 text-white backdrop-blur-sm">
              <span className="text-xl font-black leading-none">{day}</span>
              <span className="text-[9px] font-bold uppercase">{month}</span>
            </div>
          </div>
        ) : (
          <div className={cn("flex items-center justify-between px-5 pt-5")}>
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/40">
              <span className="text-xl font-black leading-none text-foreground">{day}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{month}</span>
            </div>
            {days > 0 && days <= 30 && (
              <div className="rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-center">
                <p className="text-lg font-black tabular-nums text-foreground leading-none">{days}j</p>
                <p className="text-[9px] font-bold text-muted-foreground">restants</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          {/* Type badge */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider", meta.color, meta.bg, meta.border)}>
              <Icon className="h-3 w-3" /> {meta.label}
            </span>
            <Bookmark className="h-4 w-4 text-muted-foreground/30 transition-colors hover:text-primary" />
          </div>

          <h3 className="mb-2 flex-1 text-base font-extrabold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {getLocalized(event.title, lang)}
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {getLocalized(event.description, lang)}
          </p>

          <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{getLocalized(event.location, lang)}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3 shrink-0" />
                {new Date(event.startDate).toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

function EventsPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apiEvents, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get("/events");
      return res.data.data as IEvent[];
    },
  });

  // Use mock data if API returns nothing
  const events = apiEvents && apiEvents.length > 0 ? apiEvents : MOCK_EVENTS;

  const categories = [
    { id: "all", label: t("common.all") || "Tous" },
    { id: "conference", label: "Conférences" },
    { id: "workshop", label: "Ateliers" },
    { id: "training", label: "Formations" },
    { id: "certification", label: "Certification" },
    { id: "networking", label: "Networking" },
  ];

  const filtered = events.filter((e) => {
    const matchesFilter = filter === "all" || e.type === filter;
    const matchesSearch = getLocalized(e.title, lang).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featured = filtered.filter((e) => e.featured);
  const rest = filtered.filter((e) => !e.featured);

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
      >
        <div className="flex flex-wrap gap-2">
          {[
            { value: events.length.toString(), label: "événements" },
            { value: featured.length.toString(), label: "à la une" },
            { value: "5 pays", label: "représentés" },
          ].map((c) => (
            <div key={c.label} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="text-base font-black text-brand-gold">{c.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">{c.label}</span>
            </div>
          ))}
        </div>
      </HubCinematicHero>

      <div className="gradient-flow-bg relative mt-2">
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-primary to-transparent opacity-30" />

        {/* ControlsBar */}
        <div className="relative z-20 mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <ControlsBar
            footer={
              <>
                <div className="flex min-w-0 items-center gap-2.5 text-xs">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-2 text-xs font-black tabular-nums text-primary">
                    {filtered.length}
                  </span>
                  <span className="font-semibold text-muted-foreground">
                    événement{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
                  </span>
                </div>
                {(searchQuery || filter !== "all") && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setFilter("all"); }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary hover:underline"
                  >
                    <X className="h-3 w-3" /> Réinitialiser
                  </button>
                )}
              </>
            }
          >
            {/* Search */}
            <div className="group relative flex-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/15 via-transparent to-[hsl(var(--brand-gold)/0.2)] opacity-0 blur-md transition-opacity group-focus-within:opacity-100" />
              <div className="relative flex h-12 items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 shadow-sm transition-all focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/10">
                <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder={t("events.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Type filter chips */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const active = filter === cat.id;
                const meta = cat.id !== "all" ? TYPE_META[cat.id as IEvent["type"]] : null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={cn(
                      "inline-flex h-12 items-center gap-1.5 rounded-2xl px-4 text-[11px] font-bold uppercase tracking-[0.16em] whitespace-nowrap transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border border-border/60 bg-card text-foreground shadow-sm hover:border-primary/40 hover:text-primary"
                    )}
                    aria-pressed={active}
                  >
                    {meta && <meta.icon className="h-3.5 w-3.5" />}
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </ControlsBar>
        </div>

        {/* Events grid */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <EventSkeleton key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Featured */}
              {featured.map((event) => (
                <FeaturedEventCard key={event._id} event={event} lang={lang} />
              ))}
              {/* Rest */}
              {rest.map((event, idx) => (
                <EventCard key={event._id} event={event} idx={idx} lang={lang} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-24 text-center"
            >
              <Calendar className="mb-4 h-16 w-16 text-muted-foreground/20" />
              <h2 className="text-xl font-bold text-muted-foreground">{t("common.no_results")}</h2>
              <p className="mt-2 text-sm text-muted-foreground/60">{t("events.no_events")}</p>
              <button
                onClick={() => { setSearchQuery(""); setFilter("all"); }}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-xs font-black uppercase tracking-wider text-foreground transition-all hover:border-primary/40"
              >
                <X className="h-3.5 w-3.5" /> Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
