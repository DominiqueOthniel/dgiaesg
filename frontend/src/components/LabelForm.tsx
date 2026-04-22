import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { FileUpload } from './ui/FileUpload';

const labelSchema = z.object({
    name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
    description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
    sector: z.string().min(2, 'Le secteur est requis'),
    status: z.enum(['active', 'inactive']),
    logoUrl: z.string().optional().or(z.literal('')),
});

type LabelFormData = z.infer<typeof labelSchema>;

interface LabelFormProps {
    initialData?: any;
    onSubmit: (data: LabelFormData) => void;
    isLoading?: boolean;
}

export const LabelForm = ({ initialData, onSubmit, isLoading }: LabelFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<LabelFormData>({
        resolver: zodResolver(labelSchema),
        defaultValues: initialData ? {
            name: initialData.name || '',
            description: initialData.description || '',
            sector: initialData.sector || '',
            status: initialData.status || 'active',
            logoUrl: initialData.logoUrl || '',
        } : {
            name: '',
            description: '',
            sector: '',
            status: 'active',
            logoUrl: '',
        }
    });

    const logoUrl = watch('logoUrl');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Nom du Label</label>
                <input
                    {...register('name')}
                    className={cn(
                        "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                        errors.name && "ring-2 ring-red-500/10 bg-red-50/30"
                    )}
                    placeholder="ex: Green Global Certificate"
                />
                {errors.name && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Secteur d'activité</label>
                <input
                    {...register('sector')}
                    className={cn(
                        "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm",
                        errors.sector && "ring-2 ring-red-500/10 bg-red-50/30"
                    )}
                    placeholder="ex: Technologie, Agriculture..."
                />
                {errors.sector && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.sector.message}</p>}
            </div>

            <FileUpload
                label="Logo du Label"
                defaultValue={logoUrl}
                onUploadSuccess={(url) => setValue('logoUrl', url)}
            />
            {errors.logoUrl && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.logoUrl.message}</p>}

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Statut initial</label>
                <select
                    {...register('status')}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-[10px] uppercase tracking-widest italic appearance-none"
                >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Description détaillée</label>
                <textarea
                    {...register('description')}
                    rows={4}
                    className={cn(
                        "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm resize-none",
                        errors.description && "ring-2 ring-red-500/10 bg-red-50/30"
                    )}
                    placeholder="Décrivez les objectifs et les valeurs de ce label..."
                />
                {errors.description && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.description.message}</p>}
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-2xl h-14 shadow-xl shadow-emerald-100 uppercase text-xs font-black tracking-widest italic"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : initialData ? 'Mettre à jour' : 'Créer le Label'}
                </Button>
            </div>
        </form>
    );
};
