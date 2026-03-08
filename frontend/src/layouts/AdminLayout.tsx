import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Award,
    Building2,
    FileText,
    Newspaper,
    LogOut,
    Menu,
    X,
    User,
    ShieldCheck,
    Search,
    Loader2,
    Bell,
    Play,
    Megaphone,
    Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { useState, useEffect, useRef } from 'react';
import { searchEntities } from '../services/SearchService';
import type { SearchResults } from '../services/SearchService';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchSector, setSearchSector] = useState("all");
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const mainContentRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowSearchResults(false);
        setSearchQuery("");
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navGroups = [
        {
            title: 'Pilotage',
            items: [
                { name: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
            ]
        },
        {
            title: 'Certification',
            items: [
                { name: 'Référentiels Labels', path: '/admin/labels', icon: Award },
                { name: 'Annuaire Sociétés', path: '/admin/companies', icon: Building2 },
                { name: 'Critères d\'Audit', path: '/admin/criteria', icon: FileText },
            ]
        },
        {
            title: 'Média',
            items: [
                { name: 'Gestion Actualités', path: '/admin/news', icon: Newspaper },
                { name: 'Multimédia TV/Podcast', path: '/admin/multimedia', icon: Play },
                { name: 'Flash Live', path: '/admin/breaking', icon: ShieldCheck },
                { name: 'Kiosque Digital', path: '/admin/reviews', icon: FileText },
            ]
        },
        {
            title: 'Monétisation',
            items: [
                { name: 'Gestion Publicité', path: '/admin/ads', icon: Megaphone },
                { name: 'Abonnements PRO', path: '/admin/subscriptions', icon: Zap },
            ]
        }
    ];

    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar Desktop */}
            <aside
                className={cn(
                    "bg-brand-secondary text-slate-300 transition-all duration-300 hidden lg:flex flex-col z-50 shrink-0 border-r border-white/5 h-full",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="h-16 flex items-center px-6 gap-3 border-b border-white/5">
                    <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center text-white shrink-0 shadow-sm">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-white leading-none">Console Admin</span>
                            <span className="text-[10px] text-brand-accent uppercase font-bold tracking-widest mt-1">Management</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto scrollbar-hide">
                    {navGroups.map((group) => (
                        <div key={group.title} className="space-y-2">
                            {isSidebarOpen && (
                                <h3 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {group.title}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md transition-all group relative",
                                                isActive
                                                    ? "bg-brand-accent text-white font-medium"
                                                    : "hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-slate-500")} />
                                            {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                                            {isActive && isSidebarOpen && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/50" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 bg-black/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 w-full rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {isSidebarOpen && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main Surface */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-50 rounded-md transition-colors hidden lg:block"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-50 rounded-md transition-colors lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-2 hidden lg:block" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Utilisateur</span>
                            <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-8 hidden sm:block">
                        <form onSubmit={handleSearch} className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher une entité..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-full transition-all outline-none"
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-brand-accent" />
                            )}
                        </form>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/" className="hidden lg:block text-xs font-semibold text-brand-accent bg-brand-accent/5 px-3 py-1.5 rounded-full hover:bg-brand-accent/10 transition-colors">
                            Voir le portail public
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                </header>

                {/* Content Overlay for Search Results */}
                <AnimatePresence>
                    {showSearchResults && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-16 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white z-50 shadow-2xl max-h-[80vh] overflow-y-auto"
                        >
                            <div className="max-w-6xl mx-auto px-6 py-10">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                                    <h3 className="text-lg font-bold">Résultats d'administration pour "{searchQuery}"</h3>
                                    <button onClick={() => {
                                        setShowSearchResults(false);
                                        setSearchSector("all");
                                    }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Admin Sector Filters */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {['all', 'finance', 'governance', 'tech', 'energy', 'leadership'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setSearchSector(s);
                                                searchEntities({ query: searchQuery, sector: s })
                                                    .then(setSearchResults)
                                                    .catch(console.error);
                                            }}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                searchSector === s
                                                    ? "bg-brand-accent text-white border-brand-accent shadow-lg shadow-brand-accent/20"
                                                    : "bg-white/5 text-slate-400 border-white/10 hover:border-brand-accent/30"
                                            )}
                                        >
                                            {s === 'all' ? 'Tous les secteurs' : s}
                                        </button>
                                    ))}
                                </div>

                                {isSearching ? (
                                    <div className="flex items-center gap-4 py-20 justify-center opacity-50">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span className="text-lg">Interrogation de la base...</span>
                                    </div>
                                ) : searchResults && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                        {/* Labels */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Labels ({searchResults.labels.length})</h4>
                                            <div className="space-y-2">
                                                {searchResults.labels.length > 0 ? searchResults.labels.map((l: any) => (
                                                    <Link key={l._id} to={`/admin/labels`} className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-brand-accent/30 group">
                                                        <p className="font-bold group-hover:text-brand-accent transition-colors">{l.name}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{l.sector}</p>
                                                    </Link>
                                                )) : <p className="text-xs text-slate-500 italic">Aucun résultat</p>}
                                            </div>
                                        </div>

                                        {/* Companies */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sociétés ({searchResults.companies.length})</h4>
                                            <div className="space-y-2">
                                                {searchResults.companies.length > 0 ? searchResults.companies.map((c: any) => (
                                                    <Link key={c._id} to={`/admin/companies`} className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-brand-accent/30 group">
                                                        <p className="font-bold group-hover:text-brand-accent transition-colors">{c.name}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{c.region} — {c.sector}</p>
                                                    </Link>
                                                )) : <p className="text-xs text-slate-500 italic">Aucun résultat</p>}
                                            </div>
                                        </div>

                                        {/* News */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actualités ({searchResults.news.length})</h4>
                                            <div className="space-y-2">
                                                {searchResults.news.length > 0 ? searchResults.news.map((n: any) => (
                                                    <Link key={n._id} to={`/admin/news`} className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-brand-accent/30 group">
                                                        <p className="font-bold group-hover:text-brand-accent transition-colors line-clamp-1">{n.title}</p>
                                                        <p className="text-xs text-slate-400 mt-1">Par {n.author}</p>
                                                    </Link>
                                                )) : <p className="text-xs text-slate-500 italic">Aucun résultat</p>}
                                            </div>
                                        </div>

                                        {/* Multimedia */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Multimédia ({searchResults.multimedia?.length || 0})</h4>
                                            <div className="space-y-2">
                                                {searchResults.multimedia && searchResults.multimedia.length > 0 ? searchResults.multimedia.map((m: any) => (
                                                    <Link key={m._id} to={`/admin/multimedia`} className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-brand-accent/30 group">
                                                        <p className="font-bold group-hover:text-brand-accent transition-colors line-clamp-1">{m.title}</p>
                                                        <p className="text-xs text-slate-400 mt-1 capitalize">{m.type} • {m.sector}</p>
                                                    </Link>
                                                )) : <p className="text-xs text-slate-500 italic">Aucun résultat</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <div className="lg:hidden">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <motion.aside
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                className="fixed inset-y-0 left-0 w-72 bg-brand-secondary z-[70] flex flex-col"
                            >
                                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                                    <span className="font-bold text-white uppercase tracking-tighter">CoopLabel Admin</span>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto">
                                    {navGroups.map((group) => (
                                        <div key={group.title} className="space-y-3">
                                            <h3 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{group.title}</h3>
                                            <div className="space-y-1">
                                                {group.items.map((item) => (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className={cn(
                                                            "flex items-center gap-4 px-3 py-3 rounded-lg transition-colors",
                                                            location.pathname === item.path ? "bg-brand-accent text-white" : "text-slate-400 hover:bg-white/5"
                                                        )}
                                                    >
                                                        <item.icon className="w-5 h-5" />
                                                        <span className="text-base font-medium">{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </nav>
                                <div className="p-6 border-t border-white/5">
                                    <Button variant="destructive" className="w-full py-6" onClick={handleLogout}>
                                        Déconnexion
                                    </Button>
                                </div>
                            </motion.aside>
                        </div>
                    )}
                </AnimatePresence>

                {/* Main Page Area */}
                <main ref={mainContentRef} className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scrollbar-hide">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
