import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User";
import News from "../models/News";
import Label from "../models/Label";
import Company from "../models/Company";
import MonthlyReview from "../models/MonthlyReview";
import Multimedia from "../models/Multimedia";

dotenv.config({ path: path.join(__dirname, "../../.env") });

// Backend enums as internal keys
const SECTORS = ['finance', 'tech', 'energy', 'governance', 'leadership'];
const REGIONS = ['Afrique de l\'Ouest', 'Afrique de l\'Est', 'Afrique Centrale', 'Afrique du Nord', 'Afrique Australe'];

const IMAGES = {
    Agriculture: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
    tech: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    energy: "https://images.unsplash.com/photo-1509391366360-fe51da00853c?auto=format&fit=crop&q=80&w=800",
    finance: "https://images.unsplash.com/photo-1591696208181-1c0c79462ecd?auto=format&fit=crop&q=80&w=800",
    governance: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    leadership: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    premium: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    kiosk: "https://images.unsplash.com/photo-1544640805-3536ca2bb700?auto=format&fit=crop&q=80&w=800"
};

const SEVEN_PARAGRAPHS = `
L'excellence stratégique exige une vision claire et une exécution rigoureuse au sein des marchés dynamiques d'Afrique. Pour réussir, les organisations doivent naviguer entre les opportunités locales et les standards de conformité internationaux en constante évolution. Cela nécessite une adaptation agile des structures de gouvernance interne pour garantir une résilience à long terme face aux chocs économiques mondiaux.

Dans ce contexte, la transparence devient le pilier central de la confiance des investisseurs et des parties prenantes. Les rapports de durabilité ne sont plus de simples documents de communication, mais des outils de pilotage stratégique permettant d'identifier les risques environnementaux et sociaux avant qu'ils ne deviennent critiques. Une approche proactive de la gestion des critères ESG permet ainsi de transformer des contraintes réglementaires en réels avantages compétitifs sur la scène continentale.

Le renforcement des capacités locales est également crucial pour soutenir une croissance inclusive et durable. Investir dans le capital humain et les technologies propres favorise l'innovation transversale, réduisant ainsi la dépendance aux ressources externes non renouvelables. Cette transition vers une économie circulaire offre des perspectives inédites pour les PME africaines qui souhaitent se positionner comme des leaders de la transformation verte du continent.

Parallèlement, la digitalisation des processus permet une traçabilité sans précédent des chaînes de valeur. Grâce aux outils de monitoring en temps réel, les décideurs peuvent désormais ajuster leurs stratégies d'impact avec une précision chirurgicale, minimisant ainsi les gaspillages et optimisant l'allocation des ressources financières. Cette révolution numérique au service de l'éthique modifie profondément le paysage entrepreneurial et redéfinit les codes de la performance globale.

La collaboration intersectorielle joue un rôle catalyseur dans l'accélération des objectifs de développement durable. En mutualisant les expertises techniques et les réseaux d'influence, les acteurs publics et privés peuvent générer des synergies capables de résoudre des défis complexes tels que l'accès à l'énergie propre et la sécurité alimentaire. Ces partenariats stratégiques sont le moteur indispensable d'une économie sociale et solidaire robuste et pérenne.

Toutefois, la route vers une certitude totale en matière de labellisation éthique reste semée d'embûches. Il est impératif de maintenir une vigilance constante contre le "greenwashing" en imposant des contrôles de terrain rigoureux et indépendants. Seule une exigence de vérité absolue permettra de crédibiliser les efforts de transition et d'assurer que les capitaux soient dirigés vers les projets ayant un impact positif réel et mesurable.

Enfin, l'avenir de la prospérité africaine repose sur notre capacité à intégrer l'éthique au cœur de chaque décision d'investissement. En plaçant l'humain et la planète sur un pied d'égalité avec le profit, nous construisons un héritage stable pour les générations futures. C'est cet engagement profond pour une valeur partagée qui définit la mission de COOP_LOGIC au service des leaders de demain.
`.trim();

const seedEverything = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected successfully.");

        // --- 1. SEED LABELS ---
        console.log("Seeding Labels...");
        await Label.deleteMany({});
        const labelDocs = [];
        for (let i = 1; i <= 13; i++) {
            const sector = SECTORS[i % SECTORS.length];
            const label = await Label.create({
                name: `Protocole de Validation ${i} - ${sector.toUpperCase()}`,
                description: SEVEN_PARAGRAPHS,
                logoUrl: IMAGES[sector as keyof typeof IMAGES],
                sector: sector,
                status: "active"
            });
            labelDocs.push(label);
        }

        // --- 2. SEED COMPANIES ---
        console.log("Seeding Companies...");
        await Company.deleteMany({});
        for (let i = 1; i <= 13; i++) {
            const sector = SECTORS[i % SECTORS.length];
            const region = REGIONS[i % REGIONS.length];
            const label = labelDocs[i % labelDocs.length];
            await Company.create({
                name: `Entreprise d'Excellence ${i}`,
                description: SEVEN_PARAGRAPHS,
                sector: sector,
                region: region,
                logoUrl: IMAGES[sector as keyof typeof IMAGES],
                website: "https://example.com",
                labelId: label._id,
                certificationDate: new Date(),
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                score: 75 + (i % 20),
                socialScore: 80 + (i % 15),
                governanceScore: 85 + (i % 10),
                status: "certified"
            });
        }

        // --- 3. SEED NEWS ---
        console.log("Seeding News...");
        await News.deleteMany({});
        for (let i = 1; i <= 13; i++) {
            const isPremium = i > 10;
            const sector = SECTORS[i % SECTORS.length];
            await News.create({
                title: isPremium ? `[PREMIUM] Analyse Stratégique Volume ${i}` : `Actualité Sectorielle ${i} : Focus ${sector.toUpperCase()}`,
                slug: `news-item-${i}`,
                content: SEVEN_PARAGRAPHS,
                excerpt: `Découvrez notre analyse détaillée sur les enjeux majeurs du secteur ${sector} pour ce mois...`,
                author: "Expert COOP_LOGIC",
                sector: sector,
                imageUrl: isPremium ? IMAGES.premium : IMAGES[sector as keyof typeof IMAGES],
                premium: isPremium,
                published: true,
                publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            });
        }

        // --- 4. SEED KIOSK (Monthly Reviews) ---
        console.log("Seeding Monthly Reviews...");
        await MonthlyReview.deleteMany({});
        for (let i = 1; i <= 13; i++) {
            const isFeatured = i > 10;
            await MonthlyReview.create({
                title: isFeatured ? `Édition Spéciale : Rapport Annuel ESG ${i}` : `Revue Mensuelle - Édition ${i}`,
                coverImageUrl: isFeatured ? IMAGES.premium : IMAGES.kiosk,
                pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                publishDate: new Date(Date.now() - (13 - i) * 30 * 24 * 60 * 60 * 1000),
                featured: isFeatured,
                published: true
            });
        }

        // --- 5. SEED MULTIMEDIA ---
        console.log("Seeding Multimedia...");
        await Multimedia.deleteMany({});
        for (let i = 1; i <= 13; i++) {
            const isFeatured = i > 10;
            const sector = SECTORS[i % SECTORS.length];
            await Multimedia.create({
                title: isFeatured ? `[EXCLUSIF] Masterclass Leadership ${i}` : `Interview Expert : Focus ${sector.toUpperCase()} ${i}`,
                description: SEVEN_PARAGRAPHS.substring(0, 900),
                type: i % 2 === 0 ? "video" : "audio",
                embedUrl: i % 2 === 0 ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : "https://open.spotify.com/embed/episode/7fK2YFzO1O2D8kGg8X3X1W",
                coverImageUrl: IMAGES[sector as keyof typeof IMAGES],
                sector: sector,
                featured: isFeatured,
                published: true
            });
        }

        console.log("Full Seeding Completed Successfully! (13 items per section including Companies)");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedEverything();
