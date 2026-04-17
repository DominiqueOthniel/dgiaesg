import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, ShieldCheck, User, LogOut, LayoutDashboard, Settings, ChevronRight, BookOpen, Play, Star, Calendar, Building2, Headphones, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";

const topNavItems = [
  { key: "nav.labels", href: "/labels", icon: ShieldCheck },
  { key: "nav.directory", href: "/directory", icon: Building2 },
  { key: "nav.news", href: "/news", icon: BookOpen },
  { key: "nav.kiosk", href: "/kiosk", icon: BookOpen },
  { key: "nav.mediatique", href: "/mediatique", icon: Headphones },
];

const sidebarItems = [
  { midhead: "Plateforme Logicielle" },
  { key: "nav.labels", href: "/labels", icon: ShieldCheck },
  { key: "nav.directory", href: "/directory", icon: Building2 },
  { midhead: "Espace Media" },
  { key: "nav.kiosk", href: "/kiosk", icon: BookOpen },
  { key: "nav.multimedia", href: "/multimedia", icon: Play },
  { midhead: "Services & Accès" },
  { key: "nav.pricing", href: "/pricing", icon: Star },
];

const SiteLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("fr") ? "en" : "fr";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ═══ SIDEBAR DRAWER ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[60] cursor-crosshair"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[320px] bg-background border-r border-border z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                   </div>
                   <span className="font-black text-sm uppercase tracking-tighter italic italic">System Menu</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {sidebarItems.map((item, idx) => (
                  item.midhead ? (
                    <p key={idx} className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pt-6 pb-2 px-4">{item.midhead}</p>
                  ) : (
                    <Link
                      key={item.href}
                      to={item.href!}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold transition-all group",
                        location.pathname === item.href
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
                        {t(item.key!)}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  )
                ))}
              </div>

              {/* Sidebar Auth State */}
              <div className="p-4 border-t border-border mt-auto">
                <button onClick={toggleLanguage} className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-xl text-[10px] font-black uppercase mb-3">
                    <span>Langue Système</span>
                    <span className="text-primary">{i18n.language.toUpperCase()}</span>
                </button>
                {!isAuthenticated ? (
                  <Link to="/login" className="flex items-center justify-center w-full py-4 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    S'Authentifier
                  </Link>
                ) : (
                   <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-4 bg-destructive/10 text-destructive rounded-xl text-xs font-black uppercase tracking-widest">
                     <LogOut className="w-4 h-4" /> Déconnexion
                   </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border"
            : "bg-background"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Left: Sandwich & Logo */}
            <div className="flex items-center gap-2 md:gap-6">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-xl transition-colors group"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                  <ShieldCheck className="w-7 h-7 text-brand-gold" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-base font-black tracking-tight text-foreground uppercase leading-none">
                    Co-op Label
                  </span>
                  <span className="text-[9px] font-black text-muted-foreground tracking-widest uppercase mt-1">
                    Africa Certified
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Simplified Desktop Nav (4 items) */}
            <nav className="hidden lg:flex items-center gap-2">
              {topNavItems.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.key}
                    to={it.href}
                    className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest text-foreground bg-transparent border border-transparent hover:bg-brand-gold hover:border-brand-gold-dark/40 hover:shadow-md hover:shadow-brand-gold/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" />
                    <span className="text-foreground">{t(it.key)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-2 bg-muted rounded-2xl hover:bg-muted/80 transition-all border border-border"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="hidden sm:block text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none">{user?.username}</p>
                       <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Espace Pro</p>
                    </div>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                      >
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
                          </Link>
                        )}
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-muted transition-all">
                          <Settings className="w-4 h-4" /> Paramètres
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all mt-1 pt-3 border-t border-border"
                        >
                          <LogOut className="w-4 h-4" /> Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <button className="p-2 text-foreground/70 hover:text-primary transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <Link to="/login" className="hidden sm:block text-xs font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                    Se connecter
                  </Link>
                  <Link to="/signup" className="px-6 py-2.5 bg-brand-gold text-brand-gold-foreground text-[10px] font-black uppercase tracking-[0.15em] rounded-full hover:brightness-110 transition-all shadow-lg shadow-brand-gold/20 active:scale-95">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer (Preserved) */}
      <footer className="bg-foreground text-primary-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-12 lg:col-span-5">
              <div className="flex items-center gap-3 mb-8 group">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                  <ShieldCheck className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                   <span className="text-xl md:text-2xl font-black italic block">Co-op Label</span>
                   <span className="text-[10px] font-bold text-primary-foreground/40 uppercase tracking-[0.3em]">Infrastructure d'Excellence</span>
                </div>
              </div>
              <p className="text-base text-primary-foreground/60 max-w-sm leading-relaxed font-medium">
                La référence panafricaine pour la certification et l'accompagnement des structures à fort impact.
              </p>
            </div>
            
            <div className="md:col-span-4 lg:col-span-2 lg:ml-auto">
              <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-primary">Plateforme</h4>
              <div className="flex flex-col gap-4">
                {topNavItems.map((item) => (
                  <Link key={item.href} to={item.href} className="text-sm font-bold text-primary-foreground/40 hover:text-primary transition-colors">
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 lg:col-span-2">
              <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-primary">Media</h4>
              <div className="flex flex-col gap-4">
                <Link to="/kiosk" className="text-sm font-bold text-primary-foreground/40 hover:text-primary transition-colors">{t("nav.kiosk")}</Link>
                <Link to="/multimedia" className="text-sm font-bold text-primary-foreground/40 hover:text-primary transition-colors">{t("nav.multimedia")}</Link>
                <Link to="/pricing" className="text-sm font-bold text-primary-foreground/40 hover:text-primary transition-colors">Premium</Link>
              </div>
            </div>

            <div className="md:col-span-4 lg:col-span-3">
              <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-primary">Newsletter</h4>
              <p className="text-xs text-primary-foreground/40 font-bold mb-6">Analyses stratégiques mensuelles anonymisées.</p>
              <form className="relative">
                 <input type="email" placeholder="EMAIL_ID@RESEAU" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs placeholder:text-white/20 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold" />
                 <button className="absolute right-1 top-1 bottom-1 px-4 bg-primary text-primary-foreground rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">S'inscrire</button>
              </form>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-primary-foreground/20 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} Co-op Label — Infrastructure d'Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
