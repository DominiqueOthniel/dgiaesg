import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    fr: {
        translation: {
            nav: {
                home: "Accueil",
                labels: "Portails Label",
                directory: "Registre de Transparence",
                news: "Journal",
                kiosk: "Kiosque",
                mediatique: "Médiatique",
                multimedia: "Médiathèque",
                pricing: "Premium",
                login: "Se Connecter",
                logout: "Déconnexion",
                profile: "Profil",
                org_hub: "Audit & Gestion",
                library: "Ma Bibliothèque",
                sectors: "Secteurs",
                more: "Plus",
                events: "Agenda & Événements",
                all_services: "Tous les Services",
                label_process: "Processus de Label",
                partners: "Partenariats",
                support: "Support & FAQ"
            },
            theme: {
                title: "Personnalisation",
                subtitle: "Apparence & Thèmes",
                palette: "Palette",
                save_desc: "Votre sélection est enregistrée localement et sera appliquée à chaque visite.",
                themes: {
                    default: "Coop Red (Défaut)",
                    forest: "Forest Prestige",
                    ocean: "Océan Profond",
                    bordeaux: "Bordeaux Royal",
                    charcoal: "Charbon Élégant",
                    emerald: "Émeraude Classique"
                },
                select: "Sélectionner un thème",
                applied: "Thème appliqué"
            },
            events: {
                title: "Agenda & Événements",
                subtitle: "Découvrez les prochains ateliers, conférences et formations certifiantes.",
                upcoming: "Événements à Venir",
                featured: "À l'Affiche",
                details: "Voir l'Agenda",
                register: "S'inscrire à l'événement",
                location: "Lieu",
                organizer: "Organisateur",
                agenda_title: "Programme de la journée",
                no_events: "Aucun événement prévu pour le moment.",
                back_to_list: "Retour à l'agenda"
            },
            sectors: {
                finance: "ESG & Finance",
                governance: "RSE & Gouvernance",
                tech: "Tech & Durable",
                energy: "Énergie & Bio",
                leadership: "Leadership & Impact"
            },
            common: {
                apply: "Postuler",
                save: "Enregistrer",
                details: "Détails",
                back: "Retour",
                loading: "Chargement...",
                all: "Tous",
                reset: "Réinitialiser l'index",
                no_results: "Aucune entité trouvée",
                no_results_desc: "Nous n'avons trouvé aucune correspondance pour votre recherche dans le registre actuel.",
                clear_filters: "Effacer les critères",
                explorer: "Explorer",
                platform: "Plateforme"
            },
            registry: {
                title: "Registre de Transparence",
                subtitle: "Accédez à l'index exhaustif des entités certifiées.",
                search_placeholder: "Rechercher une entité certifiée par son nom...",
                label_program: "Programme de Label",
                sector_activity: "Secteur d'Activité",
                geographic_zone: "Zone Géographique",
                status_label: "Statut de Certification",
                all_labels: "Tous les labels",
                all_sectors: "Tous les secteurs",
                all_regions: "Toutes les régions",
                maturity_index: "Indice de Maturité",
                status: {
                    certified: "Certifié",
                    pending: "En attente",
                    expired: "Expiré",
                }
            },
            org_profile: {
                title: "Tableau de Bord Institutionnel",
                description_label: "Mission & Description de l'Organisation",
                website_label: "Portail Web Officiel",
                save_success: "Profil mis à jour avec succès",
                save_error: "Erreur lors de la mise à jour",
                verified_badge: "Informations Vérifiées par le Registre",
                save_button: "Enregistrer les modifications"
            },
            regions: {
                west: "Afrique de l'Ouest",
                east: "Afrique de l'Est",
                central: "Afrique Centrale",
                north: "Afrique du Nord",
                southern: "Afrique Australe"
            },
            home: {
                hero: {
                  badge: "Standard d'Excellence Africain",
                  title1: "L'Excellence Africaine,",
                  title2: "Certifiée.",
                  subtitle: "Propulsez votre impact ESG vers de nouveaux sommets grâce à notre plateforme de certification panafricaine de classe mondiale.",
                  cta_labels: "Découvrir nos Labels",
                  cta_directory: "Consulter le Registre",
                },
                mission: {
                  title: "Notre Mission",
                  text: "Structurer, certifier et promouvoir l'excellence coopérative et entrepreneuriale en Afrique à travers des standards internationaux rigoureux.",
                },
                labels: {
                  title: "Labels & Certifications",
                  view_all: "Voir tout",
                  verified: "Vérifié",
                  explore: "Explorer le label",
                },
                news: {
                  title: "Intelligence Éditoriale",
                  subtitle: "Analyses & Rapports Stratégiques",
                  read_more: "Lire la Suite",
                  view_all: "Toutes les actualités",
                },
                companies: {
                  title: "Entreprises Certifiées",
                  view_profile: "Voir profil",
                  view_all: "Voir l'annuaire complet",
                },
                events: {
                  title: "Agenda & Événements",
                  register: "S'inscrire",
                  view_all: "Tous les événements",
                },
                multimedia: {
                  title: "Médiathèque & Excellence",
                  videos: "Vidéos",
                  podcasts: "Podcasts",
                  view_all: "Voir tout",
                },
                kiosk: {
                  title: "Publications & Revues",
                  subtitle: "Publications & Revues Mensuelles",
                  view_all: "Accéder au kiosque",
                },
                newsletter: {
                  title: "Restez Informé",
                  subtitle: "Recevez nos analyses exclusives, nos rapports sectoriels et les dernières actualités de la certification africaine.",
                  placeholder: "Votre adresse email",
                  subscribe: "S'Abonner",
                },
                hero_title: "L'EXCELLENCE AFRICAINE CERTIFIÉE",
                latest_analyses: "Dernières Analyses",
                magazines_title: "Publications & Revues",
                more_articles: "Plus d'Articles",
                registry_title: "Labels & Certifications",
                media_hub: "Médiathèque & Excellence",
                media_cta: "Explorer",
                events_title: "Agenda Institutionnel",
                view_agenda: "Voir l'Agenda Complet",
                newsletter_title: "Restez Informé",
                newsletter_desc: "Recevez nos analyses exclusives, nos rapports sectoriels et les dernières actualités de la certification africaine.",
                explore_kiosk: "Accéder au Kiosque",
                latest_newsletter: "Dernière Newsletter",
                read_more: "Lire la Suite",
                view_all_newsletters: "Voir Toutes les Newsletters",
                subscribe: "S'Abonner",
                certified_enterprises: "Entreprises Certifiées",
                about_title: "NOTRE MISSION",
                about_desc: "DGIA ESG est le portail panafricain de référence pour la certification et la transparence économique. Nous connectons les organisations d'excellence aux investisseurs et partenaires mondiaux par des protocoles d'audit rigoureux et des standards de gouvernance de haut niveau.",
                digital_ecosystem: "Écosystème Digital"
            },
            labels: {
                filters: {
                    all_sectors: "Secteurs",
                    all_categories: "Catégories",
                    sector_placeholder: "Secteurs",
                    category_placeholder: "Catégories"
                },
                certification_standards: "Standards de Certification",
                hero_desc: "Explorez l'ensemble des référentiels de labellisation, leurs critères d'évaluation et les secteurs couverts par DGIA ESG.",
                search_placeholder: "Rechercher un label, un standard..."
            },
            news: {
                filters: {
                    all_sectors: "Secteurs",
                    all_categories: "Catégories"
                }
            }
        }
    },
    en: {
        translation: {
            nav: {
                home: "Home",
                labels: "Label Hubs",
                directory: "Transparency Registry",
                news: "Journal",
                kiosk: "Kiosk",
                mediatique: "Media Hub",
                multimedia: "Multimedia Hub",
                pricing: "Premium",
                login: "Sign In",
                logout: "Logout",
                profile: "Profile",
                org_hub: "Audit & Management",
                library: "My Library",
                sectors: "Secters",
                more: "More",
                events: "Agenda & Events",
                all_services: "All Services",
                label_process: "Label Process",
                partners: "Partnerships",
                support: "Support & FAQ"
            },
            theme: {
                title: "Personalization",
                subtitle: "Appearance & Themes",
                palette: "Palette",
                save_desc: "Your selection is saved locally and will be applied on every visit.",
                themes: {
                    default: "Coop Red (Default)",
                    forest: "Forest Prestige",
                    ocean: "Deep Ocean",
                    bordeaux: "Royal Bordeaux",
                    charcoal: "Elegant Charcoal",
                    emerald: "Classic Emerald"
                },
                select: "Select Theme",
                applied: "Theme applied"
            },
            events: {
                title: "Agenda & Events",
                subtitle: "Discover upcoming workshops, conferences, and certification trainings.",
                upcoming: "Upcoming Events",
                featured: "Featured",
                details: "View Agenda",
                register: "Register for event",
                location: "Location",
                organizer: "Organizer",
                agenda_title: "Daily Schedule",
                no_events: "No events planned at the moment.",
                back_to_list: "Back to agenda"
            },
            sectors: {
                finance: "ESG & Finance",
                governance: "CSR & Governance",
                tech: "Tech & Sustainable",
                energy: "Energy & Bio",
                leadership: "Leadership & Impact"
            },
            common: {
                apply: "Apply",
                save: "Save",
                details: "Details",
                back: "Back",
                loading: "Loading...",
                all: "All",
                reset: "Reset Index",
                no_results: "No Entities Found",
                no_results_desc: "We couldn't find any matches for your search in the current registry.",
                clear_filters: "Clear Filters",
                explorer: "Explorer",
                platform: "Platform"
            },
            registry: {
                title: "Central Certification Registry",
                subtitle: "Access the comprehensive index of all certified entities.",
                search_placeholder: "Search for a certified entity by name...",
                label_program: "Label Program",
                sector_activity: "Sector of Activity",
                geographic_zone: "Geographic Zone",
                status_label: "Certification Status",
                all_labels: "All Labels",
                all_sectors: "All Sectors",
                all_regions: "All Regions",
                maturity_index: "Maturity Index",
                status: {
                    certified: "Certified",
                    pending: "Pending",
                    expired: "Expired",
                }
            },
            org_profile: {
                title: "Institutional Dashboard",
                description_label: "Mission & Organization Description",
                website_label: "Official Web Portal",
                save_success: "Profile updated successfully",
                save_error: "Error during update",
                verified_badge: "Information Verified by Registry",
                save_button: "Save Changes"
            },
            regions: {
                west: "West Africa",
                east: "East Africa",
                central: "Central Africa",
                north: "North Africa",
                southern: "Southern Africa"
            },
            home: {
                hero: {
                  badge: "African Excellence Standard",
                  title1: "African Excellence,",
                  title2: "Certified.",
                  subtitle: "Elevate your ESG impact with our world-class pan-African certification platform.",
                  cta_labels: "Discover Our Labels",
                  cta_directory: "Browse the Registry",
                },
                mission: {
                  title: "Our Mission",
                  text: "Structure, certify and promote cooperative and entrepreneurial excellence in Africa through rigorous international standards.",
                },
                labels: {
                  title: "Labels & Certifications",
                  view_all: "View all",
                  verified: "Verified",
                  explore: "Explore label",
                },
                news: {
                  title: "Editorial Intelligence",
                  subtitle: "Strategic Analyses & Reports",
                  read_more: "Read More",
                  view_all: "All news",
                },
                companies: {
                  title: "Certified Enterprises",
                  view_profile: "View profile",
                  view_all: "View full directory",
                },
                events: {
                  title: "Upcoming Events",
                  register: "Register",
                  view_all: "All events",
                },
                multimedia: {
                  title: "Media Hub & Excellence",
                  videos: "Videos",
                  podcasts: "Podcasts",
                  view_all: "View all",
                },
                kiosk: {
                  title: "Publications & Reviews",
                  subtitle: "Monthly Publications & Reviews",
                  view_all: "Explore Kiosk",
                },
                newsletter: {
                  title: "Stay Informed",
                  subtitle: "Subscribe to our newsletter for the latest analyses and certifications.",
                  placeholder: "Your email address",
                  subscribe: "Subscribe",
                },
                hero_title: "THE STANDARD OF AFRICAN EXCELLENCE",
                latest_analyses: "Latest Analyses",
                magazines_title: "Publications & Reviews",
                more_articles: "More Articles",
                registry_title: "Labels & Certifications",
                media_hub: "Media Hub & Excellence",
                media_cta: "Explore",
                events_title: "Institutional Agenda",
                view_agenda: "View Full Agenda",
                newsletter_title: "Stay Informed",
                newsletter_desc: "Receive our exclusive analyses, sector reports and the latest news from African certification.",
                explore_kiosk: "Explore Kiosk",
                latest_newsletter: "Latest Newsletter",
                read_more: "Read More",
                view_all_newsletters: "View All Newsletters",
                subscribe: "Subscribe",
                certified_enterprises: "Certified Enterprises",
                about_title: "OUR MISSION",
                about_desc: "DGIA ESG is the leading pan-African portal for certification and economic transparency. We connect excellent organizations with global investors and partners through rigorous audit protocols and high-level governance standards.",
                digital_ecosystem: "Digital Ecosystem"
            },
            labels: {
                filters: {
                    all_sectors: "Sectors",
                    all_categories: "Categories",
                    sector_placeholder: "Sectors",
                    category_placeholder: "Categories"
                },
                certification_standards: "Certification Standards",
                hero_desc: "Explore all labelling standards, their evaluation criteria and the sectors covered by DGIA ESG.",
                search_placeholder: "Search a label, standard or framework..."
            },
            news: {
                filters: {
                    all_sectors: "Sectors",
                    all_categories: "Categories"
                }
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'fr',
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
