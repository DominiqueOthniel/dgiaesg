import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "nav.home", href: "/" },
  { key: "nav.labels", href: "/labels" },
  { key: "nav.directory", href: "/directory" },
  { key: "nav.news", href: "/news" },
  { key: "nav.events", href: "/events" },
  { key: "nav.multimedia", href: "/multimedia" },
  { key: "nav.kiosk", href: "/kiosk" },
];

const SiteLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border"
            : "bg-background"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground leading-none">
                  Co-op Label
                </span>
                <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
                  Excellence Certifiée
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            {/* Login CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t("nav.login")}
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
              <Link
                to="/login"
                className="block mt-2 px-3 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg text-center"
              >
                {t("nav.login")}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">Co-op Label</span>
              </div>
              <p className="text-sm text-primary-foreground/60 max-w-sm leading-relaxed">
                Plateforme panafricaine de certification et de promotion de l'excellence coopérative et entrepreneuriale.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-primary-foreground/80">Navigation</h4>
              <div className="space-y-2.5">
                {navItems.slice(0, 5).map((item) => (
                  <Link key={item.href} to={item.href} className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-primary-foreground/80">Ressources</h4>
              <div className="space-y-2.5">
                {navItems.slice(5).map((item) => (
                  <Link key={item.href} to={item.href} className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-primary-foreground/10 text-center">
            <p className="text-xs text-primary-foreground/40">
              © {new Date().getFullYear()} Co-op Label. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
