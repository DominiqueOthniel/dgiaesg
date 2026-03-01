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
    published: z.boolean(),
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
            published: !!initialData.published,
        } : {
            title: '',
            content: '',
            author: 'Admin',
            excerpt: '',
            imageUrl: '',
            published: false,
        }
    });

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
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Contenu (Supporte le Markdown)</label>
                <textarea
                    {...register('content')}
                    rows={8}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm resize-none"
                />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <input
                    type="checkbox"
                    id="published"
                    {...register('published')}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="published" className="text-sm font-bold text-gray-700 uppercase tracking-tight">Publier immédiatement</label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-2xl h-14 shadow-xl shadow-emerald-100 uppercase text-xs font-black tracking-widest italic">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : initialData ? 'Mettre à jour' : 'Publier l\'article'}
            </Button>
        </form>
    );
};
