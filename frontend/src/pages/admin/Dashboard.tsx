import {
    Award,
    Building2,
    Newspaper,
    FileText,
    Users,
    ArrowUpRight,
    Plus,
    Activity,
    ChevronRight,
    Settings,
    LayoutDashboard,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLabels } from '../../hooks/useLabels';
import { useCompanies } from '../../hooks/useCompanies';
import { useNews } from '../../hooks/useNews';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const { data: labels } = useLabels();
    const { data: companiesData } = useCompanies({});
    const { data: newsData } = useNews({});

    const metrics = [
        {
            label: 'Protocoles Actifs',
            value: labels?.length || 0,
            icon: Award,
            trend: '+2 ce mois',
            color: 'text-brand-primary',
            bg: 'bg-brand-primary/10',
        },
        {
            label: 'Entités Certifiées',
            value: companiesData?.pagination?.total || 0,
            icon: Building2,
            trend: '+12% vs N-1',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Communiqués',
            value: newsData?.pagination?.total || 0,
            icon: Newspaper,
            trend: 'À jour',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Niveau d\'Accès',
            value: 'L3',
            icon: Users,
            trend: 'Admin Principal',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Institutional Dashboard Header */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            <LayoutDashboard className="w-3.5 h-3.5" /> Cockpit de Pilotage Institutionnel
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary leading-none">
                            Tableau de Bord
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xl">
                            Synthèse opérationnelle des certifications, des protocoles de validation et de la communication réseau.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button variant="outline" className="rounded-2xl h-14 px-8 border-slate-200 bg-white text-slate-500 hover:bg-slate-50 shadow-sm font-bold uppercase tracking-widest text-[10px]">
                            <FileText className="w-4 h-4 mr-3" /> Rapport d'Activité
                        </Button>
                        <Link to="/admin/companies">
                            <Button className="rounded-2xl h-14 px-10 bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 transition-all font-bold uppercase tracking-widest text-[11px]">
                                <Plus className="w-5 h-5 mr-3" /> Certifier une Entité
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Strategic Metrics Matrix */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {metrics.map((metric) => (
                    <motion.div key={metric.label} variants={item}>
                        <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
                            <CardContent className="p-10 flex flex-col gap-8">
                                <div className="flex justify-between items-start">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", metric.bg, metric.color)}>
                                        <metric.icon className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="rounded-full px-3 py-1 border-slate-100 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                                        {metric.trend}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-bold text-brand-secondary tracking-tight group-hover:text-brand-primary transition-colors">{metric.value}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Operational Analysis & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-[0.3em] flex items-center gap-3">
                            <Activity className="w-5 h-5 text-brand-primary" /> Flux d'Activité Réseau
                        </h2>
                        <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-primary">
                            Consulter les logs <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                    <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 bg-white min-h-[450px] overflow-hidden">
                        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-12 text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center relative">
                                <Activity className="w-8 h-8 text-brand-primary animate-pulse" />
                                <div className="absolute inset-0 border-2 border-brand-primary/20 rounded-[2rem] animate-ping" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-brand-secondary uppercase tracking-widest">Synchronisation des Flux</p>
                                <p className="text-[11px] font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">
                                    Récupération des derniers journaux de certification et mise à jour des statistiques sectorielles...
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Expiring Soon Widget */}
                    <div className="mt-10">
                        <div className="flex items-center justify-between px-2 mb-6">
                            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-[0.3em] flex items-center gap-3">
                                <Clock className="w-5 h-5 text-orange-500" /> Vigilance Expirations
                            </h2>
                        </div>
                        <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 bg-white overflow-hidden p-8">
                            <div className="space-y-6">
                                <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Alerte Proche (7j)</p>
                                        <p className="text-2xl font-bold text-brand-secondary">0</p>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            api.post('/renewals/check-expiries')
                                                .then(() => toast.success("Vérification effectuée"))
                                                .catch(() => toast.error("Erreur de vérification"));
                                        }}
                                        variant="outline"
                                        className="rounded-xl border-orange-200 text-orange-600 text-[10px] font-black uppercase tracking-widest px-4 hover:bg-orange-100 transition-all"
                                    >
                                        Vérifier maintenant
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Moyen Terme (30j)</p>
                                        <p className="text-xl font-bold text-brand-secondary">0</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Long Terme (60j)</p>
                                        <p className="text-xl font-bold text-brand-secondary">0</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-[0.3em] px-2">
                        Accès Rapides
                    </h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Registre des Labels', link: '/admin/labels', icon: Award, desc: 'Gestion des protocoles certifiants' },
                            { name: 'Base des Organisations', link: '/admin/companies', icon: Building2, desc: 'Annuaire des entités certifiées' },
                            { name: 'Audit des Communiqués', link: '/admin/news', icon: Newspaper, desc: 'Publication et flux éditorial' },
                            { name: 'Configurations Système', link: '/admin/criteria', icon: Settings, desc: 'Paramètres et critères de validation' },
                        ].map(item => (
                            <Link key={item.name} to={item.link} className="block group">
                                <Card className="rounded-3xl border-slate-100 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-sm font-bold text-brand-secondary group-hover:text-brand-primary transition-colors block">{item.name}</span>
                                                <span className="text-[10px] font-medium text-slate-400 block">{item.desc}</span>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-brand-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
