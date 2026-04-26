/**
 * Static seed data for "La Revue Durabilité Afrique".
 * 12 issues from May 2025 → April 2026.
 */

export type IssueSlug = string; // e.g. "avril-2026"

export interface IssueSection {
  id:
    | "edito"
    | "dossier"
    | "portrait"
    | "classement"
    | "veille"
    | "startups"
    | "agenda";
  label: string;
  title: string;
  excerpt: string;
  pages?: string;
  access: "free" | "digital" | "revue";
}

export interface MagazineIssue {
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
}

const SECTION_TEMPLATE = (
  overrides: Partial<Record<IssueSection["id"], Partial<IssueSection>>> = {}
): IssueSection[] => [
  {
    id: "edito",
    label: "Édito",
    title: "L'édito du rédacteur en chef",
    excerpt: "Le mot d'ouverture qui pose le ton du mois et resitue les enjeux de la durabilité africaine.",
    pages: "p. 3",
    access: "free",
    ...overrides.edito,
  },
  {
    id: "dossier",
    label: "Dossier du mois",
    title: "Dossier — 20 pages d'analyse exclusive",
    excerpt: "L'enquête phare du numéro, nourrie de chiffres, d'interviews terrain et de cartographies inédites.",
    pages: "p. 8 → 28",
    access: "revue",
    ...overrides.dossier,
  },
  {
    id: "portrait",
    label: "Portrait",
    title: "Portrait d'un leader de la durabilité",
    excerpt: "Une figure du continent qui change les règles du jeu ESG, racontée en profondeur.",
    pages: "p. 30",
    access: "digital",
    ...overrides.portrait,
  },
  {
    id: "classement",
    label: "Classement",
    title: "Données exclusives & classements",
    excerpt: "Notre baromètre mensuel : indices, scores et palmarès pour comparer les acteurs du secteur.",
    pages: "p. 36",
    access: "revue",
    ...overrides.classement,
  },
  {
    id: "veille",
    label: "Veille réglementaire",
    title: "Veille réglementaire africaine",
    excerpt: "Les textes, normes et décisions à connaître ce mois-ci, pays par pays.",
    pages: "p. 40",
    access: "digital",
    ...overrides.veille,
  },
  {
    id: "startups",
    label: "Startups à suivre",
    title: "5 startups à suivre ce mois-ci",
    excerpt: "Les jeunes pousses qui réinventent l'impact, sélectionnées par notre comité éditorial.",
    pages: "p. 44",
    access: "free",
    ...overrides.startups,
  },
  {
    id: "agenda",
    label: "Agenda RSE",
    title: "L'agenda RSE du mois",
    excerpt: "Forums, sommets, appels à candidatures, formations : tout ce qu'il faut cocher.",
    pages: "p. 48",
    access: "free",
    ...overrides.agenda,
  },
];

const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function buildIssue(
  number: number,
  isoDate: string,
  data: {
    title: string;
    tagline: string;
    coverGradient: string;
    coverGlyph: string;
    coverAccent: MagazineIssue["coverAccent"];
    featured?: boolean;
    sections?: Parameters<typeof SECTION_TEMPLATE>[0];
  }
): MagazineIssue {
  const [yearStr, monthStr] = isoDate.split("-");
  const monthIndex = Math.max(0, Math.min(11, parseInt(monthStr, 10) - 1));
  const year = parseInt(yearStr, 10);
  const monthName = MONTHS_FR[monthIndex];
  return {
    slug: `${monthName}-${year}`,
    number,
    publishDate: isoDate,
    monthLabel: `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`,
    title: data.title,
    tagline: data.tagline,
    pageCount: 50,
    featured: data.featured,
    coverGradient: data.coverGradient,
    coverGlyph: data.coverGlyph,
    coverAccent: data.coverAccent,
    sections: SECTION_TEMPLATE(data.sections),
  };
}

export const ISSUES: MagazineIssue[] = [
  buildIssue(12, "2026-04-01", {
    title: "Cap sur la finance verte africaine",
    tagline: "Comment les banques du continent flèchent 50 Md$ vers la transition.",
    coverGradient: "from-[hsl(var(--brand-deep))] via-[hsl(var(--brand-forest))] to-[hsl(var(--brand-emerald)/0.6)]",
    coverGlyph: "FV",
    coverAccent: "gold",
    featured: true,
    sections: {
      dossier: {
        title: "Dossier — Finance verte : où va l'argent ?",
        excerpt: "20 pages pour décrypter les flux, les acteurs clés et les angles morts de la finance verte africaine.",
      },
      portrait: {
        title: "Portrait — Awa Diop, architecte du Green Bond UEMOA",
        excerpt: "Rencontre avec celle qui structure l'émission obligataire la plus regardée d'Afrique de l'Ouest.",
      },
    },
  }),
  buildIssue(11, "2026-03-01", {
    title: "Eau : la nouvelle géopolitique",
    tagline: "Ressource rare, levier de pouvoir : enquête sur le bien commun de demain.",
    coverGradient: "from-[hsl(200_70%_18%)] via-[hsl(180_60%_22%)] to-[hsl(var(--brand-emerald)/0.55)]",
    coverGlyph: "EA",
    coverAccent: "emerald",
  }),
  buildIssue(10, "2026-02-01", {
    title: "Mines responsables : mythe ou virage ?",
    tagline: "Lithium, cobalt, terres rares : l'Afrique au cœur des supply chains propres.",
    coverGradient: "from-[hsl(35_45%_15%)] via-[hsl(30_60%_28%)] to-[hsl(var(--brand-gold)/0.55)]",
    coverGlyph: "MR",
    coverAccent: "gold",
  }),
  buildIssue(9, "2026-01-01", {
    title: "2026 : 10 tendances ESG à suivre",
    tagline: "Le grand panorama de notre rédaction pour ouvrir l'année.",
    coverGradient: "from-[hsl(var(--brand-dark))] via-[hsl(var(--brand-deep))] to-[hsl(var(--brand-gold)/0.45)]",
    coverGlyph: "26",
    coverAccent: "gold",
    featured: true,
  }),
  buildIssue(8, "2025-12-01", {
    title: "Climat : bilan COP & feuille de route",
    tagline: "Ce que la COP a vraiment changé pour les entreprises africaines.",
    coverGradient: "from-[hsl(220_50%_15%)] via-[hsl(200_55%_25%)] to-[hsl(var(--brand-emerald)/0.5)]",
    coverGlyph: "CL",
    coverAccent: "emerald",
  }),
  buildIssue(7, "2025-11-01", {
    title: "Agro-industrie & sols vivants",
    tagline: "Régénérer plutôt qu'exploiter : la nouvelle équation rurale.",
    coverGradient: "from-[hsl(90_40%_18%)] via-[hsl(80_50%_28%)] to-[hsl(var(--brand-gold)/0.45)]",
    coverGlyph: "AG",
    coverAccent: "emerald",
  }),
  buildIssue(6, "2025-10-01", {
    title: "Genre & gouvernance",
    tagline: "La parité au board : un moteur de performance documenté.",
    coverGradient: "from-[hsl(320_30%_18%)] via-[hsl(340_40%_28%)] to-[hsl(var(--brand-gold)/0.5)]",
    coverGlyph: "GG",
    coverAccent: "gold",
  }),
  buildIssue(5, "2025-09-01", {
    title: "Énergie solaire : passage à l'échelle",
    tagline: "Du pilote au gigawatt : qui industrialise vraiment ?",
    coverGradient: "from-[hsl(35_60%_20%)] via-[hsl(40_75%_32%)] to-[hsl(var(--brand-gold)/0.7)]",
    coverGlyph: "SO",
    coverAccent: "gold",
    featured: true,
  }),
  buildIssue(4, "2025-08-01", {
    title: "Villes africaines & résilience",
    tagline: "Lagos, Nairobi, Dakar : trois modèles, une urgence.",
    coverGradient: "from-[hsl(var(--brand-deep))] via-[hsl(210_40%_25%)] to-[hsl(var(--brand-emerald)/0.45)]",
    coverGlyph: "VR",
    coverAccent: "deep",
  }),
  buildIssue(3, "2025-07-01", {
    title: "Reporting CSRD & équivalents africains",
    tagline: "Comment se préparer sans subir la complexité européenne.",
    coverGradient: "from-[hsl(var(--brand-dark))] via-[hsl(var(--brand-forest))] to-[hsl(var(--brand-gold)/0.4)]",
    coverGlyph: "CS",
    coverAccent: "gold",
  }),
  buildIssue(2, "2025-06-01", {
    title: "Chaînes de valeur circulaires",
    tagline: "Le déchet comme matière première : 12 cas concrets.",
    coverGradient: "from-[hsl(160_50%_15%)] via-[hsl(140_55%_25%)] to-[hsl(var(--brand-emerald)/0.6)]",
    coverGlyph: "CC",
    coverAccent: "emerald",
  }),
  buildIssue(1, "2025-05-01", {
    title: "Numéro inaugural — Le manifeste",
    tagline: "Pourquoi nous lançons la référence mensuelle de la durabilité africaine.",
    coverGradient: "from-[hsl(var(--brand-dark))] via-[hsl(var(--brand-deep))] to-[hsl(var(--brand-gold)/0.55)]",
    coverGlyph: "01",
    coverAccent: "gold",
    featured: true,
  }),
];

export function getLatestIssue(): MagazineIssue {
  return [...ISSUES].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())[0];
}

export function getIssueBySlug(slug: string): MagazineIssue | undefined {
  return ISSUES.find((i) => i.slug === slug);
}

export function getAdjacentIssues(slug: string) {
  const sorted = [...ISSUES].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  const idx = sorted.findIndex((i) => i.slug === slug);
  return {
    newer: idx > 0 ? sorted[idx - 1] : undefined,
    older: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined,
  };
}
