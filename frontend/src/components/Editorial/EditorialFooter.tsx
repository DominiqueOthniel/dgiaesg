import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

const EditorialFooter = () => {
    return (
        <footer className="bg-brand-secondary text-white pt-24 pb-12 selection:bg-brand-accent selection:text-brand-secondary">
            <div className="editorial-container">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-20 border-b border-white/5">
                    {/* Brand */}
                    <div className="space-y-8">
                        <Link to="/" className="inline-block group">
                            <span className="font-serif text-3xl font-bold tracking-tighter">
                                Coop<span className="text-brand-accent">Label</span>
                            </span>
                        </Link>
                        <p className="text-xs leading-relaxed text-slate-400 font-medium max-w-xs">
                            Portail de référence pour la labellisation de l'excellence en Afrique. Une architecture de confiance pour la transition durable.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-secondary transition-all">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-brand-accent mb-10">Exploration</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Actualités', href: '/news' },
                                { name: 'Registre des Labels', href: '/labels' },
                                { name: 'Annuaire Certifié', href: '/directory' },
                                { name: 'Kiosque Digital', href: '/kiosk' },
                                { name: 'Multimedia', href: '/multimedia' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.href} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services & Engagement */}
                    <div>
                        <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-brand-accent mb-10">Engagement</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Nos Services', href: '/pricing' },
                                { name: 'Processus de Label', href: '/how-it-works' },
                                { name: 'Partenariats', href: '#' },
                                { name: 'FAQ & Support', href: '#' },
                                { name: 'Événements', href: '#' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.href} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Locale */}
                    <div className="space-y-10">
                        <div>
                            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-brand-accent mb-10">Contact</h4>
                            <div className="space-y-5">
                                <div className="flex items-start gap-4 text-slate-400">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span className="text-[11px] font-medium leading-relaxed">Immeuble Le Prestige, Plateau, Abidjan</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400">
                                    <Phone className="w-4 h-4 shrink-0" />
                                    <span className="text-[11px] font-medium">+225 07 88 88 88 88</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400">
                                    <Mail className="w-4 h-4 shrink-0" />
                                    <span className="text-[11px] font-medium">contact@cooplabel.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500">
                        &copy; {new Date().getFullYear()} COOPLABEL GROUP. ARCHITECTURE DE CONFIANCE.
                    </p>
                    <div className="flex gap-10">
                        {['Conditions', 'Confidentialité', 'Cookies'].map((item) => (
                            <Link key={item} to="#" className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default EditorialFooter;
