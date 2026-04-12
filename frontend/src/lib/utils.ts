import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getLocalized(val: any, language: string) {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return val[language] || val['fr'] || val['en'] || "";
}

export const IMAGE_FALLBACK = "https://placehold.co/400x400/f0f0f0/909090?text=Logo";

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const target = e.target as HTMLImageElement;
    if (target.src !== IMAGE_FALLBACK) {
        target.src = IMAGE_FALLBACK;
    }
}
