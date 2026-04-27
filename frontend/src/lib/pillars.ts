// ---------------------------------------------------------------------------
// Editorial Pillars — single source of truth for the /thematiques portal.
//
// Backend coupling (see README_BACKEND.md):
//   Each News article is expected to expose `category: <pillar.slug>` so the
//   pillar landing pages can fetch their feed via `?category=<slug>`.
//   Sub-categories below are indicative tags — the supervisor can decide to
//   store them as `subCategory: string` or `tags: string[]`.
// ---------------------------------------------------------------------------

import {
  Leaf,
  Coins,
  Building2,
  Scale,
  Users,
  Sprout,
  type LucideIcon,
} from "lucide-react";

export type PillarSlug =
  | "climat-energie"
  | "finance-esg"
  | "rse-entreprises"
  | "gouvernance"
  | "social-inclusion"
  | "agri-biodiversite";

export interface Pillar {
  slug: PillarSlug;
  label: string;       // short label for nav / sidebar
  h1: string;          // SEO H1 on the landing page
  description: string; // SEO meta + hero subtitle
  tagline: string;     // short pitch on the portal grid
  /** Lucide icon used in nav, sidebar widget and pillar hero. */
  icon: LucideIcon;
  /** Tailwind classes — kept inline so design tokens stay in styles.css. */
  color: {
    /** Solid hero / accent background. */
    bg: string;
    /** Soft background for chips, sidebar pastilles. */
    soft: string;
    /** Border for soft surfaces. */
    border: string;
    /** Strong text accent (used on light backgrounds). */
    text: string;
    /** Dot color for sidebar widget. */
    dot: string;
  };
  /** Sub-categories shown as filter chips on the pillar page. */
  subCategories: { value: string; label: string }[];
}

export const PILLARS: Pillar[] = [
  {
    slug: "climat-energie",
    label: "Climat & Énergie",
    h1: "Transition énergétique : le défi africain",
    description:
      "Renouvelables, adaptation climatique, COP, financement vert.",
    tagline:
      "Suivre la course du continent vers une énergie propre et résiliente.",
    icon: Leaf,
    color: {
      bg: "bg-emerald-700",
      soft: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    subCategories: [
      { value: "all", label: "Tout" },
      { value: "renouvelables", label: "Renouvelables" },
      { value: "adaptation", label: "Adaptation" },
      { value: "cop", label: "COP & Diplomatie" },
      { value: "finance-verte", label: "Finance verte" },
      { value: "efficacite", label: "Efficacité énergétique" },
      { value: "hydrogene", label: "Hydrogène vert" },
    ],
  },
  {
    slug: "finance-esg",
    label: "Finance ESG",
    h1: "La finance au service du développement durable",
    description:
      "Green bonds, taxonomie ESG, ISR, reporting TCFD.",
    tagline:
      "Décrypter les flux de capitaux qui transforment l'économie africaine.",
    icon: Coins,
    color: {
      bg: "bg-amber-700",
      soft: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      dot: "bg-amber-600",
    },
    subCategories: [
      { value: "all", label: "Tout" },
      { value: "green-bonds", label: "Green Bonds" },
      { value: "taxonomie", label: "Taxonomie ESG" },
      { value: "isr", label: "ISR" },
      { value: "tcfd", label: "Reporting TCFD" },
      { value: "microfinance", label: "Microfinance" },
      { value: "impact", label: "Impact investing" },
    ],
  },
  {
    slug: "rse-entreprises",
    label: "RSE Entreprises",
    h1: "Comment les entreprises africaines s'engagent",
    description:
      "Stratégies RSE, rapports de durabilité, certifications.",
    tagline:
      "Les engagements concrets des leaders économiques du continent.",
    icon: Building2,
    color: {
      bg: "bg-emerald-700",
      soft: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    subCategories: [
      { value: "all", label: "Tout" },
      { value: "strategies", label: "Stratégies RSE" },
      { value: "rapports", label: "Rapports durabilité" },
      { value: "certifications", label: "Certifications" },
      { value: "supply-chain", label: "Chaîne d'approv." },
      { value: "innovation", label: "Innovation durable" },
    ],
  },
  {
    slug: "gouvernance",
    label: "Gouvernance",
    h1: "Réglementation, transparence et redevabilité",
    description:
      "Politiques publiques, régulations ESG, lutte anti-corruption.",
    tagline:
      "Le cadre normatif qui structure la durabilité en Afrique.",
    icon: Scale,
    color: {
      bg: "bg-amber-700",
      soft: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      dot: "bg-amber-600",
    },
    subCategories: [
      { value: "all", label: "Tout" },
      { value: "politiques", label: "Politiques publiques" },
      { value: "regulations", label: "Régulations ESG" },
      { value: "anti-corruption", label: "Anti-corruption" },
      { value: "transparence", label: "Transparence" },
      { value: "ua-cedeao", label: "UA / CEDEAO" },
    ],
  },
  {
    slug: "social-inclusion",
    label: "Social & Inclusion",
    h1: "L'humain au cœur du développement durable",
    description:
      "Genre, jeunesse, droits sociaux, travail décent.",
    tagline:
      "Mettre en lumière les acteurs d'une croissance plus inclusive.",
    icon: Users,
    color: {
      bg: "bg-emerald-700",
      soft: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    subCategories: [
      { value: "all", label: "Tout" },
      { value: "genre", label: "Genre" },
      { value: "jeunesse", label: "Jeunesse" },
      { value: "droits", label: "Droits sociaux" },
      { value: "travail-decent", label: "Travail décent" },
      { value: "education", label: "Éducation" },
      { value: "sante", label: "Santé" },
    ],
  },
  {
    slug: "agri-biodiversite",
    label: "Agri & Biodiversité",
    h1: "Nourrir l'Afrique sans détruire l'Afrique",
    description:
      "Agriculture durable, forêts, océans, chaînes d'approvisionnement.",
    tagline:
      "L'équation alimentaire et écologique du continent.",
    icon: Sprout,
    color: {
      bg: "bg-amber-700",
      soft: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      dot: "bg-amber-600",
    },
    subCategories: [
      { value: "all", label: "Tout" },
      { value: "agri-durable", label: "Agriculture durable" },
      { value: "forets", label: "Forêts" },
      { value: "oceans", label: "Océans & pêche" },
      { value: "biodiversite", label: "Biodiversité" },
      { value: "supply-chain", label: "Chaînes d'approv." },
      { value: "agroecologie", label: "Agroécologie" },
    ],
  },
];

export const PILLAR_BY_SLUG: Record<PillarSlug, Pillar> = PILLARS.reduce(
  (acc, p) => {
    acc[p.slug] = p;
    return acc;
  },
  {} as Record<PillarSlug, Pillar>,
);

export function isPillarSlug(value: string): value is PillarSlug {
  return value in PILLAR_BY_SLUG;
}
