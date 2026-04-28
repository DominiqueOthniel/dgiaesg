export type ContributionCategory =
  | "Analyse"
  | "Données"
  | "Politique publique"
  | "Marchés & finance"
  | "Climat"
  | "Gouvernance"
  | "Social";

export type ContributionFormat = "Tribune" | "Étude de cas" | "Note de synthèse" | "Données & indicateurs";

export type LocalizedText = { fr: string; en: string };

export type Contribution = {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  authorName: string;
  authorOrg?: string;
  authorRole?: string;
  country?: string;
  city?: string;
  category: ContributionCategory;
  format: ContributionFormat;
  tags: string[];
  publishedAt: string; // ISO
  readingMinutes: number;
  featured?: boolean;
};

export const CONTRIBUTIONS: Contribution[] = [
  {
    id: "c-001",
    slug: "financement-vert-afrique-ouest-etat-des-lieux-2025",
    title: {
      fr: "Financement vert en Afrique de l’Ouest : état des lieux 2025",
      en: "Green finance in West Africa: 2025 outlook",
    },
    excerpt: {
      fr: "Panorama des instruments (green bonds, blended finance, garanties) et des conditions de réussite pour passer de l’intention à l’exécution.",
      en: "A practical overview of instruments (green bonds, blended finance, guarantees) and what it takes to move from intent to execution.",
    },
    content: {
      fr:
        "Cette contribution propose une lecture opérationnelle du financement vert en Afrique de l’Ouest.\n\n" +
        "Elle distingue les instruments réellement mobilisés (obligations vertes, prêts à impact, garanties, mécanismes de partage de risque) des annonces.\n\n" +
        "Points clés :\n" +
        "- les facteurs de crédibilité (traçabilité, reporting, gouvernance)\n" +
        "- les obstacles d’exécution (pipeline, maturité projet, coûts de conformité)\n" +
        "- des pistes d’action pour accélérer (standardisation, assistance technique, transparence des données)\n\n" +
        "Note : les chiffres et exemples doivent être documentés par des sources primaires ou institutionnelles.",
      en:
        "This contribution offers an operational perspective on green finance in West Africa.\n\n" +
        "It separates widely-used instruments (green bonds, impact loans, guarantees, risk-sharing mechanisms) from mere announcements.\n\n" +
        "Key takeaways:\n" +
        "- credibility drivers (traceability, reporting, governance)\n" +
        "- execution bottlenecks (pipeline, project maturity, compliance costs)\n" +
        "- actionable accelerators (standardization, technical assistance, data transparency)\n\n" +
        "Note: figures and examples should be backed by primary or institutional sources.",
    },
    authorName: "Dr. Fatoumata Bah",
    authorOrg: "Université de Conakry",
    authorRole: "Chercheuse – finance durable",
    country: "Guinée",
    city: "Conakry",
    category: "Marchés & finance",
    format: "Étude de cas",
    tags: ["Green bonds", "Blended finance", "Reporting", "Risque"],
    publishedAt: "2026-03-12T10:00:00Z",
    readingMinutes: 8,
    featured: true,
  },
  {
    id: "c-002",
    slug: "rse-miniere-katanga-entre-engagement-et-realite",
    title: {
      fr: "RSE minière au Katanga : entre engagement et réalité",
      en: "Mining CSR in Katanga: between commitments and reality",
    },
    excerpt: {
      fr: "Ce que les plans RSE promettent, ce que les communautés vivent, et comment mesurer des progrès vérifiables (indicateurs, mécanismes de plainte, audits).",
      en: "What CSR plans promise, what communities experience, and how to measure verifiable progress (indicators, grievance mechanisms, audits).",
    },
    content: {
      fr:
        "Une tribune terrain sur la RSE minière : gouvernance locale, impact social, mécanismes de plainte, et conditions d’un dialogue crédible.\n\n" +
        "Proposition : passer de la communication à des indicateurs publics et auditables (eau, sécurité, emploi local, chaîne d’approvisionnement).",
      en:
        "A field-driven opinion piece on mining CSR: local governance, social impact, grievance mechanisms, and conditions for credible dialogue.\n\n" +
        "Proposal: move from communication to public, auditable indicators (water, safety, local jobs, supply chain).",
    },
    authorName: "Emmanuel Kabila",
    authorOrg: "Centre d’Études Environnementales",
    authorRole: "Consultant RSE",
    country: "RDC",
    city: "Lubumbashi",
    category: "Gouvernance",
    format: "Tribune",
    tags: ["Mines", "Communautés", "Transparence", "Audit"],
    publishedAt: "2026-02-18T09:30:00Z",
    readingMinutes: 6,
  },
  {
    id: "c-003",
    slug: "reporting-ifrs-s1-s2-defis-pme-africaines",
    title: {
      fr: "Reporting IFRS S1/S2 : défis concrets pour les PME africaines",
      en: "IFRS S1/S2 reporting: practical challenges for African SMEs",
    },
    excerpt: {
      fr: "Un guide clair : ce qui est attendu, comment démarrer sans “sur-implémenter”, et quelles données prioriser la première année.",
      en: "A clear guide: what’s expected, how to start without over-implementing, and which data to prioritize in year one.",
    },
    content: {
      fr:
        "Note de synthèse : IFRS S1/S2, exigences minimales, et plan d’adoption en 90 jours.\n\n" +
        "Approche recommandée : matérialité, gouvernance, données de base, puis montée en puissance.\n\n" +
        "Livrables : registre risques/opportunités, tableau de bord KPI, et calendrier de reporting.",
      en:
        "Brief: IFRS S1/S2 minimum requirements and a 90-day adoption plan.\n\n" +
        "Recommended approach: materiality, governance, baseline data, then scale.\n\n" +
        "Deliverables: risk/opportunity register, KPI dashboard, reporting calendar.",
    },
    authorName: "Mariam Traoré",
    authorOrg: "Traoré & Partners",
    authorRole: "Consultante reporting",
    country: "Sénégal",
    city: "Dakar",
    category: "Données",
    format: "Note de synthèse",
    tags: ["IFRS", "S1", "S2", "PME"],
    publishedAt: "2026-01-27T14:15:00Z",
    readingMinutes: 5,
  },
  {
    id: "c-004",
    slug: "kpi-eau-urbain-methode-donnees-ouvertes",
    title: {
      fr: "KPI eau en milieu urbain : une méthode simple avec données ouvertes",
      en: "Urban water KPIs: a simple method using open data",
    },
    excerpt: {
      fr: "Proposition d’un mini-protocole (sources, nettoyage, limites) pour produire des KPI robustes et comparables entre villes.",
      en: "A mini-protocol (sources, cleaning, limitations) to produce robust, comparable KPIs across cities.",
    },
    content: {
      fr:
        "Contribution orientée données : sources ouvertes, méthodologie de nettoyage, et limites.\n\n" +
        "Objectif : rendre des KPI comparables d’une ville à l’autre, sans masquer l’incertitude.\n\n" +
        "Annexes attendues : tableau, dictionnaire de variables, et notes de calcul.",
      en:
        "Data-focused contribution: open sources, cleaning methodology, and limitations.\n\n" +
        "Goal: make KPIs comparable across cities without hiding uncertainty.\n\n" +
        "Expected appendices: dataset, data dictionary, and calculation notes.",
    },
    authorName: "Sarah Mensah",
    authorOrg: "DGIAESG Data Desk",
    authorRole: "Journaliste données",
    country: "Ghana",
    city: "Accra",
    category: "Données",
    format: "Données & indicateurs",
    tags: ["Open data", "Eau", "Méthodologie", "KPI"],
    publishedAt: "2025-12-05T08:00:00Z",
    readingMinutes: 7,
  },
];

