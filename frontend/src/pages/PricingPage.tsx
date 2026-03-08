import { motion } from "framer-motion";
import { Check, Shield, Crown, ArrowRight, Building2, Globe } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const plans = [
    {
        name: "Lecteur Libre",
        price: "0",
        description: "L'essentiel de l'ESG pour rester informé au quotidien.",
        icon: Globe,
        color: "slate",
        features: [
            "Accès aux actualités publiques",
            "Consultation de l'annuaire de base",
            "Newsletter hebdomadaire",
            "Sauvegarde jusqu'à 5 articles",
            "Flux Multimedia standard"
        ],
        buttonText: "Compte Gratuit",
        href: "/login",
        popular: false
    },
    {
        name: "Réseau PRO",
        price: "15 000",
        description: "La puissance analytique pour les décideurs et experts ESG.",
        icon: Crown,
        color: "brand",
        features: [
            "Analyses Premium illimitées",
            "Rapports d'impact détaillés",
            "Accès prioritaire aux enquêtes",
            "Sauvegarde illimitée",
            "Kiosque Revue Mensuelle PDF",
            "Support expert dédié"
        ],
        buttonText: "Passer à Pro",
        href: "/contact",
        popular: true
    },
    {
        name: "Entreprise",
        price: "Custom",
        description: "Solution complète pour les organisations et les labels.",
        icon: Building2,
        color: "secondary",
        features: [
            "Accès multi-utilisateurs",
            "Dashboard d'impact corporate",
            "Visibilité accrue sur l'annuaire",
            "Publication de communiqués",
            "API Access & Intégration",
            "Audit & Conseil ESG"
        ],
        buttonText: "Contacter Ventes",
        href: "/contact",
        popular: false
    }
];

export default function PricingPage() {
    const { user } = useAuth();

    return (
        <div className="bg-white min-h-screen">
            {/* Premium Header */}
            <section className="bg-brand-secondary pt-32 pb-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <Badge variant="outline" className="rounded-full px-6 py-2 border-brand-primary/30 bg-brand-primary/10 text-brand-primary font-black text-xs uppercase tracking-widest italic">
                            Économie de la Transition
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight leading-tight">
                            Libérez le potentiel <br />
                            <span className="text-brand-primary italic">Analytique.</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            Choisissez le plan qui correspond à votre ambition. Accédez à l'expertise COOP_LOGIC pour piloter votre stratégie ESG.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Matrix */}
            <section className="-mt-24 pb-32 relative z-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className={`h-full rounded-[3rem] overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10 ${plan.popular ? 'border-brand-primary shadow-xl shadow-brand-primary/10 bg-white ring-8 ring-brand-primary/5' : 'border-slate-50 bg-white'}`}>
                                    <CardContent className="p-10 md:p-14 flex flex-col h-full">
                                        <div className="mb-10 flex justify-between items-start">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${plan.color === 'brand' ? 'bg-brand-primary text-white' : plan.color === 'secondary' ? 'bg-brand-secondary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <plan.icon className="w-8 h-8" />
                                            </div>
                                            {plan.popular && (
                                                <Badge className="bg-brand-accent text-brand-secondary font-black rounded-full px-4 italic text-[10px] uppercase tracking-widest">Le plus choisi</Badge>
                                            )}
                                        </div>

                                        <div className="mb-10">
                                            <h3 className="text-2xl font-bold text-brand-secondary mb-3">{plan.name}</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-black text-brand-secondary tracking-tight">
                                                    {plan.price === 'Custom' ? 'Sur Devis' : `${plan.price} FCFA`}
                                                </span>
                                                {plan.price !== 'Custom' && <span className="text-slate-400 font-bold uppercase text-xs tracking-widest italic">/ MOIS</span>}
                                            </div>
                                            <p className="mt-4 text-slate-500 font-medium leading-relaxed">{plan.description}</p>
                                        </div>

                                        <div className="space-y-6 mb-12 flex-1">
                                            <div className="h-px bg-slate-50" />
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-center gap-4 group/item text-sm font-semibold text-slate-600">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.color === 'brand' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                                                        <Check className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="group-hover/item:text-brand-secondary transition-colors">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Link to={plan.href} className="w-full">
                                            <Button
                                                className={`w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${plan.popular ? 'bg-brand-primary text-white hover:bg-brand-secondary' : 'bg-slate-100 text-slate-400 hover:bg-brand-primary hover:text-white'}`}
                                            >
                                                {user?.isPro && plan.popular ? "PLAN ACTUEL" : plan.buttonText}
                                                <ArrowRight className="w-4 h-4 ml-3" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-24 border-t border-slate-50 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-8 md:mb-0">Ils nous font confiance</div>
                        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                            <span className="text-2xl font-black italic text-slate-300">LOGO_PARTNER_01</span>
                            <span className="text-2xl font-black italic text-slate-300">LOGO_PARTNER_02</span>
                            <span className="text-2xl font-black italic text-slate-300">LOGO_PARTNER_03</span>
                            <span className="text-2xl font-black italic text-slate-300">LOGO_PARTNER_04</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="py-32 bg-slate-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm mb-12 border border-slate-200">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary italic">Paiement 100% sécurisé & crypté</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-secondary mb-8 tracking-tight italic">Une question sur nos offres ?</h2>
                    <p className="text-lg text-slate-500 font-medium mb-12">Notre équipe d'experts est disponible pour vous accompagner dans le choix de votre solution.</p>
                    <Link to="/contact">
                        <Button variant="outline" className="rounded-2xl px-12 h-16 border-slate-200 text-brand-secondary font-bold text-xs uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary">
                            DISCUTER AVEC UN CONSEILLER
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
