import dotenv from "dotenv";
dotenv.config({ override: true });

import mongoose from "mongoose";
import connectDB from "./config/db";
import { Label, Company, Criteria, News, CompanyCriteria, User } from "./models";

const labels = [
  {
    name: "Coopératives So Responsables",
    description:
      "Label créé par Coop FR pour valoriser les coopératives engagées dans une démarche RSE structurée. Il évalue les pratiques de gouvernance, les engagements sociaux et environnementaux à travers un référentiel de 5 chapitres de pratiques et 3 chapitres de résultats.",
    logoUrl: "",
    sector: "Multi-sectoriel",
    status: "active" as const,
  },
  {
    name: "Agri Confiance",
    description:
      "Label de La Coopération Agricole, existant depuis 1992, qui certifie les coopératives agricoles engagées dans une démarche de qualité et de développement durable. Le référentiel couvre la qualité de l'eau, la biodiversité, la fertilisation et les pratiques phytosanitaires.",
    logoUrl: "",
    sector: "Agriculture",
    status: "active" as const,
  },
  {
    name: "B Corp",
    description:
      "Certification internationale qui évalue l'impact global d'une entreprise selon cinq domaines : gouvernance, collaborateurs, collectivité, environnement et clients. Un score minimum de 80 points sur 200 est requis pour obtenir la certification.",
    logoUrl: "",
    sector: "Multi-sectoriel",
    status: "active" as const,
  },
  {
    name: "Fairtrade / Max Havelaar",
    description:
      "Certification de commerce équitable garantissant des conditions commerciales justes pour les producteurs des pays en développement. La certification couvre toute la chaîne d'approvisionnement et est vérifiée par FLOCERT, organisme accrédité ISO 17065.",
    logoUrl: "",
    sector: "Commerce équitable",
    status: "active" as const,
  },
  {
    name: "Label RSE Engagé",
    description:
      "Label généraliste de responsabilité sociétale des entreprises, basé sur la norme ISO 26000. Il évalue la maturité des démarches RSE des organisations à travers une grille de critères couvrant les droits humains, l'environnement et la gouvernance.",
    logoUrl: "",
    sector: "Multi-sectoriel",
    status: "active" as const,
  },
];

const criteriaData = [
  { labelIndex: 0, category: "governance" as const, title: "Gouvernance démocratique", description: "Évaluation des pratiques de gouvernance participative et démocratique au sein de la coopérative.", weight: 20 },
  { labelIndex: 0, category: "social" as const, title: "Engagement social", description: "Mesure des actions en faveur de l'emploi, de la formation, de la diversité.", weight: 20 },
  { labelIndex: 1, category: "environment" as const, title: "Qualité de l'eau", description: "Protection des ressources en eau.", weight: 25 },
  { labelIndex: 2, category: "governance" as const, title: "Gouvernance", description: "Mission d'entreprise, éthique, transparence.", weight: 20 },
];

const companiesData = [
  { name: "Coopérative Agricole du Soleil", description: "Coopérative viticole.", sector: "Agriculture", region: "Occitanie", website: "https://example.com/coop-soleil", labelIndex: 0, status: "certified" as const, score: 82, certOffset: -365, expOffset: 730 },
  { name: "TechCoop Solutions", description: "Coopérative de services numériques.", sector: "Technologie", region: "Île-de-France", website: "https://example.com/techcoop", labelIndex: 2, status: "certified" as const, score: 95, certOffset: -180, expOffset: 900 },
];

const newsData = [
  {
    title: "Nouvelle édition du référentiel So Responsables 2026",
    slug: "nouvelle-edition-referentiel-so-responsables-2026",
    content: "Coop FR a publié la nouvelle édition du référentiel So Responsables.",
    excerpt: "Coop FR publie la nouvelle édition du référentiel So Responsables.",
    author: "Marie Dupont",
    published: true,
    publishedAt: new Date("2026-01-15"),
  },
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB. Starting seed...\n");

    // Clear existing data
    await User.deleteMany({});
    await Label.deleteMany({});
    await Company.deleteMany({});
    await Criteria.deleteMany({});
    await News.deleteMany({});
    await CompanyCriteria.deleteMany({});
    console.log("Cleared existing data.");

    // Seed Users
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    console.log("Admin user created (admin@example.com / admin123)");

    // Seed Labels
    const createdLabels = await Label.insertMany(labels);
    console.log(`Created ${createdLabels.length} labels.`);

    // Seed Criteria
    const criteriaWithIds = criteriaData.map((c) => ({
      ...c,
      labelId: createdLabels[c.labelIndex]._id,
    }));
    await Criteria.insertMany(criteriaWithIds.map(({ labelIndex: _, ...rest }) => rest));
    console.log("Criteria seeded.");

    // Seed Companies
    const now = new Date();
    const companyDocs = companiesData.map((c) => ({
      ...c,
      labelId: createdLabels[c.labelIndex]._id,
      certificationDate: new Date(now.getTime() + c.certOffset * 86400000),
      expiryDate: new Date(now.getTime() + c.expOffset * 86400000),
    }));
    await Company.insertMany(companyDocs);
    console.log("Companies seeded.");

    // Seed News
    await News.insertMany(newsData);
    console.log("News seeded.");

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
