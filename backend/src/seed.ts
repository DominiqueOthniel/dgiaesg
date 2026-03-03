import dotenv from "dotenv";
dotenv.config({ override: true });

import mongoose from "mongoose";
import connectDB from "./config/db";
import { Label, Company, Criteria, News, CompanyCriteria, User } from "./models";

const labels = [
  {
    name: "Coopérative Éthique Afrique",
    description: "Label de référence pour les coopératives africaines engagées dans le développement durable et la transparence de gestion.",
    logoUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=400&fit=crop",
    sector: "Multi-sectoriel",
    status: "active" as const,
  },
  {
    name: "Agri-Impact West Africa",
    description: "Certification spécialisée pour l'agriculture durable en Afrique de l'Ouest, garantissant le respect des sols et la juste rémunération.",
    logoUrl: "https://images.unsplash.com/photo-1495539406979-bf61750d38ad?w=400&h=400&fit=crop",
    sector: "Agriculture",
    status: "active" as const,
  },
  {
    name: "Digital Green Sahara",
    description: "Reconnaissance pour les entreprises tech sahéliennes utilisant le numérique pour la transition écologique.",
    logoUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    sector: "Technologie",
    status: "active" as const,
  },
];

const criteriaData = [
  { labelIndex: 0, category: "governance" as const, title: "Transparence Financière", description: "Audit annuel des comptes et accessibilité des rapports aux membres.", weight: 30 },
  { labelIndex: 0, category: "social" as const, title: "Équité de Genre", description: "Représentation paritaire dans les instances de décision.", weight: 20 },
  { labelIndex: 1, category: "environment" as const, title: "Gestion de l'Eau", description: "Optimisation de l'irrigation et protection des nappes phréatiques.", weight: 25 },
];

const companiesData = [
  { name: "Sénégal Bio Co-op", description: "Leader de l'agriculture biologique à Thiès.", sector: "Agriculture", region: "Afrique de l'Ouest", website: "https://senegalbio.sn", labelIndex: 1, status: "certified" as const, score: 88, certOffset: -400, expOffset: 330 },
  { name: "Nairobi Tech Hub", description: "Coopérative de développeurs pour l'impact social.", sector: "Technologie", region: "Afrique de l'Est", website: "https://nairobitech.ke", labelIndex: 2, status: "certified" as const, score: 92, certOffset: -100, expOffset: 630 },
  { name: "Atlas Green Energy", description: "Énergie solaire solidaire au Maroc.", sector: "Énergie", region: "Afrique du Nord", website: "https://atlasgreen.ma", labelIndex: 0, status: "certified" as const, score: 85, certOffset: -200, expOffset: 530 },
];

const newsData = [
  {
    title: "L'essor de la Fintech Verte au Nigéria",
    slug: "essor-fintech-verte-nigeria",
    content: "Une analyse profonde sur comment la finance digitale transforme l'investissement vert à Lagos.",
    excerpt: "Lagos devient le hub de l'innovation écologique en Afrique de l'Ouest.",
    author: "Amadou Diallo",
    sector: "finance",
    published: true,
    publishedAt: new Date("2026-02-10"),
  },
  {
    title: "Gouvernance Coopérative : Le modèle Rwandais",
    slug: "gouvernance-cooperative-modele-rwandais",
    content: "Le Rwanda s'impose comme un exemple de gestion démocratique et transparente pour les coopératives.",
    excerpt: "Découvrez comment Kigali restructure son économie sociale.",
    author: "Faith Mutoni",
    sector: "governance",
    published: true,
    publishedAt: new Date("2026-02-25"),
  },
];

const multimediaData = [
  {
    title: "Podcast : L'Innovation RSE au Cameroun",
    description: "Interview exclusive avec les leaders de la transition éthique à Douala.",
    type: "audio" as const,
    embedUrl: "https://open.spotify.com/embed/episode/7btSleJp305m3kFq8vUf2e",
    coverImageUrl: "https://images.unsplash.com/photo-1478737270239-2fccd2c78623?w=800&fit=crop",
    sector: "leadership" as const,
    featured: true,
    published: true,
  },
  {
    title: "Vidéo : Énergie Solaire au Sahel",
    description: "Reportage sur le terrain sur les nouvelles installations photovoltaïques.",
    type: "video" as const,
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    coverImageUrl: "https://images.unsplash.com/photo-1509391366360-fe5bb6523e5c?w=800&fit=crop",
    sector: "energy" as const,
    featured: true,
    published: true,
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB. Starting African context seed...\n");

    const { Multimedia } = await import("./models");

    // Clear existing data
    await User.deleteMany({});
    await Label.deleteMany({});
    await Company.deleteMany({});
    await Criteria.deleteMany({});
    await News.deleteMany({});
    await CompanyCriteria.deleteMany({});
    await Multimedia.deleteMany({});
    console.log("Cleared existing data.");

    // Seed Users
    await User.create({
      name: "Admin Strategic",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    console.log("Admin user created (admin@example.com / admin123)");

    // Seed Labels
    const createdLabels = await Label.insertMany(labels);
    console.log(`Created ${createdLabels.length} African labels.`);

    // Seed Criteria
    const criteriaWithIds = criteriaData.map((c) => ({
      ...c,
      labelId: createdLabels[c.labelIndex]._id,
    }));
    await Criteria.insertMany(criteriaWithIds.map(({ labelIndex: _, ...rest }) => rest));
    console.log("African Criteria seeded.");

    // Seed Companies
    const now = new Date();
    const companyDocs = companiesData.map((c) => ({
      ...c,
      labelId: createdLabels[c.labelIndex]._id,
      certificationDate: new Date(now.getTime() + (c.certOffset || 0) * 86400000),
      expiryDate: new Date(now.getTime() + (c.expOffset || 0) * 86400000),
    }));
    await Company.insertMany(companyDocs);
    console.log("African Companies seeded.");

    // Seed News
    await News.insertMany(newsData);
    console.log("African News seeded.");

    // Seed Multimedia
    await Multimedia.insertMany(multimediaData);
    console.log("Multimedia seeded.");

    console.log("\nAfrican context seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
