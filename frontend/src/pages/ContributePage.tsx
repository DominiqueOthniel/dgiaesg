import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import {
  PenLine,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Database,
  BookOpen,
  Microscope,
  Send,
  Clock,
  Users,
  Globe,
  TrendingUp,
  ChevronRight,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { cn } from "@/lib/utils";

/* ─── Data ──────────────────────────────────────────────────── */

const IMPACT_STATS = [
  { value: "340+", label: "publications", sub: "depuis 2019", icon: BookOpen },
  { value: "48k", label: "lecteurs/mois", sub: "audience active", icon: Users },
  { value: "55", label: "pays couverts", sub: "par nos données", icon: Globe },
  { value: "5 j.", label: "délai moyen", sub: "de réponse éditoriale", icon: Clock },
];

const FORMAT_CARDS = [
  {
    icon: PenLine,
    label: "Tribune d'expert",
    desc: "Analyse ou prise de position (800–1 500 mots).",
    detail: "Format court, impact fort. Idéal pour réagir à l'actualité ESG ou partager une opinion documentée.",
    color: "emerald",
    words: "800–1 500 mots",
  },
  {
    icon: Microscope,
    label: "Étude de cas",
    desc: "Retour terrain documenté avec données et résultats.",
    detail: "Documentez un projet, une certification ou une transformation ESG vécue sur le terrain. Données et méthodologie requises.",
    color: "sky",
    words: "1 500–4 000 mots",
  },
  {
    icon: FileText,
    label: "Note de synthèse",
    desc: "Résumé exécutif d'un rapport ou d'une politique publique.",
    detail: "Vulgarisez un rapport ou une politique pour notre lectorat. Inclure les recommandations clés et les limites.",
    color: "violet",
    words: "500–1 000 mots",
  },
  {
    icon: Database,
    label: "Données & indicateurs",
    desc: "Jeux de données propres avec méthodologie explicite.",
    detail: "Partagez des données originales ou une méthodologie de mesure. Nous prenons en charge la visualisation.",
    color: "amber",
    words: "Tableau + note méthodologique",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    label: "Soumission",
    desc: "Envoyez votre texte ou résumé via le formulaire ci-dessous. Aucune mise en forme particulière requise.",
    icon: Send,
    color: "emerald",
  },
  {
    step: "02",
    label: "Revue éditoriale",
    desc: "Notre équipe évalue la rigueur des sources, la pertinence et l'originalité sous 5 jours ouvrés.",
    icon: BookOpen,
    color: "sky",
  },
  {
    step: "03",
    label: "Retours & ajustements",
    desc: "Échanges directs avec l'auteur pour affiner le propos, clarifier les sources ou enrichir les données.",
    icon: PenLine,
    color: "violet",
  },
  {
    step: "04",
    label: "Publication & diffusion",
    desc: "Mise en ligne avec crédit auteur complet, diffusion newsletter et promotion sur nos réseaux.",
    icon: TrendingUp,
    color: "amber",
  },
];

const REQUIREMENTS = [
  "Sources primaires ou institutionnelles vérifiables",
  "Données factuelles différenciées des opinions",
  "Pertinence pour l'économie ou la durabilité africaine",
  "Anglais ou français (traduction prise en charge si besoin)",
  "Pas de conflit d'intérêt non déclaré",
];

const RECENT_CONTRIBUTIONS = [
  {
    title: "Financement vert en Afrique de l'Ouest : état des lieux 2025",
    author: "Dr. Fatoumata Bah",
    org: "Université de Conakry",
    type: "Étude de cas",
    color: "sky",
  },
  {
    title: "RSE minière au Katanga : entre engagement et réalité",
    author: "Emmanuel Kabila",
    org: "Centre d'Études Environnementales",
    type: "Tribune",
    color: "emerald",
  },
  {
    title: "Reporting IFRS S1/S2 : défis pour les PME africaines",
    author: "Mariam Traoré",
    org: "Cabinet Traore & Partners",
    type: "Note de synthèse",
    color: "violet",
  },
];

/* ─── Components ─────────────────────────────────────────────── */

const colorMap: Record<string, { text: string; bg: string; border: string; ring: string }> = {
  emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", ring: "ring-emerald-500/20" },
  sky: { text: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/25", ring: "ring-sky-500/20" },
  violet: { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/25", ring: "ring-violet-500/20" },
  amber: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25", ring: "ring-amber-500/20" },
};

function FormatCard({ fmt, idx }: { fmt: typeof FORMAT_CARDS[number]; idx: number }) {
  const Icon = fmt.icon;
  const c = colorMap[fmt.color];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-[0_16px_40px_-18px_rgba(13,77,51,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_-18px_rgba(13,77,51,0.5)]"
    >
      <div className={cn("pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.06),transparent_55%)]")} />
      <div className={cn("mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1", c.bg, c.text, c.ring)}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-1 text-sm font-extrabold text-foreground">{fmt.label}</h3>
      <p className="mb-3 text-sm leading-relaxed text-foreground/75">{fmt.detail}</p>
      <div className={cn("inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[10px] font-black", c.text, c.bg, c.border)}>
        <FileText className="h-3 w-3" /> {fmt.words}
      </div>
    </motion.div>
  );
}

function ProcessStep({ step, idx, isLast }: { step: typeof PROCESS_STEPS[number]; idx: number; isLast: boolean }) {
  const Icon = step.icon;
  const c = colorMap[step.color];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="relative flex gap-4">
      {/* connector */}
      {/* Removed vertical connector line (was perceived as UI artifact). */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: idx * 0.1, duration: 0.4, type: "spring", stiffness: 250 }}
        className={cn("z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ring-1 shadow-lg", c.bg, c.border, c.ring)}
      >
        <Icon className={cn("h-5 w-5", c.text)} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: idx * 0.1 + 0.1, duration: 0.4 }}
        className="pb-7"
      >
        <div className="mb-0.5 flex items-center gap-2">
          <span className={cn("text-[10px] font-black", c.text)}>{step.step}</span>
          <h4 className="text-sm font-extrabold text-foreground">{step.label}</h4>
        </div>
        <p className="text-sm leading-relaxed text-foreground/75">{step.desc}</p>
      </motion.div>
    </div>
  );
}

function ContributionCard({ c: contrib, idx }: { c: typeof RECENT_CONTRIBUTIONS[number]; idx: number }) {
  const col = colorMap[contrib.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: idx * 0.08, duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-[0_12px_32px_-16px_rgba(13,77,51,0.3)]"
    >
      <div className={cn("mb-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black", col.text, col.bg, col.border)}>
        {contrib.type}
      </div>
      <p className="mb-2 text-sm font-extrabold leading-snug text-foreground">{contrib.title}</p>
      <p className="text-xs text-foreground/70">{contrib.author} · {contrib.org}</p>
    </motion.div>
  );
}

/* ─── Form ───────────────────────────────────────────────────── */

function ContributeForm({ formats }: { formats: { label: string; desc: string }[] }) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", org: "", role: "", email: "", topic: "", format: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };
  const reset = () => { setSubmitted(false); setForm({ name: "", org: "", role: "", email: "", topic: "", format: "", message: "" }); };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center gap-5 py-16 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight text-foreground">Contribution reçue !</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Merci pour votre envoi. Notre équipe éditoriale reviendra vers vous sous 5 jours ouvrés avec ses retours.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {["Délai de réponse : 5 j. ouvrés", "Crédit auteur garanti", "Diffusion newsletter"].map((f) => (
            <span key={f} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" /> {f}
            </span>
          ))}
        </div>
        <button onClick={reset} className="mt-2 text-xs font-black uppercase tracking-widest text-primary hover:underline">
          Soumettre une autre contribution
        </button>
      </motion.div>
    );
  }

  const fields = [
    { key: "name", label: t("pages.contribute.form_name"), type: "text", span: 1 },
    { key: "org", label: t("pages.contribute.form_org"), type: "text", span: 1 },
    { key: "role", label: t("pages.contribute.form_role"), type: "text", span: 1 },
    { key: "email", label: t("pages.contribute.form_email"), type: "email", span: 1 },
    { key: "topic", label: t("pages.contribute.form_topic"), type: "text", span: 2 },
  ] as const;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">{t("pages.contribute.cta_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("pages.contribute.cta_desc")}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ key, label, type, span }) => (
            <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {label} <span className="text-primary">*</span>
              </label>
              <input
                required
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded-xl border border-border/70 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
          ))}

          {/* Format select */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {t("pages.contribute.form_format")} <span className="text-primary">*</span>
            </label>
            <select
              value={form.format}
              onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
              required
              className="w-full rounded-xl border border-border/70 bg-muted/30 px-4 py-2.5 text-sm text-foreground transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
            >
              <option value="" disabled>Sélectionner un format</option>
              {formats.map((f, i) => (
                <option key={i} value={f.label}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Message textarea */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {t("pages.contribute.form_message")} <span className="text-primary">*</span>
            </label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
              placeholder="Décrivez votre contribution en quelques phrases. Vous pouvez également joindre un résumé ou un extrait..."
              className="w-full resize-none rounded-xl border border-border/70 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>

        {/* Requirements note */}
        <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Critères de sélection</p>
          <ul className="space-y-1">
            {REQUIREMENTS.map((r) => (
              <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-primary/60" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Send className="h-4 w-4" />
          {t("pages.contribute.form_submit")}
        </button>
      </form>
    </>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function ContributePage() {
  const { t } = useTranslation();
  const formats = t("pages.contribute.formats", { returnObjects: true }) as { label: string; desc: string }[];

  return (
    <HubSubpageShell
      badgeIcon={PenLine}
      badgeLabel={t("pages.contribute.badge")}
      sectionsKicker={t("pages.contribute.sections_kicker")}
      titleLead={t("pages.contribute.hero_title_lead")}
      titleBrand={t("pages.contribute.hero_title_brand")}
      subtitle={t("pages.contribute.hero_subtitle")}
      beforeBadge={
        <Link
          to="/a-propos"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm transition-colors hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {t("pages.contribute.back_about")}
        </Link>
      }
      heroFooter={
        <div className="flex flex-wrap gap-2">
          {IMPACT_STATS.slice(0, 3).map(({ value, label, icon: Icon }) => (
            <div key={label} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Icon className="h-3.5 w-3.5 text-brand-gold" />
              <span className="text-base font-black text-brand-gold tabular-nums">{value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">{label}</span>
            </div>
          ))}
        </div>
      }
    >
      {/* Impact stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {IMPACT_STATS.map(({ value, label, sub, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-[0_12px_36px_-16px_rgba(13,77,51,0.3)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-gold)/0.05),transparent_55%)]" />
            <Icon className="mb-2 h-4 w-4 text-muted-foreground" />
            <p className="text-2xl font-black tabular-nums text-foreground">{value}</p>
            <p className="text-xs font-bold text-foreground/80">{label}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Left sidebar */}
        <div className="space-y-7 lg:col-span-1">

          {/* Why */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="golden-glow relative overflow-hidden rounded-3xl border-border/90 bg-card p-6 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
            <div className="relative">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">
                <Star className="h-3 w-3" /> Pourquoi contribuer ?
              </span>
              <p className="text-base leading-relaxed text-foreground/75">{t("pages.contribute.why_body")}</p>
              <div className="mt-4 space-y-2">
                {["Visibilité auprès de 48 000 lecteurs", "Crédit auteur complet", "Diffusion multi-canal", "Archivage institutionnel"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-foreground">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.4)]"
          >
            <p className="mb-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("pages.contribute.process_title")}</p>
            {PROCESS_STEPS.map((step, i) => (
              <ProcessStep key={step.step} step={step} idx={i} isLast={i === PROCESS_STEPS.length - 1} />
            ))}
          </motion.div>

          {/* Recent contributions */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contributions récentes</p>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="space-y-3">
              {RECENT_CONTRIBUTIONS.map((c, i) => (
                <ContributionCard key={c.title} c={c} idx={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — Formats + Form */}
        <div className="space-y-7 lg:col-span-2">

          {/* Formats */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("pages.contribute.formats_title")}</p>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FORMAT_CARDS.map((fmt, i) => (
                <FormatCard key={fmt.label} fmt={fmt} idx={i} />
              ))}
            </div>
          </div>

          {/* Submission form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="golden-glow relative overflow-hidden rounded-3xl border-border/90 bg-card p-6 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)] md:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.08),transparent_60%)]" />
            <div className="relative">
              <ContributeForm formats={Array.isArray(formats) ? formats : []} />
            </div>
          </motion.div>

          {/* Team CTA */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-emerald-950/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-foreground">Rejoindre l'équipe permanente ?</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Voir les postes ouverts et les profils recherchés.</p>
              </div>
              <Link
                to="/equipe"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-black uppercase tracking-wider text-foreground transition-all hover:border-primary/40"
              >
                Notre équipe <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HubSubpageShell>
  );
}
