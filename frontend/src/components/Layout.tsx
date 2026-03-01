import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Award,
  Users,
  Newspaper,
  ShieldCheck,
  Search,
  Loader2,
  ChevronRight
} from "lucide-react";
import { searchEntities } from "../services/SearchService";
import type { SearchResults } from "../services/SearchService";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Accueil", href: "/", icon: ShieldCheck },
  { name: "Labels", href: "/labels", icon: Award },
  { name: "Annuaire", href: "/directory", icon: Users },
  { name: "Actualités", href: "/news", icon: Newspaper },
];

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowSearchResults(false);
    setSearchQuery("");
  }, [location]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const results = await searchEntities(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      {/* Professional Header */}
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/90 backdrop-blur-md py-3 border-slate-200 shadow-sm"
            : "bg-transparent py-5 border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center shadow-sm">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold text-brand-secondary leading-tight">
                  CoopLabel
                </span>
                <span className="text-[10px] font-medium text-brand-accent uppercase tracking-wider">
                  Certification Plateforme
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "text-brand-primary bg-brand-primary/5"
                        : "text-text-muted hover:text-brand-primary hover:bg-slate-50"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Search & Actions */}
            <div className="flex-1 max-w-sm hidden lg:block">
              <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light group-focus-within:text-brand-accent transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un label, une société..."
                  className="w-full bg-slate-100/50 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-full pl-10 pr-4 py-2 text-sm transition-all outline-none"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-brand-accent" />
                )}
              </form>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="rounded-full">
                  Se connecter
                </Button>
              </Link>
              <Link to="/directory" className="hidden lg:block">
                <Button variant="primary" size="sm" className="rounded-full">
                  Consulter l'annuaire
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-text-muted hover:text-brand-primary hover:bg-slate-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
            >
              <div className="px-4 py-6 space-y-4">
                <form onSubmit={handleSearch} className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
                  />
                </form>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-4 p-3 rounded-lg text-lg font-semibold text-text-main hover:bg-slate-50 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-brand-accent" />
                    {item.name}
                  </Link>
                ))}
                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                  <Link to="/login">
                    <Button variant="primary" className="w-full py-4 text-base">Espace Membre</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Professional Search Results */}
        <AnimatePresence>
          {showSearchResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 mt-4 overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-brand-secondary">Résultats pour "{searchQuery}"</h3>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-text-light" />
                  </button>
                </div>

                {isSearching ? (
                  <div className="flex items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
                    <span className="text-lg font-medium text-text-muted">Recherche en cours...</span>
                  </div>
                ) : searchResults && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Labels */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-text-light uppercase tracking-widest">
                        <Award className="w-4 h-4" /> Labels ({searchResults.labels.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.labels.length > 0 ? searchResults.labels.map((l: any) => (
                          <Link key={l._id} to={`/labels/${l._id}`} className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                            <p className="font-semibold text-text-main group-hover:text-brand-primary transition-colors">{l.name}</p>
                            <p className="text-xs text-text-muted mt-0.5">{l.sector}</p>
                          </Link>
                        )) : <p className="text-xs text-text-light italic">Aucun résultat</p>}
                      </div>
                    </div>

                    {/* Companies */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-text-light uppercase tracking-widest">
                        <Users className="w-4 h-4" /> Entreprises ({searchResults.companies.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.companies.length > 0 ? searchResults.companies.map((c: any) => (
                          <Link key={c._id} to={`/directory?search=${c.name}`} className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                            <p className="font-semibold text-text-main group-hover:text-brand-primary transition-colors">{c.name}</p>
                            <p className="text-xs text-text-muted mt-0.5">{c.region} • {c.sector}</p>
                          </Link>
                        )) : <p className="text-xs text-text-light italic">Aucun résultat</p>}
                      </div>
                    </div>

                    {/* News */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-text-light uppercase tracking-widest">
                        <Newspaper className="w-4 h-4" /> Actualités ({searchResults.news.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.news.length > 0 ? searchResults.news.map((n: any) => (
                          <Link key={n._id} to={`/news/${n.slug}`} className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                            <p className="font-semibold text-text-main group-hover:text-brand-primary transition-colors line-clamp-1">{n.title}</p>
                            <p className="text-xs text-text-muted mt-0.5">Par {n.author}</p>
                          </Link>
                        )) : <p className="text-xs text-text-light italic">Aucun résultat</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setShowSearchResults(false)}>
                    Fermer les résultats
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-[72px] sm:pt-[84px]">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <footer className="bg-brand-secondary text-white pt-20 pb-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
            {/* Identity */}
            <div className="lg:col-span-1 space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight">CoopLabel</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                La plateforme de référence pour la certification et l'annuaire des coopératives engagées vers l'excellence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-brand-accent uppercase tracking-wider mb-6">Navigation</h4>
              <ul className="space-y-4">
                {navigation.map(item => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold text-brand-accent uppercase tracking-wider mb-6">Expertise</h4>
              <ul className="space-y-4 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Notre Démarche</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Labellisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Critères Clés</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Impact Social</a></li>
              </ul>
            </div>

            {/* Contact / Portal */}
            <div>
              <h4 className="text-sm font-bold text-brand-accent uppercase tracking-wider mb-6">Membres</h4>
              <ul className="space-y-4 text-slate-300">
                <li><Link to="/login" className="hover:text-white transition-colors">Accès Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Technique</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions Légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-500 text-xs font-medium">
            <p>© {new Date().getFullYear()} CoopLabel — Solution Professionnelle Certifiée.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Système Opérationnel
              </span>
              <span className="hidden sm:inline">v2.1.0-STABLE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
