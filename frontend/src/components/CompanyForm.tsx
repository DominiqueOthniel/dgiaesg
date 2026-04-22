import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { FileUpload } from './ui/FileUpload';

const companySchema = z.object({
    name: z.string().min(2, 'Le nom est requis'),
    description: z.string().min(10, 'La description est requise'),
    sector: z.string().min(2, 'Le secteur est requis'),
    region: z.string().min(2, 'La région est requise'),
    website: z.string().optional().or(z.literal('')),
    logoUrl: z.string().optional().or(z.literal('')),
    labelId: z.string().min(1, 'Veuillez sélectionner un label'),
    certificationDate: z.string().min(1, 'Date requise'),
    expiryDate: z.string().min(1, 'Date requise'),
    status: z.enum(['certified', 'pending', 'expired']),
    socialScore: z.coerce.number().min(0).max(100),
    governanceScore: z.coerce.number().min(0).max(100),
    ownerId: z.string().optional().nullable().transform(val => (val === '' ? null : val)),
});

export type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
    initialData?: any;
    labels: any[];
    users?: any[];
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const buildDefaults = (data?: any): CompanyFormData => {
    if (!data) return {
        name: '', description: '', sector: '', region: '', website: '', logoUrl: '',
        labelId: '', certificationDate: '', expiryDate: '', status: 'pending',
        socialScore: 0, governanceScore: 0, ownerId: '',
    };
    return {
        name: data.name || '',
        description: data.description || '',
        sector: data.sector || '',
        region: data.region || '',
        website: data.website || '',
        logoUrl: data.logoUrl || '',
        labelId: (data.labelId && typeof data.labelId === 'object') ? data.labelId._id : (data.labelId || ''),
        certificationDate: data.certificationDate ? new Date(data.certificationDate).toISOString().split('T')[0] : '',
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : '',
        status: data.status || 'pending',
        socialScore: data.socialScore ?? 0,
        governanceScore: data.governanceScore ?? 0,
        ownerId: (data.ownerId && typeof data.ownerId === 'object') ? data.ownerId._id : (data.ownerId || ''),
    };
};

export const CompanyForm = ({ initialData, labels, users = [], onSubmit, isLoading }: CompanyFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema) as any,
        defaultValues: buildDefaults(initialData),
    });

    // Reset the whole form whenever initialData changes (e.g. open modal for a different company)
    useEffect(() => {
        reset(buildDefaults(initialData));
    }, [initialData, reset]);

    const logoUrl = watch('logoUrl');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Nom de l'Entreprise</label>
                    <input
                        {...register('name')}
                        className={cn(
                            "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                            errors.name && "ring-2 ring-red-500/10 bg-red-50/30"
                        )}
                    />
                    {errors.name && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Label</label>
                    <select
                        {...register('labelId')}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-[10px] uppercase tracking-widest italic"
                    >
                        <option value="">Sélectionner un label</option>
                        {labels.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                    </select>
                    {errors.labelId && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.labelId.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Secteur</label>
                    <input
                        {...register('sector')}
                        list="sectors-list"
                        placeholder="Choisir ou saisir un secteur..."
                        className={cn(
                            "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                            errors.sector && "ring-2 ring-red-500/10 bg-red-50/30"
                        )}
                    />
                    <datalist id="sectors-list">
                        {[...new Set(labels.map(l => l.sector))].filter(Boolean).map(s => (
                            <option key={s} value={s} />
                        ))}
                    </datalist>
                    {errors.sector && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.sector.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Région</label>
                    <input
                        {...register('region')}
                        className={cn(
                            "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                            errors.region && "ring-2 ring-red-500/10 bg-red-50/30"
                        )}
                    />
                    {errors.region && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.region.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <FileUpload
                        label="Logo de l'Entreprise"
                        defaultValue={logoUrl}
                        onUploadSuccess={(url) => setValue('logoUrl', url)}
                    />
                    {errors.logoUrl && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.logoUrl.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Site Web (URL)</label>
                    <input
                        {...register('website')}
                        placeholder="https://..."
                        className={cn(
                            "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                            errors.website && "ring-2 ring-red-500/10 bg-red-50/30"
                        )}
                    />
                    {errors.website && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.website.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Date de Certification</label>
                    <input
                        type="date"
                        {...register('certificationDate')}
                        className={cn(
                            "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                            errors.certificationDate && "ring-2 ring-red-500/10 bg-red-50/30"
                        )}
                    />
                    {errors.certificationDate && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.certificationDate.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Date d'Expiration</label>
                    <input
                        type="date"
                        {...register('expiryDate')}
                        className={cn(
                            "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                            errors.expiryDate && "ring-2 ring-red-500/10 bg-red-50/30"
                        )}
                    />
                    {errors.expiryDate && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.expiryDate.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Statut</label>
                    <select {...register('status')} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-[10px] uppercase tracking-widest italic">
                        <option value="certified">Certifié</option>
                        <option value="pending">En attente</option>
                        <option value="expired">Expiré</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Administrateur (Propriétaire PRO)</label>
                    <select
                        {...register('ownerId')}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-[10px] uppercase tracking-widest italic"
                    >
                        <option value="">Aucun administrateur</option>
                        {users.map(u => (
                            <option key={u._id} value={u._id}>
                                {u.name} ({u.email})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Score Social (%)</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            {...register('socialScore', { valueAsNumber: true })}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Gouvernance (%)</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            {...register('governanceScore', { valueAsNumber: true })}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Description</label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className={cn(
                        "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                        errors.description && "ring-2 ring-red-500/10 bg-red-50/30"
                    )}
                />
                {errors.description && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.description.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-2xl h-14 shadow-xl shadow-emerald-100 uppercase text-xs font-black tracking-widest italic">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : initialData ? 'Mettre à jour' : 'Enregistrer Certificat'}
            </Button>
        </form>
    );
};
