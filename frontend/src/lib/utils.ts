import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Resolve localized object { fr, en } or string; prefers active language, then sensible fallback. */
export function getLocalized(val: any, language: string) {
    if (!val) return "";
    if (typeof val === "string") return val;
    const base = (language || "fr").split("-")[0].toLowerCase();
    const pick = (k: string) => (val[k] != null && val[k] !== "" ? String(val[k]) : "");
    const full = pick(language) || pick(base);
    if (full) return full;
    if (base === "en") {
        return pick("en") || pick("en_US") || pick("fr") || pick("fr_FR") || "";
    }
    return pick("fr") || pick("fr_FR") || pick("en") || pick("en_US") || "";
}

export const IMAGE_FALLBACK = "https://placehold.co/400x400/f0f0f0/909090?text=Logo";

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const target = e.target as HTMLImageElement;
    if (target.src !== IMAGE_FALLBACK) {
        target.src = IMAGE_FALLBACK;
    }
}
