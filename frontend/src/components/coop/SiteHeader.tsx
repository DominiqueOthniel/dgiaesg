import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Menu,
  ShieldCheck,
  Building2,
  MapPin,
  Factory,
  Database,
  BookOpen,
  Headphones,
  Crown,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../Logo";

export const topNavItems = [
  { key: "nav.labels", href: "/labels", icon: ShieldCheck },
  { key: "nav.directory", href: "/directory", icon: Building2 },
  { key: "nav.countries", href: "/pays", icon: MapPin },
  { key: "nav.companies", href: "/entreprises", icon: Factory },
  { key: "nav.data", href: "/donnees", icon: Database },
  { key: "nav.news", href: "/news", icon: BookOpen },
  { key: "nav.kiosk", href: "/revue", icon: BookOpen },
  { key: "nav.mediatique", href: "/mediatique", icon: Headphones },
  { key: "nav.pricing", href: "/pricing", icon: Crown },
];

/**
 * SiteHeader — extracted from SiteLayout.
 */
export const SiteHeader = ({
  onMenuClick,
  scrolled,
}: {
  onMenuClick: () => void;
  scrolled: boolean;
}) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border"
          : "bg-background"
      )}
    >
      <div className="max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center h-20 gap-2 xl:gap-4">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="group -mt-1">
              <Logo className="scale-95 origin-left" />
            </Link>
          </div>

          {/* Center: Desktop Nav — Optimized for no-scroll */}
          <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-0.5 xl:gap-1 px-1">
            {topNavItems.map((it) => {
              const Icon = it.icon;
              const isActive = it.href === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(it.href);

              return (
                <Link
                  key={it.key}
                  to={it.href}
                  className={cn(
                    "group inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-full text-[9px] xl:text-[10px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 whitespace-nowrap",
                    isActive 
                      ? "bg-brand-gold text-brand-dark shadow-lg -translate-y-0.5" 
                      : "text-foreground/80 bg-transparent hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-300",
                    isActive ? "text-brand-dark" : "text-foreground/40 group-hover:text-foreground group-hover:scale-110"
                  )} />
                  <span>{t(it.key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions + sandwich */}
          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0 ml-auto">
            <button className="p-2 text-foreground/70 hover:text-primary transition-colors shrink-0">
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-2 bg-muted rounded-2xl hover:bg-muted/80 transition-all border border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="hidden 2xl:block text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                      {user?.username}
                    </p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {t("nav.pro_space")}
                    </p>
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
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                          Admin
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-muted transition-all"
                      >
                        <Settings className="w-4 h-4" /> {t("nav.settings")}
                      </Link>
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all mt-1 pt-3 border-t border-border"
                      >
                        <LogOut className="w-4 h-4" /> {t("nav.logout")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 pl-2 pr-3 py-2 bg-muted rounded-2xl hover:bg-muted/80 transition-all border border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="hidden 2xl:block text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                      {t("nav.login")}
                    </p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {t("nav.pro_space")}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Sandwich moved here — behind the Profile/Action block */}
            <button
              onClick={onMenuClick}
              className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-xl transition-colors group"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
