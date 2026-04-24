import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, ShieldCheck, LogOut, ChevronRight, BookOpen, Play, Star, Building2, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChatbotWidget } from "./ChatbotWidget";

import { SiteHeader, topNavItems } from "./coop/SiteHeader";

const SiteLayout = () => {
  const { t, i18n } = useTranslation();

  const sidebarItems = useMemo(
    () => [
      { midhead: t("footer.sidebar_mid_platform") },
      { key: "nav.labels", href: "/labels", icon: ShieldCheck },
      { key: "nav.directory", href: "/directory", icon: Building2 },
      { key: "nav.news", href: "/news", icon: Newspaper },
      { midhead: t("footer.sidebar_mid_media") },
      { key: "nav.kiosk", href: "/kiosk", icon: BookOpen },
      { key: "nav.multimedia", href: "/multimedia", icon: Play },
      { midhead: t("footer.sidebar_mid_services") },
      { key: "nav.pricing", href: "/pricing", icon: Star },
    ],
    [t, i18n.language],
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
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
                   <span className="font-black text-sm uppercase tracking-tighter italic italic">
                     {t("footer.sidebar_system_menu")}
                   </span>
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
                    <span>{t("footer.sidebar_lang")}</span>
                    <span className="text-primary">{i18n.language.toUpperCase()}</span>
                </button>
                {!isAuthenticated ? (
                  <Link to="/login" className="flex items-center justify-center w-full py-4 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    {t("footer.sidebar_sign_in")}
                  </Link>
                ) : (
                   <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-4 bg-destructive/10 text-destructive rounded-xl text-xs font-black uppercase tracking-widest">
                     <LogOut className="w-4 h-4" /> {t("footer.sidebar_sign_out")}
                   </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SiteHeader scrolled={scrolled} onMenuClick={() => setSidebarOpen(true)} />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer — Redesigned Premium Dark Theme */}
      <footer className="relative bg-gradient-to-br from-brand-deep via-brand-dark to-brand-forest text-white mt-auto overflow-hidden">
        {/* Decorative aurora lights */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-brand-emerald/25 blur-[120px] animate-aurora-slow" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-brand-gold/15 blur-[120px] animate-aurora" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-12 lg:col-span-5">
              <div className="flex items-center gap-3 mb-8 group">
                <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-gold/40">
                  <ShieldCheck className="w-7 h-7 text-brand-dark" />
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-black italic block text-white uppercase tracking-tight">
                    DGIA ESG
                  </span>
                  <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em]">
                    {t("footer.tagline_short")}
                  </span>
                </div>
              </div>
              <p className="text-base text-white/85 max-w-sm leading-relaxed font-medium">
                {t("footer.tagline_body")}
              </p>
            </div>

            <div className="md:col-span-4 lg:col-span-2 lg:ml-auto">
              <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-brand-gold">
                {t("footer.column_platform")}
              </h4>
              <div className="flex flex-col gap-4">
                {topNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 lg:col-span-2">
              <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-brand-gold">
                {t("footer.column_media")}
              </h4>
              <div className="flex flex-col gap-4">
                <Link to="/kiosk" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                  {t("nav.kiosk")}
                </Link>
                <Link to="/multimedia" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                  {t("nav.multimedia")}
                </Link>
                <Link to="/pricing" className="text-sm font-bold text-white/80 hover:text-brand-gold transition-colors">
                  {t("nav.pricing")}
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 lg:col-span-3">
              <h4 className="text-[11px] font-black mb-8 uppercase tracking-[0.2em] text-brand-gold">
                {t("footer.column_newsletter")}
              </h4>
              <p className="text-xs text-white/75 font-bold mb-6">
                {t("footer.newsletter_desc")}
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  // Existing submission logic elsewhere or can be added here
                }}
                className="relative"
              >
                <input
                  type="email"
                  placeholder={t("footer.email_placeholder")}
                  className="w-full bg-white/10 border border-white/25 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all font-bold"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-4 bg-brand-gold text-brand-dark rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-gold/30"
                >
                  {t("footer.subscribe")}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-white/15 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} DGIAESG — {t("footer.copyright_suffix")}
            </p>
          </div>
        </div>
      </footer>

      {/* Global UI widgets */}
      <ChatbotWidget />
    </div>
  );
};

export default SiteLayout;
