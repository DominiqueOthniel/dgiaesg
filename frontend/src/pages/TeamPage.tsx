import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import {
  Users,
  ArrowLeft,
  Linkedin,
  Twitter,
  BarChart3,
  Newspaper,
  Mic,
  ShieldCheck,
  MapPin,
  BookOpen,
  Star,
  PenLine,
  ArrowRight,
  Mail,
} from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { cn } from "@/lib/utils";

/* ─── Data ──────────────────────────────────────────────────── */

interface TeamMember {
  name: string;
  role: string;
  focus: string;
  initials: string;
  avatarColor: string;
  department: "editorial" | "data" | "media" | "expert";
  tags: string[];
  location: string;
  since: string;
  featured?: boolean;
  links?: { linkedin?: string; twitter?: string };
}

const TEAM: TeamMember[] = [
  {
    name: "Aminata Kouyaté",
    role: "Rédactrice en chef",
    focus: "Climat, finance durable et gouvernance des marchés africains. Ancienne journaliste économique à Jeune Afrique et contributrice régulière à l'UNECA.",
    initials: "AK",
    avatarColor: "from-emerald-500 to-teal-600",
    department: "editorial",
    tags: ["Finance durable", "Climat", "Gouvernance"],
    location: "Abidjan",
    since: "2019",
    featured: true,
    links: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Marc N'Diaye",
    role: "Éditorialiste senior",
    focus: "Analyses sectorielles, normes ESG et dialogue investisseurs. Expert associé au Centre Africain d'Analyse Économique.",
    initials: "MN",
    avatarColor: "from-sky-500 to-blue-600",
    department: "editorial",
    tags: ["Analyse sectorielle", "Investisseurs", "Normes ESG"],
    location: "Dakar",
    since: "2020",
    links: { linkedin: "#" },
  },
  {
    name: "Sarah Mensah",
    role: "Journaliste données",
    focus: "Indicateurs, méthodologies et vérification des séries publiées. Spécialiste des standards GRI, SASB et TNFD appliqués au contexte africain.",
    initials: "SM",
    avatarColor: "from-violet-500 to-purple-600",
    department: "data",
    tags: ["GRI", "SASB", "Data journalism"],
    location: "Accra",
    since: "2021",
    links: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Ibrahim Sow",
    role: "Correspondant régional",
    focus: "Veille pays & entreprises, terrain et sources institutionnelles pour l'Afrique de l'Ouest et centrale.",
    initials: "IS",
    avatarColor: "from-amber-500 to-orange-600",
    department: "editorial",
    tags: ["Terrain", "Afrique de l'Ouest", "Institutions"],
    location: "Bamako",
    since: "2021",
  },
  {
    name: "Léa Fontaine",
    role: "Responsable multimédia",
    focus: "Formats longs, entretiens et podcasts institutionnels. Production audiovisuelle et stratégie éditoriale multicanale.",
    initials: "LF",
    avatarColor: "from-pink-500 to-rose-600",
    department: "media",
    tags: ["Podcast", "Vidéo", "Production"],
    location: "Paris",
    since: "2022",
    links: { linkedin: "#" },
  },
  {
    name: "David Okonkwo",
    role: "Expert conformité",
    focus: "Cadres RSE, certification et questions réglementaires. Ancien conseil juridique pour plusieurs bourses africaines.",
    initials: "DO",
    avatarColor: "from-teal-500 to-emerald-700",
    department: "expert",
    tags: ["RSE", "Certification", "Réglementation"],
    location: "Lagos",
    since: "2022",
    links: { linkedin: "#" },
  },
];

const DEPARTMENTS = [
  { key: "all", label: "Tous", icon: Users },
  { key: "editorial", label: "Rédaction", icon: Newspaper },
  { key: "data", label: "Données", icon: BarChart3 },
  { key: "media", label: "Multimédia", icon: Mic },
  { key: "expert", label: "Experts", icon: ShieldCheck },
] as const;

const DEPT_ICON: Record<TeamMember["department"], React.ElementType> = {
  editorial: Newspaper,
  data: BarChart3,
  media: Mic,
  expert: ShieldCheck,
};

const STATS = [
  { value: "6", label: "membres", icon: Users },
  { value: "4", label: "pays couverts", icon: MapPin },
  { value: "2019", label: "fondation", icon: Star },
  { value: "340+", label: "publications", icon: BookOpen },
];

/* ─── Components ─────────────────────────────────────────────── */

function Avatar({ member, size = "md" }: { member: TeamMember; size?: "md" | "lg" }) {
  const s = size === "lg" ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg";
  return (
    <div
      className={cn(
        "shrink-0 rounded-2xl bg-gradient-to-br font-black text-white flex items-center justify-center shadow-lg",
        member.avatarColor,
        s
      )}
    >
      {member.initials}
    </div>
  );
}

function FeaturedCard({ member }: { member: TeamMember }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="golden-glow relative col-span-full mb-2 overflow-hidden rounded-3xl border-border/90 bg-card shadow-[0_40px_90px_-30px_rgba(13,77,51,0.6)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-gold)/0.14),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--brand-emerald)/0.10),transparent_55%)]" />

      <div className="relative grid grid-cols-1 gap-6 p-6 md:grid-cols-[auto_1fr] md:gap-8 md:p-10">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Avatar member={member} size="lg" />
          <div className="flex gap-2">
            {member.links?.linkedin && (
              <a href={member.links.linkedin} className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:text-foreground">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {member.links?.twitter && (
              <a href={member.links.twitter} className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">
              <Star className="h-3 w-3" /> Rédactrice en chef
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[10px] font-bold text-muted-foreground">
              <MapPin className="h-3 w-3" /> {member.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[10px] font-bold text-muted-foreground">
              Depuis {member.since}
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">{member.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{member.focus}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {member.tags.map((tag) => (
              <span key={tag} className="rounded-xl border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MemberCard({ member, idx }: { member: TeamMember; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const DeptIcon = DEPT_ICON[member.department];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_16px_48px_-20px_rgba(13,77,51,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_-20px_rgba(13,77,51,0.55)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.06),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Top accent gradient from avatar color */}
      <div className={cn("h-1 w-full bg-gradient-to-r opacity-60", member.avatarColor)} />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <Avatar member={member} />
          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
              <DeptIcon className="h-2.5 w-2.5" />
              {DEPARTMENTS.find((d) => d.key === member.department)?.label}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground/60">Depuis {member.since}</span>
          </div>
        </div>

        <h3 className="text-base font-extrabold tracking-tight text-foreground">{member.name}</h3>
        <p className="mt-0.5 text-[11px] font-black uppercase tracking-widest text-primary">{member.role}</p>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">{member.focus}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.tags.map((tag) => (
            <span key={tag} className="rounded-lg border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> {member.location}
          </span>
          <div className="flex gap-1.5">
            {member.links?.linkedin && (
              <a href={member.links.linkedin} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground transition-colors hover:text-foreground">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {member.links?.twitter && (
              <a href={member.links.twitter} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function TeamPage() {
  const { t } = useTranslation();

  const featured = TEAM.filter((m) => m.featured);
  const rest = TEAM.filter((m) => !m.featured);

  return (
    <HubSubpageShell
      badgeIcon={Users}
      badgeLabel={t("pages.team.badge")}
      sectionsKicker={t("pages.team.sections_kicker")}
      titleLead={t("pages.team.hero_title_lead")}
      titleBrand={t("pages.team.hero_title_brand")}
      singleLineTitle
      subtitle={t("pages.team.hero_subtitle")}
      beforeBadge={
        <Link
          to="/a-propos"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm transition-colors hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {t("pages.team.back_about")}
        </Link>
      }
      heroFooter={
        <div className="flex flex-wrap gap-2">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Icon className="h-3.5 w-3.5 text-brand-gold" />
              <span className="text-base font-black text-brand-gold tabular-nums">{value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">{label}</span>
            </div>
          ))}
        </div>
      }
    >
      {/* Stat bento */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map(({ value, label, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-[0_12px_36px_-16px_rgba(13,77,51,0.3)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-gold)/0.06),transparent_55%)]" />
            <Icon className="mb-2 h-4 w-4 text-muted-foreground" />
            <p className="text-2xl font-black tabular-nums text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Featured member */}
      <div className="mb-8 grid grid-cols-1">
        {featured.map((m) => (
          <FeaturedCard key={m.name} member={m} />
        ))}
      </div>

      {/* Team header */}
      <div className="mb-5 flex items-center gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">L'équipe</p>
        <div className="h-px flex-1 bg-border/50" />
        <span className="text-[10px] font-bold text-muted-foreground">{rest.length} membres</span>
      </div>

      {/* Team grid */}
      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((m, i) => (
          <MemberCard key={m.name} member={m} idx={i} />
        ))}
      </div>

      {/* Join CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-emerald-950/5 p-6 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.4)] md:p-8"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <PenLine className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">Rejoindre l'équipe éditoriale</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                DGIAESG recherche des journalistes, analystes et experts pour enrichir sa couverture continentale.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Journaliste ESG", "Analyste données", "Expert pays"].map((role) => (
                  <span key={role} className="rounded-xl border border-border/50 bg-muted/30 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <a
              href="mailto:redaction@dgiaesg.com"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-xs font-black uppercase tracking-wider text-foreground transition-all hover:border-primary/40"
            >
              <Mail className="h-4 w-4" /> Nous écrire
            </a>
            <Link
              to="/contribuer"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110"
            >
              Contribuer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </HubSubpageShell>
  );
}
