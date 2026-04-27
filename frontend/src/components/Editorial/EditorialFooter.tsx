import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const topNavItems = [
  { label: "Portails Label", href: "/labels" },
  { label: "Registre de Transparence", href: "/directory" },
  { label: "Pays", href: "/pays" },
  { label: "Entreprises", href: "/entreprises" },
  { label: "Données ESG", href: "/donnees" },
  { label: "Journal", href: "/news" },
  { label: "Kiosque", href: "/revue" },
  { label: "Médiatique", href: "/mediatique" },
  { label: "Premium", href: "/pricing" },
];

const EditorialFooter = () => {
    return (
        <footer className="relative bg-gradient-to-br from-brand-deep via-brand-dark to-brand-forest text-white mt-auto overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-brand-emerald/25 blur-[120px] animate-aurora-slow" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-brand-gold/15 blur-[120px] animate-aurora" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-12 lg:col-span-3">
                        <div className="flex items-center gap-3 mb-8 group">
                            <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-gold/40">
                                <ShieldCheck className="w-7 h-7 text-brand-dark" />
                            </div>
                            <div>
                                <span className="text-xl md:text-2xl font-black italic block text-white uppercase tracking-tight">
                                    DGIA ESG
                                </span>
                                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em]">
                                    Infrastructure d'excellence
                                </span>
                            </div>
                        </div>
                        <p className="text-base text-white/85 max-w-sm leading-relaxed font-medium">
                            La référence panafricaine pour la certification et l'accompagnement des structures à fort impact.
                        </p>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2 lg:ml-auto">
                        <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-brand-gold">
                            Plateforme
                        </h4>
                        <div className="flex flex-col gap-4">
                            {topNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2">
                        <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-brand-gold">
                            Services
                        </h4>
                        <div className="flex flex-col gap-4">
                            <Link to="/partenariats" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                                Partenariats
                            </Link>
                            <Link to="/contact" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                                Contact
                            </Link>
                            <Link to="/kiosk" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                                Kiosque
                            </Link>
                            <Link to="/multimedia" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                                Médiathèque
                            </Link>
                            <Link to="/pricing" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                                Premium
                            </Link>
                        </div>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2">
                        <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-brand-gold">
                            Légal
                        </h4>
                        <div className="flex flex-col gap-4">
                            <Link to="/mentions-legales" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                                Mentions légales
                            </Link>
                            <Link to="/conditions-utilisation" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                                Conditions d'utilisation
                            </Link>
                            <Link to="/a-propos" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                                À propos
                            </Link>
                        </div>
                    </div>

                    <div className="md:col-span-12 lg:col-span-3">
                        <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-brand-gold">
                            Newsletter
                        </h4>
                        <p className="text-xs text-white/75 font-bold mb-6">
                            Analyses stratégiques mensuelles anonymisées.
                        </p>
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                            className="relative"
                        >
                            <input
                                type="email"
                                placeholder="email@reseau.com"
                                className="w-full bg-white/10 border border-white/25 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all font-bold"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 bottom-1 px-4 bg-brand-gold text-brand-dark rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-gold/30"
                            >
                                S'inscrire
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-white/15 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} DGIAESG — Infrastructure d'excellence.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
                        <Link to="/a-propos" className="text-xs font-bold text-white/70 hover:text-brand-gold transition-colors">
                            À propos
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <Link to="/mentions-legales" className="text-xs font-bold text-white/70 hover:text-brand-gold transition-colors">
                            Mentions légales
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <Link to="/conditions-utilisation" className="text-xs font-bold text-white/70 hover:text-brand-gold transition-colors">
                            CGU
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default EditorialFooter;
