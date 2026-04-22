import { useState, useRef, useEffect, type WheelEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    Search, User, Menu, X, ShieldCheck, Check,
    Bookmark, Calendar, ChevronDown, Palette, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import EditorialTicker from "./EditorialTicker";
import NotificationBell from "../notifications/NotificationBell";
import ThemePicker from "./ThemePicker";

const EditorialHeader = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { i18n, t } = useTranslation();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
    
    const userMenuRef = useRef<HTMLDivElement>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    const navigation = [
        { name: t("nav.home"), href: '/' },
        { name: t("nav.events"), href: '/events' },
        { name: t("nav.news"), href: '/news' },
        { name: t("nav.labels"), href: '/labels' },
        { name: t("nav.directory"), href: '/directory' },
        { name: t("nav.multimedia"), href: '/multimedia' },
        { name: t("nav.kiosk"), href: '/kiosk' },
    ];

    const serviceLinks = [
        { name: t("nav.all_services"), href: "/pricing" },
        { name: t("nav.label_process"), href: "/labels/process" },
        { name: t("nav.partners"), href: "/partners" },
        { name: t("nav.support"), href: "/support" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 150);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) setIsServicesOpen(false);
            if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsLangOpen(false);
    };

    const handleNavWheel = (event: WheelEvent<HTMLDivElement>) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.currentTarget.scrollLeft += event.deltaY;
            event.preventDefault();
        }
    };

    return (
        <div className="flex flex-col">
            <EditorialTicker />

            <header className="w-full bg-white relative z-[100]">
                {/* 1. Top Utility Bar */}
                <div className="bg-brand-secondary text-white py-2 border-b border-white/5 overflow-x-auto no-scrollbar">
                    <div className="editorial-container flex items-center justify-between min-w-max md:min-w-0">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="hidden lg:flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 border-r border-white/10 pr-4">
                                <Calendar className="w-3 h-3 text-brand-primary" />
                                {new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>

                            {/* Persistent Language Dropdown */}
                            <div className="relative group" ref={langRef}>
                                <button 
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-brand-primary rounded-sm transition-all group/btn"
                                >
                                    <Globe className="w-3.5 h-3.5 text-brand-primary group-hover/btn:text-white" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{i18n.language.toUpperCase().split('-')[0]}</span>
                                    <ChevronDown className={cn("w-3 h-3 transition-transform opacity-50", isLangOpen && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute left-0 mt-2 w-32 bg-white text-brand-secondary border border-surface-muted shadow-2xl z-[150] p-1">
                                            <button onClick={() => changeLanguage('fr')} className="w-full text-left px-3 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-between border-b border-surface-muted last:border-0 border-l-4 border-transparent hover:border-l-white">
                                                Français {i18n.language.startsWith('fr') && <Check className="w-3 h-3 text-brand-primary" />}
                                            </button>
                                            <button onClick={() => changeLanguage('en')} className="w-full text-left px-3 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-between border-l-4 border-transparent hover:border-l-white">
                                                English {i18n.language.startsWith('en') && <Check className="w-3 h-3 text-brand-primary" />}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Persistent Theme Palette Trigger */}
                            <button 
                                onClick={() => setIsThemePickerOpen(true)}
                                className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-brand-primary rounded-sm transition-all group/palette"
                            >
                                <Palette className="w-3.5 h-3.5 text-brand-primary group-hover/palette:text-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{t("theme.palette")}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3 md:gap-6">
                            {/* PRO MANAGEMENT OPTION - PERMANENT IN CONTROL BAR IF LOGGED IN */}
                            {user?.isPro && (
                                <Link to="/org-hub" className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-sm hover:bg-brand-primary hover:text-white transition-all">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">{t("nav.org_hub")}</span>
                                </Link>
                            )}

                            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                                {!isAuthenticated ? (
                                    <>
                                        <Link to="/login" className="text-[9px] font-black uppercase tracking-widest hover:text-brand-primary transition-colors">
                                            {t("nav.login")}
                                        </Link>
                                        <Link to="/pricing" className="bg-brand-primary text-white px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-secondary transition-all shadow-lg shadow-brand-primary/20">
                                            {t("pricing.subscribe_btn") || t("nav.pricing")}
                                        </Link>
                                    </>
                                ) : (
                                    <div className="relative" ref={userMenuRef}>
                                        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-sm hover:bg-white/10 transition-all">
                                            <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[100px]">{user?.name}</span>
                                            <User className="w-3.5 h-3.5 text-brand-primary" />
                                        </button>
                                        <AnimatePresence>
                                            {isUserMenuOpen && (
                                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-0 mt-2 w-56 bg-white text-brand-secondary border border-surface-muted shadow-2xl z-[150] p-1">
                                                    <div className="p-4 border-b border-surface-muted bg-surface-base">
                                                        <p className="text-[8px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">{user?.role?.toUpperCase()}</p>
                                                        <p className="text-xs font-bold truncate text-brand-secondary">{user?.name}</p>
                                                    </div>
                                                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors">{t("nav.profile")}</Link>
                                                    
                                                    {user?.isPro && (
                                                        <Link to="/org-hub" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white transition-colors border-l-4 border-brand-primary">
                                                            <ShieldCheck className="w-4 h-4" /> {t("nav.org_hub")}
                                                        </Link>
                                                    )}

                                                    {user?.role === 'admin' && <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors">{t("common.admin") || "Administration"}</Link>}
                                                    <div className="border-t border-surface-muted mt-1 p-1">
                                                        <button onClick={logout} className="w-full text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all text-red-500 rounded-sm">{t("nav.logout")}</button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Brand Header (Logo + Ad) */}
                <div className="bg-white border-b border-surface-muted py-6 md:py-8">
                    <div className="editorial-container flex flex-col md:flex-row items-center justify-between gap-8">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary flex items-center justify-center p-2">
                                <ShieldCheck className="text-white w-full h-full" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-3xl md:text-5xl font-black uppercase tracking-tighter text-brand-secondary">
                                    Coop<span className="text-brand-primary">Label</span>
                                </span>
                                <span className="text-[8px] md:text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mt-1 italic">L'Expertise Africaine</span>
                            </div>
                        </Link>

                        <div className="flex lg:hidden w-[728px] h-[90px] bg-surface-base border border-surface-muted items-center justify-center relative group">
                            <span className="text-[8px] font-bold text-surface-muted uppercase tracking-widest absolute top-1 left-2">Ad</span>
                            <span className="text-brand-secondary/20 font-serif italic">Espace Partenaire</span>
                        </div>

                        <button 
                            className="p-4 bg-brand-secondary text-white rounded-none hover:bg-brand-primary transition-all flex items-center gap-3 group relative overflow-hidden shadow-2xl" 
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <div className="absolute inset-0 bg-brand-primary/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            <Menu className="w-7 h-7 relative z-10" />
                            <div className="flex flex-col items-start relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">{t("common.explorer")}</span>
                                <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest mt-1">{t("common.platform")}</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 3. Sticky Navigation Bar */}
                <div className={cn("bg-white border-b-4 border-brand-primary sticky top-0 z-[100] transition-all", isScrolled ? "shadow-lg" : "shadow-sm")}>
                    <div className="editorial-container flex items-center justify-between h-14">
                        <nav
                            className="flex-1 min-w-0 overflow-x-auto no-scrollbar flex items-center h-full scroll-smooth overscroll-x-contain touch-pan-x"
                            onWheel={handleNavWheel}
                        >
                            <div className="flex flex-nowrap items-center h-full whitespace-nowrap">
                                {navigation.map((item) => (
                                    <Link key={item.href} to={item.href} className={cn("nav-item h-full flex items-center px-4 lg:px-8 border-r border-surface-muted first:border-l relative group/nav", location.pathname === item.href && "text-brand-primary bg-surface-base shadow-[inset_0_-4px_0_var(--color-brand-primary)]")}>
                                        <span className="relative z-10">{item.name}</span>
                                        <div className="absolute inset-0 bg-brand-primary/5 scale-y-0 group-hover/nav:scale-y-100 transition-transform origin-bottom" />
                                    </Link>
                                ))}
                                <div className="relative h-full flex items-center border-r border-surface-muted group/services" ref={servicesRef}>
                                    <button 
                                        onMouseEnter={() => setIsServicesOpen(true)}
                                        className={cn("nav-item h-full flex items-center gap-2 px-8 transition-all hover:bg-surface-base", isServicesOpen && "text-brand-primary bg-surface-base shadow-[inset_0_-4px_0_var(--color-brand-primary)]")}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">{t("common.services")} <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isServicesOpen && "rotate-180")} /></span>
                                    </button>
                                    <AnimatePresence>
                                        {isServicesOpen && (
                                            <motion.div 
                                                onMouseEnter={() => setIsServicesOpen(true)}
                                                onMouseLeave={() => setIsServicesOpen(false)}
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                exit={{ opacity: 0, y: 10 }} 
                                                className="absolute top-full left-0 w-80 bg-white border-x border-b border-surface-muted shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-[100] p-2 divide-y divide-surface-muted"
                                            >
                                                {serviceLinks.map((link) => (
                                                    <Link key={link.href} to={link.href} onClick={() => setIsServicesOpen(false)} className="group/sl flex items-center justify-between px-5 py-4 hover:bg-brand-primary transition-all">
                                                        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-brand-secondary group-hover/sl:text-white">{link.name}</span>
                                                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full group-hover/sl:bg-white" />
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </nav>

                        <div className="flex items-center gap-4 px-4 bg-white shadow-[-10px_0_10px_-5px_white]">
                            {/* Sticky Nav Language Switcher */}
                            <div className="relative border-r border-surface-muted pr-4" ref={langRef}>
                                <button 
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-secondary hover:text-brand-primary transition-colors"
                                >
                                    <Globe className="w-4 h-4 text-brand-primary" />
                                    {i18n.language.toUpperCase().split('-')[0]}
                                    <ChevronDown className={cn("w-3 h-3 transition-transform", isLangOpen && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full right-0 mt-2 w-32 bg-white text-brand-secondary border border-surface-muted shadow-2xl z-[120] p-1">
                                            <button onClick={() => changeLanguage('fr')} className="w-full text-left px-3 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-between border-b border-surface-muted last:border-0">
                                                Français {i18n.language.startsWith('fr') && <Check className="w-3 h-3 text-brand-primary group-hover:text-white" />}
                                            </button>
                                            <button onClick={() => changeLanguage('en')} className="w-full text-left px-3 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-between">
                                                English {i18n.language.startsWith('en') && <Check className="w-3 h-3 text-brand-primary group-hover:text-white" />}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button className="p-2 text-text-muted hover:text-brand-primary transition-colors"><Search className="w-4 h-4" /></button>
                            <Link to="/library" className="hidden lg:flex items-center gap-2 text-[9px] font-black italic text-brand-primary uppercase tracking-widest">
                                <Bookmark className="w-3.5 h-3.5" />
                                <span className="bg-brand-primary text-white px-1.5 py-0.5 rounded-sm">{(user?.savedArticles?.length || 0)}</span>
                            </Link>
                            {isAuthenticated && <div className="hidden sm:block"><NotificationBell /></div>}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hidden Theme Picker (invoked from palette button) */}
            <ThemePicker forcedOpen={isThemePickerOpen} onClose={() => setIsThemePickerOpen(false)} />

            {/* High-Visibility Floating Theme Palette Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsThemePickerOpen(true)}
                className="fixed bottom-10 right-10 w-16 h-16 bg-brand-primary text-white rounded-full shadow-[0_20px_50px_rgba(227,6,19,0.3)] z-[150] flex items-center justify-center group flex-col"
            >
                <Palette className="w-6 h-6 mb-0.5" />
                <span className="text-[7px] font-black uppercase tracking-tighter">{t("theme.palette")}</span>
                <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 group-hover:scale-110 transition-transform" />
            </motion.button>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-brand-secondary/70 backdrop-blur-sm z-[200]" />
                        <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[210] flex flex-col">
                            <div className="p-6 border-b border-surface-muted flex items-center justify-between">
                                <span className="font-serif text-xl font-bold tracking-tight text-brand-secondary">Coop<span className="text-brand-primary">Label</span></span>
                                <button onClick={() => setIsMenuOpen(false)}><X className="w-5 h-5" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">{t("common.navigation")}</p>
                                    <div className="space-y-1">
                                        {navigation.map((nav) => (
                                            <Link key={nav.href} to={nav.href} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-brand-secondary hover:bg-brand-primary hover:text-white transition-colors">{nav.name}</Link>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">{t("common.services")}</p>
                                    <div className="space-y-1">
                                        {serviceLinks.map((s) => (
                                            <Link key={s.href} to={s.href} onClick={() => setIsMenuOpen(false)} className="block px-8 py-2.5 text-xs font-bold text-brand-secondary hover:text-brand-primary transition-colors">{s.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-surface-base border-t border-surface-muted">
                                <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="btn-paper w-full flex justify-center py-4">{t("pricing.upgrade_cta") || "Devenir PRO"}</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditorialHeader;
