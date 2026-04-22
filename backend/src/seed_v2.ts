import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db";
import { Label, Company, News } from "./models";

async function seedV2() {
  try {
    await connectDB();
    console.log("Connected to MongoDB. Adding supplementary realistic data...\n");

    // 1. Get some existing labels to link to companies
    const labels = await Label.find().limit(5);
    if (labels.length === 0) {
        console.error("No labels found. Please run the initial seed first.");
        process.exit(1);
    }

    // 2. Add Realistic Companies
    const newCompanies = [
      {
        name: "EcoBank Transnational",
        description: "Le leader de la banque panafricaine engagé pour l'inclusion financière.",
        sector: "finance",
        region: "Afrique de l'Ouest",
        logoUrl: "https://logos-world.net/wp-content/uploads/2021/02/Ecobank-Logo.png",
        website: "https://www.ecobank.com",
        labelId: labels[0]._id,
        status: "certified",
        score: 94,
        certificationDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        name: "OCP Group",
        description: "Leader mondial du marché du phosphate et de ses dérivés.",
        sector: "governance",
        region: "Afrique du Nord",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/OCP_Group_logo.svg/1200px-OCP_Group_logo.svg.png",
        website: "https://www.ocpgroup.ma",
        labelId: labels[1]._id,
        status: "certified",
        score: 92,
        certificationDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        name: "Safaricom PLC",
        description: "Principal fournisseur de télécommunications au Kenya et innovateur mobile.",
        sector: "tech",
        region: "Afrique de l'Est",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Safaricom_logo.svg/2560px-Safaricom_logo.svg.png",
        website: "https://www.safaricom.co.ke",
        labelId: labels[2]._id,
        status: "certified",
        score: 96,
        certificationDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const company of newCompanies) {
        await Company.updateOne({ name: company.name }, company, { upsert: true });
    }
    console.log("Realistic companies added/updated.");

    // 3. Add Realistic News
    const newNews = [
      {
        title: { fr: "Transition Énergétique : Le Maroc montre la voie", en: "Energy Transition: Morocco Leads the Way" },
        slug: "transition-energetique-maroc-v2",
        content: { fr: "Le Maroc continue d'investir massivement dans le solaire et l'éolien...", en: "Morocco continues to invest heavily in solar and wind energy..." },
        excerpt: { fr: "Focus sur les projets Noor et les ambitions vertes du Royaume.", en: "Focus on the Noor projects and the Kingdom's green ambitions." },
        author: "Ahmad Al-Mansour",
        sector: "energy" as const,
        published: true,
        publishedAt: new Date(),
        imageUrl: "https://images.unsplash.com/photo-1466611653911-954fffc11562?w=800"
      },
      {
        title: { fr: "L'essor de la Fintech en Afrique de l'Ouest", en: "The Rise of Fintech in West Africa" },
        slug: "essor-fintech-afrique-ouest-v2",
        content: { fr: "Les startups nigérianes et sénégalaises transforment le paysage bancaire.", en: "Nigerian and Senegalese startups are transforming the banking landscape." },
        excerpt: { fr: "Comment le paiement mobile favorise l'inclusion financière.", en: "How mobile payments are driving financial inclusion." },
        author: "Fatou Diop",
        sector: "finance" as const,
        published: true,
        publishedAt: new Date(),
        imageUrl: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800"
      }
    ];

    for (const newsItem of newNews) {
        await News.updateOne({ slug: newsItem.slug }, newsItem, { upsert: true });
    }
    console.log("Realistic news added/updated.");

    console.log("\nSupplementary seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seedV2();
