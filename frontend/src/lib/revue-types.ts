/** Types partagés pour la revue mensuelle (UI + mapping API). */

export type IssueSlug = string;

export interface IssueSection {
  id:
    | "edito"
    | "dossier"
    | "portrait"
    | "classement"
    | "veille"
    | "startups"
    | "agenda"
    | "resume"
    | "pdf";
  label: string;
  title: string;
  excerpt: string;
  pages?: string;
  access: "free" | "digital" | "revue";
}

export interface MagazineIssue {
  /** Identifiant stable pour les routes (Mongo `_id` de MonthlyReview). */
  slug: IssueSlug;
  number: number;
  publishDate: string;
  monthLabel: string;
  title: string;
  tagline: string;
  pageCount: number;
  featured?: boolean;
  coverGradient: string;
  coverGlyph: string;
  coverAccent: "gold" | "emerald" | "deep";
  sections: IssueSection[];
  /** Couverture réelle depuis l’API. */
  coverImageUrl?: string;
  pdfUrl?: string;
}
