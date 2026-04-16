import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LocalizedString } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalized(val: LocalizedString | undefined | null, lang: string): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val["fr"] || val["en"] || "";
}
