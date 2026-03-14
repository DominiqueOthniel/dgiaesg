import { useState, useEffect, useRef, type WheelEvent } from "react";
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
  Bookmark,
  ChevronRight,
  LayoutDashboard,
  Play,
  User,
  LogOut,
  Crown,
  Calendar,
  Palette
} from "lucide-react";
import { searchEntities } from "../services/SearchService";
import type { SearchResults } from "../services/SearchService";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { cn, getLocalized } from "../lib/utils";
import { useTranslation } from "react-i18next";
import NewsTicker from "./NewsTicker";
import { NewsletterPopup } from "./NewsletterPopup";
import { useAuth } from "../context/AuthContext";
import AdBanner from "./AdBanner";
import ThemePicker from "./Editorial/ThemePicker";

const navigation = [
  { name: "Accueil", href: "/", icon: ShieldCheck },
  {
    name: "Secteurs",
    href: "#",
    children: [
      { name: "ESG & Finance", href: "/news/sector/finance" },
      { name: "RSE & Gouvernance", href: "/news/sector/governance" },
      { name: "Tech & Durable", href: "/news/sector/tech" },
      { name: "Énergie & Bio", href: "/news/sector/energy" },
      { name: "Leadership & Impact", href: "/news/sector/leadership" }
    ]
  },
  { name: "Labels", href: "/labels", icon: Award },
  { name: "Annuaire", href: "/directory", icon: Users },
  { name: "Journal", href: "/news", icon: Newspaper },
  { name: "Médiatique", href: "/multimedia", icon: Play },
  { name: "Kiosque", href: "/kiosk", icon: Bookmark },
  { name: "Événements", href: "/events", icon: Calendar },
  { name: "Premium", href: "/pricing", icon: Crown }
];

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSector, setSearchSector] = useState("all");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectorsRef = useRef<HTMLDivElement>(null);
  const [sectorsPos, setSectorsPos] = useState({ left: 0, top: 0 });
  const [isSectorsOpen, setIsSectorsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowSearchResults(false);
    setSearchQuery("");
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [location]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const results = await searchEntities({
        query: searchQuery,
        sector: searchSector
      });
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavWheel = (event: WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = Math.max(240, Math.floor(scrollRef.current.clientWidth * 0.9));
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const updateSectorsPos = () => {
    if (sectorsRef.current) {
      const rect = sectorsRef.current.getBoundingClientRect();
      setSectorsPos({ left: rect.left, top: rect.bottom });
    }
  };

  const UserMenu = () => {
    if (!isAuthenticated) {
      return (
        <Link to="/login" className="hidden lg:flex items-center gap-2 group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-primary transition-colors">Se connecter</span>
          <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-all shadow-tactile-sm">
            <User className="w-4 h-4" />
          </div>
        </Link>
      );
    }

    return (
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-4 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100 hover:border-brand-primary/30 transition-all group"
        >
          <div className="text-right hidden lg:block pl-3 border-l-2 border-brand-primary/10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-left">Bonjour,</p>
            <p className="text-xs font-black text-brand-secondary group-hover:text-brand-primary transition-colors uppercase tracking-tight italic">{user?.name}</p>
          </div>
          <div className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl transition-all border relative",
            user?.isPro ? "bg-amber-50 border-amber-200" : "bg-brand-primary/10 border-brand-primary/20"
          )}>
            {user?.isPro && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-lg shadow-lg flex items-center justify-center border-2 border-white z-10 animate-pulse">
                <Crown className="w-2.5 h-2.5 text-white fill-white" />
              </div>
            )}
            <User className={cn("w-4 h-4", user?.isPro ? "text-amber-600" : "text-brand-primary group-hover:text-white")} />
          </div>
        </button>

        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-tactile border border-brand-primary/10 p-2 z-50 overflow-hidden"
            >
              <div className={cn("p-6 rounded-[1.5rem] mb-2", user?.isPro ? "bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border border-amber-200/20" : "bg-brand-primary/5")}>
                <div className="flex items-center justify-between mb-1">
                  <p className={cn("text-[10px] font-black uppercase tracking-widest", user?.isPro ? "text-amber-600" : "text-brand-primary")}>
                    {user?.isPro ? "MEMBRE PRIVILÈGE PRO" : user?.role}
                  </p>
                  {user?.isPro && <Crown className="w-3 h-3 text-amber-500" />}
                </div>
                <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-brand-primary transition-all group"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Mon Profil</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-brand-primary transition-all group"
                >
                  <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">Dashboard Admin</span>
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Déconnexion</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      <NewsTicker />
      <NewsletterPopup />
      {/* Professional Header */}
      <header
        className={cn(
          "sticky top-8 z-50 w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-3 border-slate-200 shadow-lg shadow-slate-200/20"
            : "bg-white py-5 border-slate-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
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

            {/* Desktop Navigation Container */}
            <nav className="hidden md:flex flex-1 min-w-0 relative group/nav-container items-center" aria-label="Primary">
              {/* Scroll Controls */}
              <button
                onClick={() => scrollNav('left')}
                className="absolute left-0 z-20 p-1.5 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full shadow-md opacity-0 group-hover/nav-container:opacity-100 transition-opacity hover:bg-brand-primary hover:text-white"
                aria-label="Scroll left"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              
              <button
                onClick={() => scrollNav('right')}
                className="absolute right-0 z-20 p-1.5 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full shadow-md opacity-0 group-hover/nav-container:opacity-100 transition-opacity hover:bg-brand-primary hover:text-white"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Fade masks for scroll indications */}
              <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-white/95 to-transparent z-10 pointer-events-none opacity-0 group-hover/nav-container:opacity-100 transition-opacity" />
              <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-white/95 to-transparent z-10 pointer-events-none opacity-0 group-hover/nav-container:opacity-100 transition-opacity" />

              <div
                ref={scrollRef}
                className="flex-1 overflow-x-auto no-scrollbar scroll-smooth overscroll-x-contain touch-pan-x flex items-center snap-x snap-mandatory scroll-px-4 max-w-[520px] w-full"
                onWheel={handleNavWheel}
                style={{ marginInline: "auto" }}
              >
                <div className="flex items-center gap-1 min-w-max px-4">
                {navigation.map((item) => {
                  const isActive = item.href === "/"
                    ? location.pathname === "/"
                    : item.href !== "#"
                      ? location.pathname.startsWith(item.href)
                      : false;
                  if (item.children) {
                    return (
                      <div 
                        key={item.name} 
                        className="relative group/nav shrink-0 min-w-[130px] snap-start snap-always"
                        ref={item.name === "Secteurs" ? sectorsRef : undefined}
                        onMouseEnter={() => {
                          if (item.name === "Secteurs") {
                            updateSectorsPos();
                            setIsSectorsOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (item.name === "Secteurs") setIsSectorsOpen(false);
                        }}
                      >
                        <button
                          className="w-full px-4 py-2 rounded-md text-sm font-bold text-text-muted hover:text-brand-primary flex items-center justify-center gap-1 transition-all"
                        >
                          {item.name} <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                        </button>
                        {/* The dropdown is now fixed to avoid clipping */}
                        {item.name !== "Secteurs" && (
                          <div className="absolute top-full left-0 w-56 bg-white border border-slate-100 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-300 p-2 z-[70]">
                            {item.children.map(child => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="block px-4 py-2 text-xs font-bold text-slate-600 hover:text-brand-primary hover:bg-slate-50 rounded-lg transition-all"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-bold transition-all shrink-0 min-w-[130px] text-center snap-start snap-always",
                        isActive
                          ? "text-brand-primary bg-brand-primary/5"
                          : "text-text-muted hover:text-brand-primary hover:bg-slate-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                </div>
              </div>
            </nav>

            {/* Desktop search removed to free space */}

            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => setIsThemePickerOpen(true)}
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                aria-label="Choose color palette"
              >
                <Palette className="w-4 h-4 text-brand-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Palette</span>
              </button>
              {isAuthenticated && (
                <Link to="/library" className="hidden lg:flex items-center gap-2 text-xs font-black text-brand-secondary hover:text-brand-primary transition-all uppercase tracking-widest italic pt-1 group">
                  <Bookmark className="w-4 h-4 text-brand-primary group-hover:fill-brand-primary transition-all" /> Ma Bibliothèque
                </Link>
              )}

              <UserMenu />

              {/* Mobile Menu Toggle */}
              <button
                className="p-2 text-text-muted hover:text-brand-primary hover:bg-slate-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Open menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

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
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-brand-secondary">Résultats pour "{searchQuery}"</h3>
                  <button
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchSector("all");
                    }}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-text-light" />
                  </button>
                </div>

                {/* Sector Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['all', 'finance', 'governance', 'tech', 'energy', 'leadership'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSearchSector(s);
                        // Re-trigger search immediately
                        searchEntities({ query: searchQuery, sector: s })
                          .then(setSearchResults)
                          .catch(console.error);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                        searchSector === s
                          ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                          : "bg-slate-50 text-slate-400 border-slate-200 hover:border-brand-primary/30"
                      )}
                    >
                      {s === 'all' ? 'Tous les secteurs' : s}
                    </button>
                  ))}
                </div>

                {isSearching ? (
                  <div className="flex items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
                    <span className="text-lg font-medium text-text-muted">Recherche en cours...</span>
                  </div>
                ) : searchResults && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Labels */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-text-light uppercase tracking-widest">
                        <Award className="w-4 h-4" /> Labels ({searchResults.labels.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.labels.length > 0 ? searchResults.labels.map((l: any) => (
                          <Link key={l._id} to={`/labels/${l._id}`} className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                            <p className="font-semibold text-text-main group-hover:text-brand-primary transition-colors">{getLocalized(l.name, i18n.language)}</p>
                            <p className="text-xs text-text-muted mt-0.5">{getLocalized(l.sector, i18n.language)}</p>
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
                          <Link key={c._id} to={`/directory?search=${getLocalized(c.name, i18n.language)}`} className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                            <p className="font-semibold text-text-main group-hover:text-brand-primary transition-colors">{getLocalized(c.name, i18n.language)}</p>
                            <p className="text-xs text-text-muted mt-0.5">{getLocalized(c.region, i18n.language)} • {getLocalized(c.sector, i18n.language)}</p>
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
                            <p className="font-semibold text-text-main group-hover:text-brand-primary transition-colors line-clamp-1">{getLocalized(n.title, i18n.language)}</p>
                            <p className="text-xs text-text-muted mt-0.5">Par {n.author}</p>
                          </Link>
                        )) : <p className="text-xs text-text-light italic">Aucun résultat</p>}
                      </div>
                    </div>

                    {/* Multimedia */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-text-light uppercase tracking-widest">
                        <Play className="w-4 h-4" /> Multimédia ({searchResults.multimedia?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.multimedia && searchResults.multimedia.length > 0 ? searchResults.multimedia.map((m: any) => (
                          <Link key={m._id} to={`/news`} className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                            <p className="font-semibold text-text-main group-hover:text-brand-primary transition-colors line-clamp-1">{getLocalized(m.title, i18n.language)}</p>
                            <p className="text-xs text-text-muted mt-0.5 capitalize">{m.type} • {getLocalized(m.sector, i18n.language)}</p>
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
      <ThemePicker forcedOpen={isThemePickerOpen} onClose={() => setIsThemePickerOpen(false)} />

      {/* Secteurs Dropdown (Fixed to avoid clipping) */}
      <AnimatePresence>
        {isSectorsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed w-64 bg-white border border-slate-100 rounded-xl shadow-2xl p-2 z-[100]"
            style={{ 
              left: sectorsPos.left, 
              top: sectorsPos.top + 4 
            }}
            onMouseEnter={() => setIsSectorsOpen(true)}
            onMouseLeave={() => setIsSectorsOpen(false)}
          >
            {navigation.find(n => n.name === "Secteurs")?.children?.map(child => (
              <Link
                key={child.name}
                to={child.href}
                className="block px-4 py-2 text-xs font-bold text-slate-600 hover:text-brand-primary hover:bg-slate-50 rounded-lg transition-all"
                onClick={() => setIsSectorsOpen(false)}
              >
                {child.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation (Outside header) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[70]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white border-r border-slate-100 shadow-2xl z-[80] overflow-y-auto"
            >
              <div className="px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Navigation</span>
                  <button
                    className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
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

                {/* Mobile Sector Filters */}
                <div className="flex flex-wrap gap-2 mb-6 px-1">
                  {['all', 'finance', 'governance', 'tech', 'energy', 'leadership'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSearchSector(s)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                        searchSector === s
                          ? "bg-brand-primary text-white border-brand-primary"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      )}
                    >
                      {s === 'all' ? 'Tous' : s}
                    </button>
                  ))}
                </div>
                {navigation.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <Link
                      to={item.href}
                      className="flex items-center gap-4 p-3 rounded-lg text-lg font-black text-brand-secondary hover:bg-slate-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                    >
                      {item.icon && <item.icon className="w-5 h-5 text-brand-accent" />}
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="pl-12 grid grid-cols-1 gap-2">
                        {item.children.map(child => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="text-sm font-bold text-slate-500 py-1 hover:text-brand-primary"
                            onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button variant="primary" className="w-full py-4 text-base">Se Connecter</Button>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full py-4 text-base">Créer un compte</Button>
                      </Link>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-lg mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Active</p>
                        <p className="text-lg font-bold text-brand-secondary">{user?.name}</p>
                        <p className="text-xs font-medium text-slate-500">{user?.email}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          to="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-lg hover:border-brand-primary transition-colors group"
                        >
                          <User className="w-5 h-5 text-slate-400 group-hover:text-brand-primary transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Profil</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-lg hover:border-red-500 transition-colors group"
                        >
                          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Quitter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 pt-[144px] sm:pt-[156px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner position="top" />
        </div>
        <Outlet />
      </main>
      {/* Footer promo blocks removed to avoid repeating events/newsletters on every page */}
{/* Modern Footer */}
      <footer className="bg-brand-secondary text-white pt-20 pb-10 mt-0">
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


