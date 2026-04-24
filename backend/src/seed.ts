import dotenv from "dotenv";
dotenv.config({ override: true });

import mongoose from "mongoose";
import connectDB from "./config/db";
import { Label, Company, Criteria, News, CompanyCriteria, User, BreakingNews, Multimedia, Newsletter, Event, Ad, MonthlyReview } from "./models";

const SECTORS = ["finance", "governance", "tech", "energy", "leadership"] as const;
const REGIONS = ["Afrique de l'Ouest", "Afrique de l'Est", "Afrique Centrale", "Afrique du Nord", "Afrique Australe"] as const;
const IMAGES = {
  finance: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
  governance: "https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&q=80&w=800",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
  energy: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
  leadership: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
  label: "https://images.unsplash.com/photo-1635339001026-6157d0ce02c8?auto=format&fit=crop&q=80&w=400&h=400",
  newsletter: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800",
  events: "https://images.unsplash.com/photo-1475721027185-4048ad27400e?auto=format&fit=crop&q=80&w=800",
  kiosk: "https://images.unsplash.com/photo-1504711434969-e33886168f5a?auto=format&fit=crop&q=80&w=800",
  premium: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
};

const SEVEN_PARAGRAPHS = `
L'excellence stratégique au sein des marchés dynamiques d'Afrique demande une expertise pointue et une compréhension approfondie des enjeux locaux. Notre plateforme se positionne comme le catalyseur de cette transformation, offrant des protocoles de certification rigoureux qui garantissent la transparence et la performance durable.

Dans un environnement en perpétuelle mutation, la gouvernance éthique et la responsabilité sociétale deviennent des piliers incontournables de la confiance institutionnelle. Nous accompagnons les leaders dans l'intégration des critères ESG comme réels leviers de croissance inclusive, transformant les défis environnementaux en opportunités stratégiques.

La digitalisation et l'innovation technologique redéfinissent les chaînes de valeur continentales, permettant une traçabilité sans précédent des impacts positifs. Grâce à nos outils d'analyse en temps réel, les décideurs peuvent désormais piloter leurs engagements avec une précision chirurgicale, assurant que chaque investissement contribue à la prospérité partagée des générations futures.
`.trim();

const VIDEO_EMBEDS = [
  "https://www.youtube.com/embed/ysz5S6PUM-U",
  "https://www.youtube.com/embed/jNQXAC9IVRw",
  "https://www.youtube.com/embed/aqz-KE-bpKQ",
  "https://www.youtube.com/embed/ScMzIvxBSi4",
  "https://www.youtube.com/embed/TiMRwri1xJ8",
];

const AUDIO_EMBEDS = [
  "https://open.spotify.com/embed/episode/7btSleJp305m3kFq8vUf2e",
  "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk",
  "https://open.spotify.com/embed/episode/2TpxZ7JUBn3uw46aR7qd6V",
  "https://open.spotify.com/embed/episode/5XTzM8r9lR1qC7iY2jO7Jn",
  "https://open.spotify.com/embed/episode/3k8Y7v7nqD8m9s2cP5t6Qw",
];

const MAGAZINE_COVERS = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5a?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=900",
];

const labels = Array.from({ length: 15 }).map((_, i) => {
  const sector = SECTORS[i % SECTORS.length];
  return {
    name: {
      fr: `Label d'Excellence ${i + 1} - ${sector.toUpperCase()}`,
      en: `Excellence Label ${i + 1} - ${sector.toUpperCase()}`
    },
    description: { fr: SEVEN_PARAGRAPHS, en: SEVEN_PARAGRAPHS },
    logoUrl: IMAGES.label,
    sector: sector,
    status: "active" as const
  };
});

const companiesData = Array.from({ length: 15 }).map((_, i) => {
  const sector = SECTORS[i % SECTORS.length];
  const region = REGIONS[i % REGIONS.length];
  return {
    name: `Organisation Leader ${i + 1}`,
    description: "Une institution dédiée à l'implémentation des meilleurs standards de gouvernance.",
    sector: sector,
    region: region,
    logoUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 123)}?auto=format&fit=crop&q=80&w=400&h=400`,
    website: "https://example.com",
    labelIndex: i % 15,
    status: "certified" as const,
    score: 85 + (i % 15),
    certOffset: -400 - (i * 15),
    expOffset: 365 + (i * 15)
  };
});

const newsData = Array.from({ length: 15 }).map((_, i) => {
  const sector = SECTORS[i % SECTORS.length];
  const authors = ["Aïcha Bah", "Jean Kabore", "Moussa Sene", "Fatou Sy", "Ismaël Diallo"];
  const author = authors[i % authors.length];
  const newsImages = [
    "https://images.unsplash.com/photo-1542222024-c39e2281f121",
    "https://images.unsplash.com/photo-1551288049-bbbda536339a",
    "https://images.unsplash.com/photo-1451187530177-b012fe2055ce",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    "https://images.unsplash.com/photo-1518186239751-2477cf295195"
  ];
  
  return {
    title: {
      fr: `Rapport Stratégique : L'Impact du Secteur ${sector.toUpperCase()} - #${i + 1}`,
      en: `Strategic Report: ${sector.toUpperCase()} Sector Impact - #${i + 1}`
    },
    slug: `rapport-strategique-${sector}-${i + 1}`,
    content: {
      fr: SEVEN_PARAGRAPHS,
      en: SEVEN_PARAGRAPHS
    },
    excerpt: {
      fr: `Analyse approfondie des nouvelles tendances et opportunités dans le domaine ${sector} ce mois-ci.`,
      en: `In-depth analysis of new trends and opportunities in the ${sector} field this month.`
    },
    author,
    sector,
    published: true,
    publishedAt: new Date(Date.now() - (i * 36 * 60 * 60 * 1000)),
    imageUrl: newsImages[i % newsImages.length] + "?auto=format&fit=crop&q=80&w=800"
  };
});

const multimediaData = Array.from({ length: 15 }).map((_, i) => {
  const sector = SECTORS[i % SECTORS.length];
  const isVideo = i % 2 === 0;
  const mediaImages = [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad"
  ];
  return {
    title: `Insights Audio-Visuels - ${sector.toUpperCase()} #${i + 1}`,
    description: "Explorer les frontières de l'excellence à travers des témoignages et analyses d'experts.",
    type: isVideo ? "video" as const : "audio" as const,
    embedUrl: isVideo
      ? VIDEO_EMBEDS[i % VIDEO_EMBEDS.length]
      : AUDIO_EMBEDS[i % AUDIO_EMBEDS.length],
    coverImageUrl: mediaImages[i % mediaImages.length] + "?auto=format&fit=crop&q=80&w=800",
    sector: sector,
    featured: i < 5,
    published: true,
  };
});

const newsletterData = Array.from({ length: 3 }).map((_, i) => {
  const categories = ["esg", "finance", "governance"] as const;
  const category = categories[i % categories.length];
  return {
    title: {
      fr: `La Lettre DGIAESG — Édition Spéciale #${i + 1}`,
      en: `DGIAESG Newsletter — Special Edition #${i + 1}`
    },
    summary: {
      fr: "Un concentré hebdomadaire d'intelligence économique et de meilleures pratiques de gouvernance.",
      en: "A weekly digest of economic intelligence and governance best practices."
    },
    content: {
      fr: SEVEN_PARAGRAPHS,
      en: SEVEN_PARAGRAPHS
    },
    imageUrl: IMAGES.newsletter,
    category,
    status: "published" as const,
    publishedAt: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)),
    sendEmail: false
  };
});

const eventData = Array.from({ length: 15 }).map((_, i) => {
  const types = ["conference", "workshop", "training", "networking", "certification", "other"] as const;
  const type = types[i % types.length];
  const start = new Date(Date.now() + (i + 1) * 3 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  return {
    title: {
      fr: `Forum Panafricain #${i + 1} — ${type.toUpperCase()}`,
      en: `Panafrican Forum #${i + 1} — ${type.toUpperCase()}`
    },
    description: {
      fr: "Un événement exclusif réunissant les acteurs majeurs de la transformation durable continentale.",
      en: "An exclusive event bringing together major actors of the continental sustainable transformation."
    },
    type,
    startDate: start,
    endDate: end,
    location: {
      fr: `Pavillon d'Excellence ${i + 1}, Casablanca`,
      en: `Excellence Pavilion ${i + 1}, Casablanca`
    },
    organizer: {
      fr: "Alliance DGIAESG",
      en: "DGIAESG Alliance"
    },
    imageUrl: `https://images.unsplash.com/photo-${1475721027185 + (i * 100)}?auto=format&fit=crop&q=80&w=800`,
    registrationUrl: "https://example.com/register",
    agenda: [
      { time: "09:00", label: { fr: "Allocution d'Ouverture", en: "Opening Keynote" }, description: { fr: "Vision stratégique 2030", en: "2030 strategic vision" } },
      { time: "11:00", label: { fr: "Atelier Collaboratif", en: "Collaborative Workshop" }, description: { fr: "Optimisation opérationnelle", en: "Operational optimization" } }
    ],
    published: true,
    featured: i < 3
  };
});

const breakingNewsData = Array.from({ length: 15 }).map((_, i) => ({
  title: `ALERTE : Avancée Majeure en matière de Gouvernance ${SECTORS[i % SECTORS.length].toUpperCase()} !`,
  link: `/news/rapport-strategique-${SECTORS[i % SECTORS.length]}-1`,
  active: true,
  priority: 20 - i
}));

const adsData = Array.from({ length: 15 }).map((_, i) => {
  const positions = ["top", "sidebar", "inline"] as const;
  return {
    title: `Partenaire Stratégique ${i + 1}`,
    imageUrl: `https://images.unsplash.com/photo-${1480000000000 + (i * 75)}?auto=format&fit=crop&q=80&w=800`,
    targetUrl: "https://example.com",
    position: positions[i % positions.length],
    active: true,
    startDate: new Date(),
    impressions: i * 200,
    clicks: i * 12
  };
});

const monthlyReviewData = Array.from({ length: 15 }).map((_, i) => {
  return {
    title: `Revue Intelligence Mensuelle - Vol. ${i + 1}`,
    coverImageUrl: MAGAZINE_COVERS[i % MAGAZINE_COVERS.length],
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    publishDate: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)),
    featured: i === 0,
    published: true
  };
});

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB. Starting full platform seed (15 items per section)...\n");

    // Clear existing data
    await Promise.all([
        User.deleteMany({}),
        Label.deleteMany({}),
        Company.deleteMany({}),
        Criteria.deleteMany({}),
        News.deleteMany({}),
        CompanyCriteria.deleteMany({}),
        Multimedia.deleteMany({}),
        Newsletter.deleteMany({}),
        Event.deleteMany({}),
        BreakingNews.deleteMany({}),
        Ad.deleteMany({}),
        MonthlyReview.deleteMany({})
    ]);
    console.log("Cleared existing data.");

    // Seed Users
    await User.create({
      name: "Administrateur Capital",
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    console.log("Admin user created.");

    // Seed Labels
    const createdLabels = await Label.insertMany(labels);
    console.log(`Created ${createdLabels.length} labels.`);

    // Seed Companies
    const now = new Date();
    const companyDocs = companiesData.map((c) => ({
      ...c,
      labelId: createdLabels[c.labelIndex]._id,
      certificationDate: new Date(now.getTime() + (c.certOffset || 0) * 86400000),
      expiryDate: new Date(now.getTime() + (c.expOffset || 0) * 86400000),
    }));
    await Company.insertMany(companyDocs);
    console.log("Companies seeded.");

    // Seed remaining sections
    await Promise.all([
        News.insertMany(newsData),
        Multimedia.insertMany(multimediaData),
        Newsletter.insertMany(newsletterData),
        Event.insertMany(eventData),
        BreakingNews.insertMany(breakingNewsData),
        Ad.insertMany(adsData),
        MonthlyReview.insertMany(monthlyReviewData)
    ]);

    console.log("All sections seeded with 15 items each.");
    console.log("\nFull platform seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
