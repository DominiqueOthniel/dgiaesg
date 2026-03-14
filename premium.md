# Guide des Abonnements COOP_LOGIC

Ce document détaille les différences de fonctionnalités et d'accès entre les utilisateurs **Simple** (Gratuit) et les membres **PRO**.

---

## 1. Utilisateurs Simple (Gratuit)
Les utilisateurs non-connectés ou possédant un compte standard bénéficient d'un accès limité à la plateforme :

- **Actualités Standard** : Lecture illimitée des articles marqués comme "Actualité" générique.
- **Aperçu Premium** : Accès aux 3 premiers paragraphes des articles Premium, avec un floutage progressif et un appel à l'action pour s'abonner.
- **Annuaire** : Consultation de la liste des entreprises certifiées et de leurs scores de base.
- **Kiosque** : Consultation visuelle des revues mensuelles (couvertures uniquement, pas de téléchargement).
- **FA TV & Podcasts** : Accès libre à tous les contenus vidéo et audio intégrés.
- **Filtrage** : Utilisation des filtres de base (secteur, zone géographique).
- **Publicité** : Affichage standard des bannières publicitaires (Top, Sidebar, Inline).

### 🚫 Restrictions
- **Articles Premium** : Impossible de lire l'analyse complète (analyses stratégiques, rapports ESG profonds). Le contenu est flouté après 3 paragraphes.
- **Téléchargements PDF** : Accès bloqué au téléchargement des rapports mensuels en format PDF (Revue Mensuelle). Un toast indique la nécessité d'un compte PRO.
- **Fonctions Avancées** : Accès limité aux rapports d'impact détaillés par entreprise.

---

## 2. Utilisateurs Connectés (Non-PRO)
Les utilisateurs ayant un compte gratuit bénéficient de fonctionnalités supplémentaires :

- **Bibliothèque Personnelle** : Sauvegarde d'articles et de protocoles dans une bibliothèque personnelle (via le portail Library) avec deux onglets distincts.
- **Profil Utilisateur** : Accès à la page de profil pour gérer les informations personnelles.
- **Aperçu Premium** : Même limitation que les utilisateurs non-connectés.

---

## 3. Membres COOP_LOGIC PRO
Les membres PRO bénéficient d'une expérience complète et sans restriction :

- **Accès Premium Intégral** : Lecture complète de tous les articles, incluant les analyses confidentielles et les rapports stratégiques.
- **Téléchargements PDF Illimités** : Possibilité de télécharger tous les rapports mensuels et documents de synthèse directement depuis le Kiosque Digital.
- **Badge PRO** : Identification visuelle "GOLDEN PRO" dans la barre de navigation, confirmant le statut premium de l'utilisateur.
- **Badges Premium** : Identification visuelle claire des contenus exclusifs via le badge "PREMIUM" sur les articles.
- **Données d'Impact** : Accès aux workflows de validation détaillés et aux critères spécifiques de notation ESG des entreprises.
- **Bibliothèque Personnelle** : Sauvegarde d'articles et labels dans une bibliothèque personnelle (via le portail Library).

---

## Plans Tarifaires (en FCFA)

| Plan | Prix Mensuel | Caractéristiques |
| :--- | :---: | :--- |
| **Starter** | 5 000 FCFA/mois | Accès aux articles Premium, téléchargements PDF limités |
| **Professional** | 15 000 FCFA/mois | Tout Starter + rapports d'impact, accès prioritaire |
| **Enterprise** | 45 000 FCFA/mois | Tout Professional + support dédié, accès API, multi-utilisateurs |

---

## Comparatif Rapide

| Fonctionnalité | Visiteur | Simple (Connecté) | PRO |
| :--- | :---: | :---: | :---: |
| Lecture Actualités Standard | ✅ | ✅ | ✅ |
| Lecture Analyses Premium | ❌ (Aperçu) | ❌ (Aperçu) | ✅ |
| Téléchargement Rapports PDF | ❌ | ❌ | ✅ |
| Accès Workflows Validation | ❌ | ❌ | ✅ |
| Bibliothèque Personnelle | ❌ | ✅ | ✅ |
| FA TV & Podcasts | ✅ | ✅ | ✅ |
| Badge PRO (Navbar) | ❌ | ❌ | ✅ |
| Support Prioritaire | ❌ | ❌ | ✅ |

> [!TIP]
> Pour devenir membre PRO, rendez-vous sur la page **Tarification** (`/pricing`) de votre tableau de bord ou cliquez sur n'importe quel contenu verrouillé pour voir nos offres.

---

## Gestion Admin des Abonnements

L'administrateur peut gérer les abonnements utilisateurs via le dashboard :

- **Interface** : `Admin > Abonnements` (`/admin/subscriptions`)
- **Actions disponibles** :
  - Voir la liste de tous les utilisateurs avec leur statut (Free/PRO)
  - Activer/désactiver le statut PRO d'un utilisateur
  - Modifier le plan d'abonnement (free, starter, professional, enterprise)
  - Définir la date d'expiration de l'abonnement
- **API** :
  - `GET /api/users` — Liste tous les utilisateurs (Admin)
  - `PUT /api/users/:id/subscription` — Met à jour l'abonnement d'un utilisateur (Admin)
