import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import News from "../models/News";
import Label from "../models/Label";
import Company from "../models/Company";
import MonthlyReview from "../models/MonthlyReview";
import Multimedia from "../models/Multimedia";
import Criteria from "../models/Criteria";
import Newsletter from "../models/Newsletter";
import Event from "../models/Event";
import BreakingNews from "../models/BreakingNews";

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
    kiosk: "https://images.unsplash.com/photo-1544640805-3536ca2bb700?auto=format&fit=crop&q=80&w=800",
    newsletter: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=800",
    events: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
};

const NEWSLETTER_CATEGORIES: Array<"esg" | "finance" | "governance" | "technology" | "general"> = [
    "esg", "finance", "governance", "technology", "general"
];

const EVENT_TYPES: Array<"workshop" | "conference" | "training" | "networking" | "certification" | "other"> = [
    "conference", "workshop", "training", "networking", "certification", "other"
];

const SEVEN_PARAGRAPHS = `
L'excellence stratégique exige une vision claire et une exécution rigoureuse au sein des marchés dynamiques d'Afrique. Pour réussir, les organisations doivent naviguer entre les opportunités locales et les standards de conformité internationaux en constante évolution. Cela nécessite une adaptation agile des structures de gouvernance interne pour garantir une résilience à long terme face aux chocs économiques mondiaux.

Dans ce contexte, la transparence devient le pilier central de la confiance des investisseurs et des parties prenantes. Les rapports de durabilité ne sont plus de simples documents de communication, mais des outils de pilotage stratégique permettant d'identifier les risques environnementaux et sociaux avant qu'ils ne deviennent critiques. Une approche proactive de la gestion des critères ESG permet ainsi de transformer des contraintes réglementaires en réels avantages compétitifs sur la scène continentale.

Le renforcement des capacités locales est également crucial pour soutenir une croissance inclusive et durable. Investir dans le capital humain et les technologies propres favorise l'innovation transversale, réduisant ainsi la dépendance aux ressources externes non renouvelables. Cette transition vers une économie circulaire offre des perspectives inédites pour les PME africaines qui souhaitent se positionner comme des leaders de la transformation verte du continent.

Parallèlement, la digitalisation des processus permet une traçabilité sans précédent des chaînes de valeur. Grâce aux outils de monitoring en temps réel, les décideurs peuvent désormais ajuster leurs stratégies d'impact avec une précision chirurgicale, minimisant ainsi les gaspillages et optimisant l'allocation des ressources financières. Cette révolution numérique au service de l'éthique modifie profondément le paysage entrepreneurial et redéfinit les codes de la performance globale.

La collaboration intersectorielle joue un rôle catalyseur dans l'accélération des objectifs de développement durable. En mutualisant les expertises techniques et les réseaux d'influence, les acteurs publics et privés peuvent générer des synergies capables de résoudre des défis complexes tels que l'accès à l'énergie propre et la sécurité alimentaire. Ces partenariats stratégiques sont le moteur indispensable d'une économie sociale et solidaire robuste et pérenne.

Toutefois, la route vers une certitude totale en matière de labellisation éthique reste semée d'embûches. Il est impératif de maintenir une vigilance constante contre le "greenwashing" en imposant des contrôles de terrain rigoureux et indépendants. Seule une exigence de vérité absolue permettra de crédibiliser les efforts de transition et d'assurer que les capitaux soient dirigés vers les projets ayant un impact positif réel et mesurable.

Enfin, l'avenir de la prospérité africaine repose sur notre capacité à intégrer l'éthique au cœur de chaque décision d'investissement. En plaçant l'humain et la planète sur un pied d'égalité avec le profit, nous construisons un héritage stable pour les générations futures. C'est cet engagement profond pour une valeur partagée qui définit la mission de COOP_LOGIC au service des leaders de demain.
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

const seedEverything = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected successfully.");

        // --- 1. SEED LABELS ---
        console.log("Seeding Labels...");
        await Label.deleteMany({});
        const labelDocs = [];
        for (let i = 1; i <= 30; i++) {
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
        for (let i = 1; i <= 30; i++) {
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
        for (let i = 1; i <= 30; i++) {
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
        for (let i = 1; i <= 30; i++) {
            const isFeatured = i > 10;
            await MonthlyReview.create({
                title: isFeatured ? `Édition Spéciale : Rapport Annuel ESG ${i}` : `Revue Mensuelle - Édition ${i}`,
                coverImageUrl: isFeatured ? IMAGES.premium : MAGAZINE_COVERS[i % MAGAZINE_COVERS.length],
                pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                publishDate: new Date(Date.now() - (13 - i) * 30 * 24 * 60 * 60 * 1000),
                featured: isFeatured,
                published: true
            });
        }

        // --- 5. SEED MULTIMEDIA ---
        console.log("Seeding Multimedia...");
        await Multimedia.deleteMany({});
        for (let i = 1; i <= 30; i++) {
            const isFeatured = i > 10;
            const sector = SECTORS[i % SECTORS.length];
            const isVideo = i % 2 === 0;
            await Multimedia.create({
                title: isFeatured ? `[EXCLUSIF] Masterclass Leadership ${i}` : `Interview Expert : Focus ${sector.toUpperCase()} ${i}`,
                description: SEVEN_PARAGRAPHS.substring(0, 900),
                type: isVideo ? "video" : "audio",
                embedUrl: isVideo
                    ? VIDEO_EMBEDS[i % VIDEO_EMBEDS.length]
                    : AUDIO_EMBEDS[i % AUDIO_EMBEDS.length],
                coverImageUrl: IMAGES[sector as keyof typeof IMAGES],
                sector: sector,
                featured: isFeatured,
                published: true
            });
        }

        // --- 6. SEED CRITERIA ---
        console.log("Seeding Criteria Matrix...");
        await Criteria.deleteMany({});
        const categories: ("governance" | "environment" | "social" | "economic" | "quality")[] = ["governance", "environment", "social", "economic", "quality"];

        for (const label of labelDocs) {
            for (const category of categories) {
                for (let i = 1; i <= 3; i++) {
                    await Criteria.create({
                        labelId: label._id,
                        category: category,
                        title: `Critère ${category.toUpperCase()} ${i} pour ${label.name}`,
                        description: `Exigences normatives détaillées pour le pilier ${category}. Ce critère évalue la conformité stratégique et l'impact opérationnel selon les standards internationaux.`,
                        weight: 10 + Math.floor(Math.random() * 15)
                    });
                }
            }
        }

        // --- 7. SEED NEWSLETTERS ---
        console.log("Seeding Newsletters...");
        await Newsletter.deleteMany({});
        for (let i = 1; i <= 30; i++) {
            const category = NEWSLETTER_CATEGORIES[i % NEWSLETTER_CATEGORIES.length];
            await Newsletter.create({
                title: {
                    fr: `Lettre Stratégique #${i} — Focus ${category.toUpperCase()}`,
                    en: `Strategic Letter #${i} — ${category.toUpperCase()} Focus`
                },
                summary: {
                    fr: "Synthèse éditoriale des tendances ESG, marchés et gouvernance à impact.",
                    en: "Editorial summary of ESG, markets, and governance impact trends."
                },
                content: {
                    fr: SEVEN_PARAGRAPHS,
                    en: SEVEN_PARAGRAPHS
                },
                imageUrl: IMAGES.newsletter,
                category,
                status: "published",
                publishedAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000),
                sendEmail: false
            });
        }

        // --- 8. SEED EVENTS ---
        console.log("Seeding Events...");
        await Event.deleteMany({});
        for (let i = 1; i <= 30; i++) {
            const type = EVENT_TYPES[i % EVENT_TYPES.length];
            const start = new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000);
            const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
            await Event.create({
                title: {
                    fr: `Forum Coopératif ${i} — ${type.toUpperCase()}`,
                    en: `Cooperative Forum ${i} — ${type.toUpperCase()}`
                },
                description: {
                    fr: SEVEN_PARAGRAPHS.substring(0, 600),
                    en: SEVEN_PARAGRAPHS.substring(0, 600)
                },
                type,
                startDate: start,
                endDate: end,
                location: {
                    fr: `Centre de Conférence ${i}, Dakar`,
                    en: `Conference Center ${i}, Dakar`
                },
                organizer: {
                    fr: "COOP_LOGIC",
                    en: "COOP_LOGIC"
                },
                imageUrl: IMAGES.events,
                registrationUrl: "https://example.com/register",
                agenda: [
                    { time: "09:00", label: { fr: "Accueil & Enregistrement", en: "Registration" }, description: { fr: "Check-in et badges", en: "Check-in & badges" } },
                    { time: "10:30", label: { fr: "Panel d’Experts", en: "Expert Panel" }, description: { fr: "Stratégies sectorielles", en: "Sector strategies" } }
                ],
                published: true,
                featured: i <= 3
            });
        }

        // --- 9. SEED BREAKING NEWS ---
        console.log("Seeding Breaking News...");
        await BreakingNews.deleteMany({});
        for (let i = 1; i <= 30; i++) {
            await BreakingNews.create({
                title: `Flash #${i} — Mise à jour stratégique sur la gouvernance et l'impact`,
                link: `/news/news-item-${(i % 13) + 1}`,
                active: true,
                priority: 10 - i
            });
        }

        console.log("Full Seeding Completed Successfully! (13 items per section + Criteria Matrix)");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedEverything();
