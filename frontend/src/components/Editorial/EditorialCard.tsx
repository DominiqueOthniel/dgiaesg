import { Link } from "react-router-dom";
import { resolveImageUrl } from "../../lib/image";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Crown } from "lucide-react";

interface EditorialCardProps {
    id: string;
    title: string;
    excerpt?: string;
    image?: string;
    category?: string;
    date?: string | Date;
    isPremium?: boolean;
    variant?: 'grid' | 'horizontal' | 'feature' | 'minimal';
    href?: string;
    className?: string;
}

const EditorialCard = ({
    id,
    title,
    excerpt,
    image,
    category,
    date,
    isPremium = false,
    variant = 'grid',
    href,
    className
}: EditorialCardProps) => {
    const cardHref = href || `/news/${id}`;
    const formattedDate = date ? format(new Date(date), 'dd MMMM yyyy', { locale: fr }) : '';

    if (variant === 'horizontal') {
        return (
            <Link to={cardHref} className={cn("group flex gap-6 pb-6 border-b border-surface-muted transition-all hover:bg-white/50", className)}>
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-surface-muted overflow-hidden border border-brand-secondary/5 relative">
                    <img 
                        src={resolveImageUrl(image)} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {isPremium && (
                        <div className="absolute top-0 left-0 bg-brand-primary p-1">
                            <Crown className="w-3 h-3 text-white fill-white" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center">
                    {category && <span className="metadata mb-1 pr-4">{category}</span>}
                    <h3 className="font-serif text-[16px] md:text-[18px] font-bold italic leading-tight group-hover:underline decoration-brand-primary decoration-2 underline-offset-4">
                        {title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        {formattedDate}
                    </span>
                </div>
            </Link>
        );
    }

    if (variant === 'feature') {
        return (
            <Link to={cardHref} className={cn("group relative w-full h-[350px] md:h-[450px] overflow-hidden bg-brand-secondary border-b-4 border-brand-primary", className)}>
                <img 
                    src={resolveImageUrl(image)} 
                    alt={title} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 group-hover:opacity-40" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4">
                        {category && <span className="bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5">{category}</span>}
                        {isPremium && <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 flex items-center gap-2"><Crown className="w-3 h-3 fill-black" /> Premium Content</span>}
                    </div>
                    <h1 className="text-white text-3xl md:text-6xl font-serif italic font-bold tracking-tight leading-none group-hover:underline decoration-brand-primary decoration-4 underline-offset-8">
                        {title}
                    </h1>
                    {excerpt && <p className="text-slate-200 text-sm md:text-lg max-w-2xl font-medium line-clamp-2 md:line-clamp-none italic decoration-white/20">{excerpt}</p>}
                    <div className="pt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                         <span>{formattedDate}</span>
                         <div className="w-1.5 h-1.5 bg-brand-primary rotate-45" />
                         <span>Lecture : 5 min</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link to={cardHref} className={cn("group editorial-card flex flex-col h-full", className)}>
            <div className="aspect-[16/10] bg-surface-muted overflow-hidden relative border-b border-brand-secondary/5">
                <img 
                    src={resolveImageUrl(image)} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {isPremium && (
                    <div className="absolute top-4 left-0 bg-brand-primary text-white p-2 shadow-lg">
                        <Crown className="w-4 h-4 fill-white" />
                    </div>
                )}
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                    {category && <span className="metadata">{category}</span>}
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{formattedDate}</span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold italic mb-4 leading-tight group-hover:underline decoration-brand-primary decoration-2 underline-offset-4">
                    {title}
                </h3>
                {excerpt && <p className="text-sm text-text-muted line-clamp-3 mb-6 font-medium italic">{excerpt}</p>}
                
                <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary group-hover:gap-3 transition-all">
                    En savoir plus <div className="w-4 h-[2px] bg-brand-primary" />
                </div>
            </div>
        </Link>
    );
};

export default EditorialCard;
