import { useState, useEffect } from 'react';
import {
    Zap,
    Search,
    ArrowUpCircle,
    ArrowDownCircle,
    Mail,
    Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { cn } from '../../lib/utils';

const SubscriptionAdmin = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users');
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error(error);
            setUsers([
                { _id: '1', name: 'John Doe', email: 'john@example.com', isPro: true, proExpiry: '2026-12-31' },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', isPro: false },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleTogglePro = async (userId: string, currentStatus: boolean) => {
        try {
            await api.put(`/users/${userId}/subscription`, {
                isPro: !currentStatus,
                proExpiry: !currentStatus ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null
            });
            toast.success(currentStatus ? 'Abonnement révoqué' : 'Utilisateur promu PRO');
            fetchUsers();
        } catch (error) {
            toast.error('Échec de la mise à jour');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            <Zap className="w-3.5 h-3.5" /> Subscription Manager
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary">Gestion des Abonnés</h1>
                        <p className="text-slate-400 font-medium max-w-xl">Contrôlez les accès Premium et gérez les comptes PRO du réseau.</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative flex-1 group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur par nom ou email..."
                    className="w-full pl-16 pr-8 h-16 bg-white border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm font-medium transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users List */}
            <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
                <CardContent className="p-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiration</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-20 text-center animate-pulse text-slate-200 uppercase font-black tracking-widest">Synchronisation...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={4} className="p-20 text-center text-slate-300 uppercase font-black tracking-widest">Aucun abonné détecté</td></tr>
                            ) : filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                                {u.name?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">{u.name}</p>
                                                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5"><Mail className="w-3 h-3" /> {u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={cn(
                                            "rounded-full px-4 py-1 font-bold text-[9px] uppercase tracking-widest border-none",
                                            u.isPro ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-400"
                                        )}>
                                            {u.isPro ? 'Membre PRO' : 'Standard'}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <Calendar className="w-4 h-4 text-slate-300" />
                                            {u.proExpiry ? new Date(u.proExpiry).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Button
                                            onClick={() => handleTogglePro(u._id, u.isPro)}
                                            className={cn(
                                                "h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all gap-2",
                                                u.isPro ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                            )}
                                        >
                                            {u.isPro ? (
                                                <><ArrowDownCircle className="w-4 h-4" /> Downgrade</>
                                            ) : (
                                                <><ArrowUpCircle className="w-4 h-4" /> Upgrade PRO</>
                                            )}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubscriptionAdmin;
