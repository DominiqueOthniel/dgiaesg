import type { MonthlyReview } from "@/hooks/useMagazines";
import type { IssueSection, MagazineIssue } from "./revue-types";

type CoverAccent = MagazineIssue["coverAccent"];

const GRADIENT_POOL: { gradient: string; accent: CoverAccent }[] = [
  {
    gradient:
      "from-[hsl(var(--brand-deep))] via-[hsl(var(--brand-forest))] to-[hsl(var(--brand-emerald)/0.62)]",
    accent: "gold",
  },
  {
    gradient:
      "from-[hsl(200_70%_18%)] via-[hsl(180_55%_22%)] to-[hsl(var(--brand-emerald)/0.52)]",
    accent: "emerald",
  },
  {
    gradient:
      "from-[hsl(35_48%_15%)] via-[hsl(30_58%_26%)] to-[hsl(var(--brand-gold)/0.52)]",
    accent: "gold",
  },
  {
    gradient:
      "from-[hsl(var(--brand-dark))] via-[hsl(145_42%_20%)] to-[hsl(78_38%_38%)]",
    accent: "emerald",
  },
];

function hashPick<T>(id: string, arr: T[]): T {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return arr[Math.abs(h) % arr.length];
}

export function deriveGlyph(title: string, idx: number): string {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const a = words[0][0] ?? "";
    const b = words[1][0] ?? "";
    return (a + b).toUpperCase().slice(0, 2);
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return String(idx + 1).padStart(2, "0");
}

function reviewTitle(r: MonthlyReview, lang: string): string {
  const t = r.title;
  if (typeof t === "string") return t;
  const o = t as { fr?: string; en?: string };
  if (lang.startsWith("en") && o.en) return o.en;
  return o.fr || o.en || "Revue";
}

function monthLabel(iso: string | undefined, locale: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(d);
  } catch {
    return "";
  }
}

function sectionsForIssue(title: string): IssueSection[] {
  return [
    {
      id: "resume",
      label: "À la une",
      title,
      excerpt:
        "Retrouvez dans ce numéro les analyses et données produites par la rédaction. L’intégralité du contenu détaillé est disponible dans le PDF.",
      pages: "—",
      access: "free",
    },
    {
      id: "pdf",
      label: "PDF",
      title: "Édition complète",
      excerpt: "Téléchargez le magazine au format PDF pour une lecture hors ligne ou une impression.",
      pages: "—",
      access: "digital",
    },
  ];
}

/**
 * Transforme les avis mensuels API en modèle d’affichage `MagazineIssue`.
 * `slug` = `_id` Mongo (routes `/revue/numeros/:id`).
 */
export function monthlyReviewsToMagazineIssues(
  reviews: MonthlyReview[],
  lang: string,
): MagazineIssue[] {
  const sorted = [...reviews].sort(
    (a, b) =>
      new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime(),
  );
  const locale = lang.startsWith("en") ? "en-GB" : "fr-FR";
  const n = sorted.length;
  return sorted.map((r, indexNewestFirst) => {
    const id = String(r._id);
    const vis = hashPick(id, GRADIENT_POOL);
    const title = reviewTitle(r, lang);
    const ml = monthLabel(r.publishDate, locale);
    return {
      slug: id,
      number: Math.max(1, n - indexNewestFirst),
      publishDate: r.publishDate || new Date().toISOString(),
      monthLabel: ml,
      title,
      tagline: ml || title,
      pageCount: 48,
      featured: Boolean(r.featured),
      coverGradient: vis.gradient,
      coverGlyph: deriveGlyph(title, indexNewestFirst),
      coverAccent: vis.accent,
      sections: sectionsForIssue(title),
      coverImageUrl: r.coverImageUrl,
      pdfUrl: r.pdfUrl,
    };
  });
}

export function getMagazineIssueBySlug(
  slug: string | undefined,
  reviews: MonthlyReview[],
  lang: string,
): MagazineIssue | undefined {
  if (!slug) return undefined;
  const issues = monthlyReviewsToMagazineIssues(reviews, lang);
  return issues.find((i) => i.slug === slug);
}

export function getAdjacentMagazineIssues(
  slug: string,
  reviews: MonthlyReview[],
  lang: string,
): { newer: MagazineIssue | undefined; older: MagazineIssue | undefined } {
  const sorted = monthlyReviewsToMagazineIssues(reviews, lang);
  const idx = sorted.findIndex((i) => i.slug === slug);
  if (idx < 0) return { newer: undefined, older: undefined };
  return {
    newer: idx > 0 ? sorted[idx - 1] : undefined,
    older: idx < sorted.length - 1 ? sorted[idx + 1] : undefined,
  };
}
