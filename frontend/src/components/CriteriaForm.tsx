import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';

const criteriaSchema = z.object({
    labelId: z.string().min(1, 'Label requis'),
    category: z.string().min(2, 'Catégorie requise'),
    title: z.string().min(1, 'Titre requis'),
    description: z.string().min(1, 'Description requise'),
    weight: z.number().min(1).max(100, 'Le poids doit être entre 1 et 100'),
});

type CriteriaFormData = z.infer<typeof criteriaSchema>;

interface CriteriaFormProps {
    initialData?: any;
    labels: any[];
    defaultLabelId?: string;
    onSubmit: (data: CriteriaFormData) => void;
    isLoading?: boolean;
}

export const CriteriaForm = ({ initialData, labels, defaultLabelId, onSubmit, isLoading }: CriteriaFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CriteriaFormData>({
        resolver: zodResolver(criteriaSchema),
        defaultValues: initialData ? {
            labelId: typeof initialData.labelId === 'object' ? initialData.labelId._id : initialData.labelId,
            category: initialData.category || '',
            title: initialData.title || '',
            description: initialData.description || '',
            weight: initialData.weight || 10,
        } : {
            labelId: defaultLabelId || '',
            category: '',
            title: '',
            description: '',
            weight: 10,
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Label Associé</label>
                    <select
                        {...register('labelId')}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-[10px] uppercase tracking-widest italic"
                    >
                        <option value="">Sélectionner un label</option>
                        {labels.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                    </select>
                    {errors.labelId && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.labelId.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Poids (Influence %)</label>
                    <input
                        type="number"
                        {...register('weight', { valueAsNumber: true })}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-lg italic"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Catégorie d'Impact</label>
                <select
                    {...register('category')}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-[10px] uppercase tracking-widest italic"
                >
                    <option value="">Sélectionner une dimension</option>
                    <option value="governance">Gouvernance Éthique</option>
                    <option value="environment">Responsabilité Environnementale</option>
                    <option value="social">Engagement Social</option>
                    <option value="economic">Développement Économique</option>
                    <option value="quality">Excellence Qualité</option>
                </select>
                {errors.category && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Titre du Critère</label>
                <input {...register('title')} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Description</label>
                <textarea {...register('description')} rows={3} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm resize-none" />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-2xl h-14 shadow-xl shadow-emerald-100 uppercase text-xs font-black tracking-widest italic">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : initialData ? 'Mettre à jour' : 'Ajouter le Critère'}
            </Button>
        </form>
    );
};
