import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  Minus,
  Crown,
  Globe,
  Building2,
  BookOpen,
  Sparkles,
  Shield,
  Zap,
  Star,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";

type PlanTier = "free" | "digital" | "revue" | "institution";

interface Plan {
  id: PlanTier;
  name: string;
  tagline: string;
  description: string;
  monthlyPrice: number | "custom";
  yearlyPrice: number | "custom";
  currency: string;
  icon: typeof Globe;
  features: string[];
  highlight?: string;
  ctaLabel: string;
  ctaHref: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratuit",
    tagline: "L'essentiel ESG",
    description: "Pour découvrir l'univers de la durabilité africaine.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "FCFA",
    icon: Globe,
    features: [
      "Newsletter hebdomadaire",
      "3 articles par mois",
      "Annuaire de base",
      "Sauvegarde jusqu'à 5 articles",
    ],
    ctaLabel: "Créer un compte",
    ctaHref: "/signup",
  },
  {
    id: "digital",
    name: "Digital",
    tagline: "L'expertise au quotidien",
    description: "L'accès illimité au site et à toutes les archives.",
    monthlyPrice: 2500,
    yearlyPrice: 25000,
    currency: "FCFA",
    icon: Crown,
    features: [
      "Accès illimité aux articles",
      "Archives complètes",
      "Newsletter premium",
      "Sauvegarde illimitée",
      "Notifications personnalisées",
    ],
    ctaLabel: "Choisir Digital",
    ctaHref: "/signup",
  },
  {
    id: "revue",
    name: "Revue + Digital",
    tagline: "Notre formule phare",
    description:
      "Tout le digital + la Revue Mensuelle (PDF) dès sa parution.",
    monthlyPrice: 5000,
    yearlyPrice: 50000,
    currency: "FCFA",
    icon: BookOpen,
    features: [
      "Tout le contenu Digital",
      "Revue Mensuelle (PDF, 50 p.)",
      "Accès aux dossiers exclusifs",
      "Données & classements détaillés",
      "Veille réglementaire mensuelle",
      "Lecture hors-ligne",
    ],
    highlight: "Le plus choisi",
    ctaLabel: "Choisir Revue + Digital",
    ctaHref: "/signup",
    popular: true,
  },
  {
    id: "institution",
    name: "Institution",
    tagline: "Équipes & API",
    description: "Solution sur-mesure pour organisations et entreprises.",
    monthlyPrice: "custom",
    yearlyPrice: "custom",
    currency: "FCFA",
    icon: Building2,
    features: [
      "Multi-comptes (jusqu'à 50+)",
      "Tableau de bord d'impact",
      "Données ESG en API",
      "Espace white-label",
      "Audit & conseil dédié",
    ],
    ctaLabel: "Contacter les ventes",
    ctaHref: "/contact",
  },
];

const COMPARISON: Array<{
  feature: string;
  values: Record<PlanTier, boolean | string>;
}> = [
  {
    feature: "Newsletter hebdomadaire",
    values: { free: true, digital: true, revue: true, institution: true },
  },
  {
    feature: "Articles consultables / mois",
    values: { free: "3", digital: "Illimité", revue: "Illimité", institution: "Illimité" },
  },
  {
    feature: "Accès aux archives",
    values: { free: false, digital: true, revue: true, institution: true },
  },
  {
    feature: "Revue Mensuelle PDF (50 p.)",
    values: { free: false, digital: false, revue: true, institution: true },
  },
  {
    feature: "Dossiers premium (20 p.)",
    values: { free: false, digital: false, revue: true, institution: true },
  },
  {
    feature: "Données & classements",
    values: { free: false, digital: "Synthèse", revue: "Détail", institution: "API" },
  },
  {
    feature: "Multi-comptes",
    values: { free: false, digital: false, revue: false, institution: "Jusqu'à 50+" },
  },
  {
    feature: "White-label",
    values: { free: false, digital: false, revue: false, institution: true },
  },
];

const GUARANTEES = [
  { icon: Shield, label: "Paiement sécurisé" },
  { icon: Zap, label: "Activation immédiate" },
  { icon: Star, label: "Sans engagement" },
];

const FAQ = [
  {
    q: "Quelle différence entre Digital et Revue + Digital ?",
    a: "Digital donne accès à tout le site (articles, archives, données de synthèse). Revue + Digital ajoute la Revue Mensuelle complète en PDF, avec dossiers exclusifs, classements détaillés et veille réglementaire.",
  },
  {
    q: "Quels modes de paiement sont acceptés ?",
    a: "Carte bancaire, Mobile Money (Orange Money, Wave, MTN), virement pour les abonnements Institution.",
  },
  {
    q: "L'offre Institution inclut-elle un onboarding ?",
    a: "Oui, un expert vous accompagne sur le déploiement multi-comptes, la formation des équipes et l'intégration API si besoin.",
  },
  {
    q: "Puis-je résilier à tout moment ?",
    a: "Oui, sans engagement. Vous pouvez résilier depuis votre espace personnel — l'accès reste actif jusqu'à la fin de la période payée.",
  },
];

function formatPrice(value: number | "custom") {
  if (value === "custom") return "Sur devis";
  if (value === 0) return "0";
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(var(--brand-deep)_/_0.95)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-gradient-pan"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, hsl(var(--brand-gold) / 0.18), transparent 55%), radial-gradient(ellipse at 80% 100%, hsl(var(--brand-gold-dark) / 0.22), transparent 60%)",
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
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, hsl(var(--brand-gold) / 0.5) 0 1px, transparent 1px 18px)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-52 md:pb-60 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--brand-gold)/0.4)] bg-[hsl(var(--brand-gold)/0.08)] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--brand-gold))]" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">
                Formules d'abonnement
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-primary-foreground leading-[1.05]">
              Rejoignez la communauté
              <br />
              <span className="bg-gradient-to-r from-[hsl(var(--brand-gold))] via-[hsl(var(--brand-gold-dark))] to-[hsl(var(--brand-gold))] bg-clip-text text-transparent italic">
                des pros de la durabilité.
              </span>
            </h1>

            <p className="text-base md:text-lg text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed">
              Quatre formules pour s'informer, décider et agir, à hauteur de
              vos ambitions ESG en Afrique.
            </p>

            <div className="inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-inner">
              {(["monthly", "yearly"] as const).map((b) => {
                const active = billing === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBilling(b)}
                    className={cn(
                      "relative h-10 px-5 rounded-full text-[11px] font-black uppercase tracking-[0.18em] transition-all",
                      active
                        ? "bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold-foreground))] shadow-[0_6px_20px_-8px_hsl(var(--brand-gold)/0.7)]"
                        : "text-primary-foreground/70 hover:text-primary-foreground"
                    )}
                  >
                    {b === "monthly" ? "Mensuel" : "Annuel"}
                    {b === "yearly" && (
                      <span className="absolute -top-2 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground shadow">
                        -17%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-primary-foreground/70">
              {GUARANTEES.map((g) => (
                <span
                  key={g.label}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold"
                >
                  <g.icon className="w-3.5 h-3.5 text-[hsl(var(--brand-gold))]" />
                  {g.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* PLAN CARDS */}
      <section className="-mt-10 relative z-10 aurora-bg aurora-bg-soft pb-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 items-stretch">
            {PLANS.map((plan, idx) => {
              const price =
                billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const isCurrent = user?.role === "pro" && plan.id === "revue"; // Adjusted check for this codebase

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: idx * 0.12,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -8 }}
                  className={cn("relative", plan.popular && "xl:-my-4")}
                >
                  {plan.popular && (
                    <div
                      aria-hidden
                      className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-[hsl(var(--brand-gold))] via-[hsl(var(--brand-gold-dark))] to-transparent opacity-70 blur-[6px] -z-10 animate-pulse"
                      style={{ animationDuration: "4s" }}
                    />
                  )}

                  <div
                    className={cn(
                      "relative h-full rounded-[2rem] overflow-hidden border bg-card/95 backdrop-blur-sm flex flex-col transition-shadow duration-500",
                      plan.popular
                        ? "border-[hsl(var(--brand-gold)/0.45)] breathe-gold"
                        : "border-border shadow-[0_18px_50px_-28px_rgba(13,77,51,0.25)] hover:shadow-[0_28px_70px_-28px_rgba(13,77,51,0.35)]"
                    )}
                  >
                    {plan.popular && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(ellipse at top, hsl(var(--brand-gold) / 0.15), transparent 55%)",
                        }}
                      />
                    )}

                    <div className="relative p-7 md:p-8 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-7">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            plan.popular
                              ? "bg-gradient-to-br from-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] text-[hsl(var(--brand-gold-foreground))] shadow-lg shadow-[hsl(var(--brand-gold)/0.3)]"
                              : plan.id === "institution"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : plan.id === "digital"
                                  ? "bg-gradient-to-br from-primary to-[hsl(var(--brand-deep))] text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                          )}
                        >
                          <plan.icon className="w-5 h-5" />
                        </div>

                        {plan.highlight && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--brand-gold)/0.15)] border border-[hsl(var(--brand-gold)/0.35)] text-[hsl(var(--brand-gold-dark))] text-[9px] font-black uppercase tracking-[0.18em]">
                            <Sparkles className="w-2.5 h-2.5 fill-current" />
                            {plan.highlight}
                          </span>
                        )}
                      </div>

                      <div className="mb-7">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary mb-2">
                          {plan.tagline}
                        </p>
                        <h3 className="text-xl font-black text-foreground tracking-tight mb-4">
                          {plan.name}
                        </h3>

                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-4xl font-black text-foreground tracking-tight">
                            {formatPrice(price)}
                          </span>
                          {price !== "custom" && (
                            <span className="text-xs font-bold text-muted-foreground">
                              {plan.currency}
                              <span className="text-muted-foreground/80">
                                {" "}
                                / {billing === "monthly" ? "mois" : "an"}
                              </span>
                            </span>
                          )}
                        </div>

                        {billing === "yearly" &&
                          typeof price === "number" &&
                          price > 0 && (
                            <p className="mt-2 text-[10px] font-semibold text-primary">
                              Soit{" "}
                              {new Intl.NumberFormat("fr-FR").format(
                                Math.round(price / 12)
                              )}{" "}
                              FCFA / mois
                            </p>
                          )}

                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-5" />

                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span
                              className={cn(
                                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                plan.popular
                                  ? "bg-[hsl(var(--brand-gold)/0.18)] text-[hsl(var(--brand-gold-dark))]"
                                  : "bg-primary/10 text-primary"
                              )}
                            >
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </span>
                            <span className="text-foreground/80 leading-relaxed">
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={isCurrent ? "/profile" : plan.ctaHref}
                        className="mt-auto"
                      >
                        <button
                          className={cn(
                            "group w-full h-13 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all inline-flex items-center justify-center gap-2 py-4",
                            isCurrent
                              ? "bg-muted text-muted-foreground cursor-default"
                              : plan.popular
                                ? "bg-gradient-to-r from-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] text-[hsl(var(--brand-gold-foreground))] shadow-lg shadow-[hsl(var(--brand-gold)/0.35)] hover:shadow-xl hover:shadow-[hsl(var(--brand-gold)/0.45)] active:scale-[0.98]"
                                : plan.id === "institution"
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
                                  : "bg-background border border-border text-foreground hover:border-primary/40 hover:text-primary active:scale-[0.98]"
                          )}
                        >
                          {isCurrent ? "Plan actuel" : plan.ctaLabel}
                          {!isCurrent && (
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          )}
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Tous les prix sont affichés HT. Vous pouvez changer ou résilier
            à tout moment.
          </p>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-24 aurora-bg aurora-bg-soft">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">
              Comparatif détaillé
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="text-3xl md:text-5xl font-black tracking-tight"
            >
              Trouvez la formule{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--brand-emerald))] via-[hsl(var(--brand-gold-dark))] to-[hsl(var(--brand-gold))] bg-clip-text text-transparent">
                qui vous correspond.
              </span>
            </motion.h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xl">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-[hsl(var(--brand-deep))] text-primary-foreground">
                  <th className="text-left px-6 py-5 text-[11px] font-black uppercase tracking-[0.18em]">
                    Fonctionnalité
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className={cn(
                        "px-6 py-5 text-[11px] font-black uppercase tracking-[0.18em] text-center",
                        p.popular &&
                          "bg-[hsl(var(--brand-gold)/0.18)] text-[hsl(var(--brand-gold))]"
                      )}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "pricing-row border-t border-border/60",
                      idx % 2 === 1 && "bg-muted/30"
                    )}
                  >
                    <td className="relative px-6 py-4 font-bold text-foreground">
                      {row.feature}
                    </td>
                    {PLANS.map((p) => {
                      const v = row.values[p.id];
                      return (
                        <td
                          key={p.id}
                          className={cn(
                            "relative px-6 py-4 text-center",
                            p.popular && "bg-[hsl(var(--brand-gold)/0.06)]"
                          )}
                        >
                          {v === true ? (
                            <span className="inline-flex w-6 h-6 rounded-full bg-primary/10 text-primary items-center justify-center mx-auto">
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </span>
                          ) : v === false ? (
                            <span className="inline-flex w-6 h-6 rounded-full bg-muted text-muted-foreground/60 items-center justify-center mx-auto">
                              <Minus className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-foreground/80">
                              {v as string}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Questions fréquentes
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              On vous explique tout.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQ.map((item, idx) => (
              <motion.details
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: idx * 0.05 }}
                className="group rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-5 cursor-pointer hover:border-[hsl(var(--brand-gold)/0.4)] transition-colors"
              >
                <summary className="list-none flex items-start justify-between gap-3">
                  <h3 className="text-sm font-black text-foreground leading-snug">
                    {item.q}
                  </h3>
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-transform group-open:rotate-45">
                    <span className="text-lg leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </motion.details>
            ))}
          </div>

          <div className="mt-16 relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(var(--brand-deep))] p-10 md:p-14 text-center shadow-2xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-gradient-pan"
              style={{
                background:
                  "radial-gradient(ellipse at top right, hsl(var(--brand-gold) / 0.25), transparent 55%), radial-gradient(ellipse at bottom left, hsl(var(--brand-gold-dark) / 0.2), transparent 60%)",
              }}
            />
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-black text-primary-foreground tracking-tight">
                Une question sur l'offre Institution ?
              </h3>
              <p className="mt-3 text-primary-foreground/75 max-w-xl mx-auto">
                Nos experts vous accompagnent dans le choix et le
                déploiement de votre solution.
              </p>
              <Link to="/contact">
                <button className="mt-8 inline-flex items-center gap-2 px-8 h-14 rounded-2xl bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold-foreground))] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[hsl(var(--brand-gold)/0.3)] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Discuter avec un conseiller
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
