import { useEffect, useState } from 'react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { FileUpload } from './ui/FileUpload';

const newsSchema = z.object({
    title: z.object({
        fr: z.string().min(5, 'Le titre (FR) est requis'),
        en: z.string().min(5, 'The title (EN) is required'),
    }),
    content: z.object({
        fr: z.string().min(20, 'Le contenu (FR) est trop court'),
        en: z.string().min(20, 'The content (EN) is too short'),
    }),
    excerpt: z.object({
        fr: z.string().optional(),
        en: z.string().optional(),
    }),
    author: z.string().min(2, "L'auteur est requis"),
    imageUrl: z.string().optional(),
    sector: z.enum(["finance", "governance", "tech", "energy", "leadership"]),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    readingTime: z.string(),
    published: z.boolean(),
    premium: z.boolean(),
});

type NewsFormData = z.infer<typeof newsSchema>;

interface NewsFormProps {
    initialData?: any;
    onSubmit: (data: NewsFormData) => void;
    isLoading?: boolean;
}

export const NewsForm = ({ initialData, onSubmit, isLoading }: NewsFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<NewsFormData>({
        resolver: zodResolver(newsSchema),
        defaultValues: initialData ? {
            title: {
                fr: initialData.title?.fr || '',
                en: initialData.title?.en || '',
            },
            content: {
                fr: initialData.content?.fr || '',
                en: initialData.content?.en || '',
            },
            author: initialData.author || '',
            excerpt: {
                fr: initialData.excerpt?.fr || '',
                en: initialData.excerpt?.en || '',
            },
            imageUrl: initialData.imageUrl || '',
            sector: initialData.sector || 'finance',
            category: initialData.category?._id || initialData.category || '',
            subCategory: initialData.subCategory?._id || initialData.subCategory || '',
            readingTime: initialData.readingTime || '3 min',
            published: !!initialData.published,
            premium: !!initialData.premium,
        } : {
            title: { fr: '', en: '' },
            content: { fr: '', en: '' },
            author: 'Admin',
            excerpt: { fr: '', en: '' },
            imageUrl: '',
            sector: 'finance',
            category: '',
            subCategory: '',
            readingTime: '3 min',
            published: false,
            premium: false,
        }
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const selectedCategory = watch('category');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories', { params: { parent: 'null' } });
                setCategories(response.data.data);
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (!selectedCategory) {
                setSubCategories([]);
                return;
            }
            try {
                const response = await api.get('/categories', { params: { parent: selectedCategory } });
                setSubCategories(response.data.data);
            } catch (error) {
                console.error('Failed to fetch sub-categories');
            }
        };
        fetchSubCategories();
    }, [selectedCategory]);

    const content = watch('content');

    // Auto-calculate reading time (based on FR content)
    useEffect(() => {
        if (content.fr) {
            const wordsPerMinute = 200;
            const noOfWords = content.fr.split(/\s+/g).length;
            const minutes = Math.ceil(noOfWords / wordsPerMinute);
            setValue('readingTime', `${minutes} min`);
        }
    }, [content.fr, setValue]);

    const imageUrl = watch('imageUrl');

    // Remove unused isPublished

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Titre (FR)</label>
                    <input
                        {...register('title.fr')}
                        className={cn(
                            "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-lg italic",
                            errors.title?.fr && "ring-2 ring-red-500/10 bg-red-50/30"
                        )}
                    />
                    {errors.title?.fr && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.title.fr.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Title (EN)</label>
                    <input
                        {...register('title.en')}
                        className={cn(
                            "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-lg italic",
                            errors.title?.en && "ring-2 ring-red-500/10 bg-red-50/30"
                        )}
                    />
                    {errors.title?.en && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.title.en.message}</p>}
                </div>
            </div>

            <FileUpload
                label="Image de Couverture"
                defaultValue={imageUrl}
                onUploadSuccess={(url) => setValue('imageUrl', url)}
            />
            {errors.imageUrl && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.imageUrl.message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Auteur</label>
                    <input {...register('author')} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Secteur Editorial</label>
                    <select
                        {...register('sector')}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm italic"
                    >
                        <option value="finance">ESG & FINANCE</option>
                        <option value="governance">RSE & GOUVERNANCE</option>
                        <option value="tech">TECH & DURABLE</option>
                        <option value="energy">ÉNERGIE & BIO</option>
                        <option value="leadership">LEADERSHIP & IMPACT</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Catégorie</label>
                    <select
                        {...register('category')}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm italic"
                    >
                        <option value="">SÉLECTIONNER UNE CATÉGORIE</option>
                        {categories.map((c: any) => (
                            <option key={c._id} value={c._id}>{c.name.fr.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Sous-Catégorie</label>
                    <select
                        {...register('subCategory')}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm italic"
                        disabled={!selectedCategory}
                    >
                        <option value="">SÉLECTIONNER UNE SOUS-CATÉGORIE</option>
                        {subCategories.map((sc: any) => (
                            <option key={sc._id} value={sc._id}>{sc.name.fr.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Contenu (FR)</label>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Temps de lecture estimé: {watch('readingTime')}
                        </span>
                    </div>
                    <textarea
                        {...register('content.fr')}
                        rows={6}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm resize-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Content (EN)</label>
                    <textarea
                        {...register('content.en')}
                        rows={6}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm resize-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <input
                        type="checkbox"
                        id="published"
                        {...register('published')}
                        className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <label htmlFor="published" className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic">Publier l'Article</label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                    <input
                        type="checkbox"
                        id="premium"
                        {...register('premium')}
                        className="w-5 h-5 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                    />
                    <label htmlFor="premium" className="text-[10px] font-black text-brand-primary uppercase tracking-widest italic">Contenu Premium / Payant</label>
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-2xl h-14 shadow-xl shadow-emerald-100 uppercase text-xs font-black tracking-widest italic">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : initialData ? 'Mettre à jour' : 'Publier l\'article'}
            </Button>
        </form>
    );
};
