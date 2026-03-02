import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { FileUpload } from './ui/FileUpload';

const newsSchema = z.object({
    title: z.string().min(5, 'Le titre est requis'),
    content: z.string().min(20, 'Le contenu est trop court'),
    excerpt: z.string().optional(),
    author: z.string().min(2, "L'auteur est requis"),
    imageUrl: z.string().optional(),
    sector: z.enum(["finance", "governance", "tech", "energy", "leadership"]),
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
            title: initialData.title || '',
            content: initialData.content || '',
            author: initialData.author || '',
            excerpt: initialData.excerpt || '',
            imageUrl: initialData.imageUrl || '',
            sector: initialData.sector || 'finance',
            readingTime: initialData.readingTime || '3 min',
            published: !!initialData.published,
            premium: !!initialData.premium,
        } : {
            title: '',
            content: '',
            author: 'Admin',
            excerpt: '',
            imageUrl: '',
            sector: 'finance',
            readingTime: '3 min',
            published: false,
            premium: false,
        }
    });

    const content = watch('content');

    // Auto-calculate reading time
    useEffect(() => {
        if (content) {
            const wordsPerMinute = 200;
            const noOfWords = content.split(/\s+/g).length;
            const minutes = Math.ceil(noOfWords / wordsPerMinute);
            setValue('readingTime', `${minutes} min`);
        }
    }, [content, setValue]);

    const imageUrl = watch('imageUrl');

    // Remove unused isPublished

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Titre de l'Article</label>
                <input
                    {...register('title')}
                    className={cn(
                        "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-lg italic",
                        errors.title && "ring-2 ring-red-500/10 bg-red-50/30"
                    )}
                />
                {errors.title && <p className="text-[10px] font-bold text-red-500 italic ml-4">{errors.title.message}</p>}
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

            <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Contenu (Supporte le Markdown)</label>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Temps de lecture estimé: {watch('readingTime')}
                    </span>
                </div>
                <textarea
                    {...register('content')}
                    rows={8}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm resize-none"
                />
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
