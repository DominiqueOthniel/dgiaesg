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
