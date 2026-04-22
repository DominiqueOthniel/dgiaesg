import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Shield,
  Crown,
  ArrowRight,
  Building2,
  Globe,
  Sparkles,
  Zap,
  Star,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";

type PlanTier = "free" | "pro" | "enterprise";

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
    name: "Lecteur Libre",
    tagline: "L'essentiel ESG",
    description:
      "Restez informé des grandes tendances de la certification africaine.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "FCFA",
    icon: Globe,
    features: [
      "Accès aux actualités publiques",
      "Consultation de l'annuaire de base",
      "Newsletter hebdomadaire",
      "Sauvegarde jusqu'à 5 articles",
      "Flux multimédia standard",
    ],
    ctaLabel: "Créer un compte",
    ctaHref: "/signup",
  },
  {
    id: "pro",
    name: "Réseau PRO",
    tagline: "Intelligence stratégique",
    description:
      "La puissance analytique pour les décideurs et les experts ESG.",
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    currency: "FCFA",
    icon: Crown,
    features: [
      "Analyses Premium illimitées",
      "Rapports d'impact détaillés",
      "Accès prioritaire aux enquêtes",
      "Sauvegarde illimitée",
      "Kiosque revue mensuelle (PDF)",
      "Support expert dédié",
    ],
    highlight: "Le plus choisi",
    ctaLabel: "Passer Premium",
    ctaHref: "/signup",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Entreprise",
    tagline: "Équipe & API",
    description:
      "Solution complète pour les organisations et les labels certifiés.",
    monthlyPrice: "custom",
    yearlyPrice: "custom",
    currency: "FCFA",
    icon: Building2,
    features: [
      "Accès multi-utilisateurs",
      "Dashboard d'impact corporate",
      "Visibilité accrue dans l'annuaire",
      "Publication de communiqués",
      "API access & intégrations",
      "Audit & conseil ESG dédié",
    ],
    ctaLabel: "Contacter les ventes",
    ctaHref: "/contact",
  },
];

const GUARANTEES = [
  { icon: Shield, label: "Paiement sécurisé" },
  { icon: Zap, label: "Activation immédiate" },
  { icon: Star, label: "Sans engagement" },
];

const FAQ = [
  {
    q: "Puis-je changer de formule à tout moment ?",
    a: "Oui, vous pouvez passer d'une formule à une autre à tout moment. La facturation est ajustée au prorata.",
  },
  {
    q: "Quels modes de paiement sont acceptés ?",
    a: "Carte bancaire, mobile money (Orange Money, Wave, MTN Mobile Money) et virement pour les abonnements Entreprise.",
  },
  {
    q: "L'abonnement Entreprise inclut-il une démo ?",
    a: "Oui. Un expert vous accompagne sur la mise en place, la formation de vos équipes et l'intégration API si besoin.",
  },
  {
    q: "Puis-je résilier mon abonnement ?",
    a: "Sans engagement : vous pouvez résilier à tout moment depuis votre espace personnel, sans frais.",
  },
];

function formatPrice(value: number | "custom") {
  if (value === "custom") return "Sur devis";
  if (value === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default function PricingPage() {
  const { user } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-36 md:pb-44 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--brand-gold)/0.4)] bg-[hsl(var(--brand-gold)/0.08)] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--brand-gold))]" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">
                Formules DGIA ESG
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-primary-foreground leading-[1.05]">
              Libérez le potentiel
              <br />
              <span className="bg-gradient-to-r from-[hsl(var(--brand-gold))] via-[hsl(var(--brand-gold-dark))] to-[hsl(var(--brand-gold))] bg-clip-text text-transparent italic">
                analytique.
              </span>
            </h1>

            <p className="text-base md:text-lg text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed">
              Choisissez la formule qui correspond à votre ambition. Accédez à
              l'intelligence stratégique COOP-LABEL pour piloter votre impact
              ESG en Afrique.
            </p>

            {/* Billing toggle */}
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
                <span key={g.label} className="inline-flex items-center gap-2 text-[11px] font-semibold">
                  <g.icon className="w-3.5 h-3.5 text-[hsl(var(--brand-gold))]" />
                  {g.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* Pricing cards */}
      <section className="-mt-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {PLANS.map((plan, idx) => {
              const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const isCurrent = user?.isPro && plan.id === "pro";

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className={cn("relative", plan.popular && "md:-my-4")}
                >
                  {plan.popular && (
                    <div aria-hidden className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-[hsl(var(--brand-gold))] via-[hsl(var(--brand-gold-dark))] to-transparent opacity-70 blur-[6px] -z-10 animate-pulse" style={{ animationDuration: "4s" }} />
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

                    <div className="relative p-8 md:p-10 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-8">
                        <div
                          className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center",
                            plan.popular
                              ? "bg-gradient-to-br from-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] text-[hsl(var(--brand-gold-foreground))] shadow-lg shadow-[hsl(var(--brand-gold)/0.3)]"
                              : plan.id === "enterprise"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          <plan.icon className="w-6 h-6" />
                        </div>

                        {plan.highlight && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--brand-gold)/0.15)] border border-[hsl(var(--brand-gold)/0.35)] text-[hsl(var(--brand-gold-dark))] text-[10px] font-black uppercase tracking-[0.18em]">
                            <Sparkles className="w-3 h-3 fill-current" />
                            {plan.highlight}
                          </span>
                        )}
                      </div>

                      <div className="mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary mb-2">
                          {plan.tagline}
                        </p>
                        <h3 className="text-2xl font-black text-foreground tracking-tight mb-4">
                          {plan.name}
                        </h3>

                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-5xl font-black text-foreground tracking-tight">
                            {formatPrice(price)}
                          </span>
                          {price !== "custom" && price !== 0 && (
                            <span className="text-sm font-bold text-muted-foreground">
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
                            <p className="mt-2 text-[11px] font-semibold text-primary">
                              Soit {new Intl.NumberFormat("fr-FR").format(Math.round(price / 12))} FCFA / mois — économie de {new Intl.NumberFormat("fr-FR").format(
                                (plan.monthlyPrice as number) * 12 - (plan.yearlyPrice as number)
                              )} FCFA
                            </p>
                          )}

                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

                      <ul className="space-y-3.5 mb-10 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm">
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
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link to={isCurrent ? "/profile" : plan.ctaHref} className="mt-auto">
                        <button
                          className={cn(
                            "group w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all inline-flex items-center justify-center gap-2",
                            isCurrent
                              ? "bg-muted text-muted-foreground cursor-default"
                              : plan.popular
                                ? "bg-gradient-to-r from-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] text-[hsl(var(--brand-gold-foreground))] shadow-lg shadow-[hsl(var(--brand-gold)/0.35)] hover:shadow-xl hover:shadow-[hsl(var(--brand-gold)/0.45)] active:scale-[0.98]"
                                : plan.id === "enterprise"
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
            Tous les prix sont affichés HT. Vous pouvez changer ou résilier à tout moment.
          </p>
        </div>
      </section>

      {/* Trust badges / partners */}
      <section className="py-20 mt-10 border-t border-border/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-10">
            Ils nous font confiance
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["UNECA", "AUDA-NEPAD", "BAD", "PNUD"].map((p) => (
              <div
                key={p}
                className="h-20 rounded-2xl border border-border bg-card flex items-center justify-center font-black italic text-muted-foreground tracking-[0.18em] text-sm hover:border-[hsl(var(--brand-gold)/0.4)] hover:text-primary transition-colors"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Questions fréquentes
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              On vous explique tout.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Tout ce qu'il faut savoir avant de choisir votre formule.
            </p>
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

          {/* CTA */}
          <div className="mt-16 relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(var(--brand-deep))] p-10 md:p-14 text-center shadow-2xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-gradient-pan"
              style={{
                background:
                  "radial-gradient(ellipse at top right, hsl(var(--brand-gold) / 0.25), transparent 55%), radial-gradient(ellipse at bottom left, hsl(var(--brand-gold-dark) / 0.2), transparent 60%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px animate-hairline"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, hsl(var(--brand-gold) / 0.2) 25%, hsl(var(--brand-gold) / 0.8) 50%, hsl(var(--brand-gold) / 0.2) 75%, transparent 100%)",
              }}
            />
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-black text-primary-foreground tracking-tight">
                Une question sur l'offre Entreprise ?
              </h3>
              <p className="mt-3 text-primary-foreground/75 max-w-xl mx-auto">
                Nos experts vous accompagnent dans le choix et le déploiement
                de votre solution.
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
