import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import News from "../models/News";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedProData = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected successfully.");

        // 1. Create/Update a PRO User
        const proUser = await User.findOneAndUpdate(
            { email: "pro@example.com" },
            {
                name: "Expert Consultant",
                username: "pro_expert",
                password: "password123", // Will be hashed by pre-save hook
                role: "viewer",
                isPro: true,
                proExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            },
            { upsert: true, new: true }
        );
        console.log("PRO User created/updated:", proUser.email);

        // 2. Create a Premium News Article
        const premiumNews = await News.findOneAndUpdate(
            { slug: "analyse-esg-2026-premium" },
            {
                title: "[PREMIUM] Rapport d'Analyse ESG 2026 : Tendances Critiques",
                content: `
# Analyse Stratégique ESG 2026
L'année 2026 marque un tournant pour la finance durable en Afrique centrale. Ce rapport exclusif détaille les nouveaux mécanismes de régulation.

## Section 1 : Introduction
La conformité aux normes ISR devient un impératif pour les banques de développement. 

## Section 2 : Données Exclusives (Visible uniquement par PRO)
Nos enquêtes de terrain révèlent que 45% des entreprises certifiées ont augmenté leur score de gouvernance de plus de 10 points en 12 mois.

## Section 3 : Recommandations Stratégiques
Il est conseillé aux investisseurs de privilégier les secteurs à forte intensité technologique propre.
        `.trim(),
                excerpt: "Une analyse approfondie des tendances ESG pour l'année 2026, réservée aux membres PRO.",
                author: "Dr. Analyste ESG",
                sector: "finance",
                premium: true,
                published: true,
                publishedAt: new Date(),
            },
            { upsert: true, new: true }
        );
        console.log("Premium News created/updated:", premiumNews.title);

        // 3. Create a Simple News Article for comparison
        const simpleNews = await News.findOneAndUpdate(
            { slug: "actualite-esg-standard" },
            {
                title: "Lancement de la nouvelle plateforme de certification",
                content: `
La nouvelle plateforme de certification ESG est désormais opérationnelle. Elle permet aux entreprises de soumettre leurs dossiers en ligne.
Cette initiative vise à simplifier les processus administratifs pour les PME.
Plusieurs experts ont salué cette avancée technologique.
        `.trim(),
                excerpt: "Détails sur l'ouverture de la plateforme de certification interactive pour les entreprises.",
                author: "Rédaction COOP",
                sector: "tech",
                premium: false,
                published: true,
                publishedAt: new Date(),
            },
            { upsert: true, new: true }
        );
        console.log("Simple News created/updated:", simpleNews.title);

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedProData();
