import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  PenTool,
  FileText,
  UserCircle2,
  BarChart3,
  Scale,
  Rocket,
  CalendarDays,
  Quote,
} from "lucide-react";
import { ISSUES, getLatestIssue } from "@/lib/revue-mock-data";
import { IssueCover } from "@/components/revue/IssueCover";
import { FlipCard } from "@/components/revue/FlipCard";

const SECTION_ICONS = [
  {
    icon: PenTool,
    label: "Édito",
    desc: "Le mot du rédacteur en chef.",
    back: "Une voix éditoriale forte qui ouvre chaque numéro et donne le cap du mois.",
  },
  {
    icon: FileText,
    label: "Dossier (20p)",
    desc: "L'enquête phare du mois.",
    back: "Vingt pages d'analyse, de données et de témoignages sur un sujet ESG majeur.",
  },
  {
    icon: UserCircle2,
    label: "Portrait",
    desc: "Un leader de la durabilité.",
    back: "Rencontre exclusive avec une personnalité qui transforme l'Afrique durable.",
  },
  {
    icon: BarChart3,
    label: "Classement",
    desc: "Données & palmarès exclusifs.",
    back: "Indices, scores et classements inédits, produits par notre cellule data.",
  },
  {
    icon: Scale,
    label: "Veille réglementaire",
    desc: "Les textes à connaître.",
    back: "Lois, normes et standards : tout ce qui change ce mois-ci sur le continent.",
  },
  {
    icon: Rocket,
    label: "Startups à suivre",
    desc: "5 jeunes pousses sélectionnées.",
    back: "Notre sélection mensuelle de cinq startups africaines à fort impact.",
  },
  {
    icon: CalendarDays,
    label: "Agenda RSE",
    desc: "Forums, sommets, formations.",
    back: "Le calendrier complet des rendez-vous incontournables du mois.",
  },
];

const STATS = [
  { value: "50", label: "pages chaque mois" },
  { value: "12", label: "numéros par an" },
  { value: "100%", label: "production éditoriale africaine" },
];

export default function RevuePortal() {
  const latest = getLatestIssue();
  const recent = [...ISSUES]
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(var(--brand-deep)_/_0.95)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-gradient-pan"
          style={{
            background:
              "radial-gradient(ellipse at 18% 0%, hsl(var(--brand-gold) / 0.22), transparent 55%), radial-gradient(ellipse at 80% 100%, hsl(var(--brand-emerald) / 0.18), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px animate-hairline"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(var(--brand-gold) / 0.2) 25%, hsl(var(--brand-gold) / 0.85) 50%, hsl(var(--brand-gold) / 0.2) 75%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, hsl(var(--brand-gold) / 0.5) 0 1px, transparent 1px 18px)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-24 md:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--brand-gold)/0.4)] bg-[hsl(var(--brand-gold)/0.08)] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--brand-gold))]" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">
                Produit phare COOP-LABEL
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-primary-foreground leading-[1.05]">
              La Revue Durabilité Afrique{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--brand-gold))] via-[hsl(var(--brand-gold-dark))] to-[hsl(var(--brand-gold))] bg-clip-text text-transparent italic">
                — la référence mensuelle.
              </span>
            </h1>

            <p className="text-base md:text-lg text-primary-foreground/80 max-w-xl leading-relaxed">
              Chaque mois, 50 pages d'analyses exclusives, de portraits de
              leaders, de données et de tendances sur la durabilité en
              Afrique. Le magazine de référence pour les professionnels
              engagés.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/abonnement">
                <button className="group inline-flex items-center gap-2 h-14 px-7 rounded-2xl bg-gradient-to-r from-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] text-[hsl(var(--brand-gold-foreground))] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[hsl(var(--brand-gold)/0.35)] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  S'abonner
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/revue/numeros">
                <button className="inline-flex items-center gap-2 h-14 px-7 rounded-2xl border border-white/20 bg-white/5 text-primary-foreground text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                  Voir tous les numéros
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 text-primary-foreground/70">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-[hsl(var(--brand-gold))]">
                    {s.value}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Latest issue cover, floating */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-10 rounded-full bg-[hsl(var(--brand-gold)/0.2)] blur-3xl"
              />
              <Link to={`/revue/numeros/${latest.slug}`} className="block group relative">
                <IssueCover issue={latest} size="lg" float />
                <div className="absolute -top-3 -left-3 px-3 py-1.5 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold-foreground))] text-[9px] font-black uppercase tracking-[0.22em] rounded-full shadow-lg">
                  Numéro en cours
                </div>
              </Link>
              <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-primary-foreground/60">
                {latest.monthLabel} · {latest.pageCount} pages
              </p>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* Anatomy */}
      <section className="relative py-24 aurora-bg">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                L'anatomie d'un numéro
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-3xl md:text-5xl font-black tracking-tight"
            >
              Sept rendez-vous{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--brand-gold-dark))] via-[hsl(var(--brand-gold))] to-[hsl(var(--brand-emerald))] bg-clip-text text-transparent">
                incontournables
              </span>
              , chaque mois.
            </motion.h2>
            <p className="mt-3 text-foreground/70 max-w-2xl mx-auto">
              Une structure pensée pour décider vite, agir mieux et garder
              une longueur d'avance sur les enjeux ESG du continent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECTION_ICONS.map((s, idx) => (
              <FlipCard
                key={s.label}
                icon={s.icon}
                label={s.label}
                desc={s.desc}
                back={s.back}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues */}
      <section className="relative py-20 aurora-bg aurora-bg-soft">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">
                Derniers numéros
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Quatre numéros,{" "}
                <span className="bg-gradient-to-r from-[hsl(var(--brand-emerald))] to-[hsl(var(--brand-gold-dark))] bg-clip-text text-transparent">
                  quatre angles forts.
                </span>
              </h2>
            </div>
            <Link
              to="/revue/numeros"
              className="group inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary hover:text-[hsl(var(--brand-gold-dark))] transition-colors"
            >
              Voir l'archive complète
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {recent.map((issue, idx) => (
              <motion.div
                key={issue.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                className="group"
              >
                <Link to={`/revue/numeros/${issue.slug}`} className="block">
                  <IssueCover issue={issue} size="md" />
                  <div className="mt-4 space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[hsl(var(--brand-gold-dark))]">
                      {issue.monthLabel}
                    </p>
                    <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {issue.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* New Shining Golden CTA Button */}
          <div className="mt-20 flex justify-center">
            <Link to="/revue/numeros">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.98 }}
                 className="group relative h-16 px-12 rounded-[2rem] bg-gradient-to-r from-[hsl(var(--brand-gold-dark))] via-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] text-[hsl(var(--brand-gold-foreground))] text-[11px] font-black uppercase tracking-[0.25em] shadow-[0_20px_50px_-10px_rgba(255,215,0,0.4)] border-2 border-white/20 animate-shine-gold overflow-hidden"
               >
                 {/* Shine effect inside */}
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                 <span className="relative flex items-center gap-3">
                   VOIR LA REVUE COMPLÈTE
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                 </span>
               </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(var(--brand-deep))] p-10 md:p-16 text-center shadow-2xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-gradient-pan"
              style={{
                background:
                  "radial-gradient(ellipse at top right, hsl(var(--brand-gold) / 0.25), transparent 55%), radial-gradient(ellipse at bottom left, hsl(var(--brand-emerald) / 0.2), transparent 60%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px animate-hairline"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, hsl(var(--brand-gold) / 0.2) 25%, hsl(var(--brand-gold) / 0.85) 50%, hsl(var(--brand-gold) / 0.2) 75%, transparent 100%)",
              }}
            />
            <div className="relative">
              <Quote className="w-10 h-10 mx-auto text-[hsl(var(--brand-gold))] mb-6" />
              <p className="text-xl md:text-2xl font-serif italic text-primary-foreground leading-relaxed max-w-3xl mx-auto">
                « La Revue est devenue notre rendez-vous mensuel pour
                aligner stratégie et impact. Une lecture indispensable. »
              </p>
              <p className="mt-6 text-[11px] font-black uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">
                Direction RSE — Groupe panafricain
              </p>

              <Link to="/abonnement">
                <button className="mt-10 inline-flex items-center gap-2 px-8 h-14 rounded-2xl bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold-foreground))] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[hsl(var(--brand-gold)/0.35)] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Découvrir nos formules
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
