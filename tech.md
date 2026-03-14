# Tech Documentation: Project Structure & File Guide

This guide provides an overview of the essential folders and files in the Cooperative Labeling Platform, covering both the **Backend** (Server logic) and **Frontend** (Client interface).

---

## 📂 Backend (Server-Side)
Developed with **Node.js, Express, and MongoDB (Mongoose)**.

| Folder | Purpose |
| :--- | :--- |
| `src/config/` | Contains configuration for the database connection and the **Swagger API** documentation setup. |
| `src/controllers/` | The core logic of the app. Functions here handle incoming requests, communicate with the database, and send responses (e.g., `ad.controller.ts`, `company.controller.ts`). |
| `src/middleware/` | Intermediary functions that run before a request reaches a controller. Used for **Authentication** (protecting routes), **Role Checking** (Admins vs Users), and **File Uploads**. |
| `src/models/` | Defines the **Database Schemas**. Every data entity (User, Company, Ad, Label, News) has a model defining its properties (e.g., `Label.ts`, `User.ts`). |
| `src/routes/` | Defines the **API Endpoints**. Connects specific URL paths to their corresponding controller logic (e.g., `/api/ads`). |
| `src/validators/` | Logic for validating incoming data using **Zod**. Ensures that name, email, and other fields meet specific requirements before processing. |
| `src/server.ts` | The main entry point that starts the server and connects all middleware and routes. |
| `src/seed.ts` | A script to populate the database with initial demo data (Companies, News, Labels, etc.). |

---

## 📂 Frontend (Client-Side)
Developed with **React (Vite), TypeScript, and Tailwind CSS**.

| Folder | Purpose |
| :--- | :--- |
| `src/components/` | Reusable UI components. Includes specialized modules like `AdBanner.tsx`, `NewsletterPopup.tsx`, and `NewsTicker.tsx`. |
| `src/components/ui/` | Foundational UI primitives used across the app (Buttons, Cards, Inputs, FileUpload). |
| `src/context/` | Manages global application state, primarily for **Authentication** (checking if a user is logged in or PRO). |
| `src/hooks/` | Custom functions that fetch and cache data using **TanStack Query** (e.g., `useLabels.ts`, `useNews.ts`). |
| `src/lib/` | Utility functions and helper modules like `utils.ts` (for CSS classes) and `image.ts` (for URL resolution). |
| `src/pages/` | Individual page components for users (Home, News, Directory, Pricing, Kiosk). |
| `src/pages/admin/` | Dedicated pages for the **Admin Dashboard**. Includes management for Ads, Companies, News, and Subscriptions. |
| `src/services/` | Contains the API client (Axios configuration) and search services. |
| `src/types/` | Defines **TypeScript Interfaces** to ensure data consistency between the backend and frontend. |
| `src/App.tsx` | The main application component that defines the routing (URL paths) for all pages. |
| `src/main.tsx` | The entry point where the React application is mounted to the browser's DOM. |

---

## 🛠️ Essential Project Files

- **`explain.md`**: Guide for client demonstrations, mapping features to their code implementation.
- **`premium.md`**: Detailed breakdown of the differences between Free and PRO membership tiers.
- **`package.json`**: Lists all dependencies and start-up scripts for either the frontend or backend.
- **`.env`**: (Security) Contains sensitive environment variables like Database URLs and JWT Secrets.

---

> [!NOTE]
> This structure ensures a clean separation between **Data (Models)**, **Logic (Controllers)**, and **Interface (Pages/Components)**, allowing for easy updates and high performance.
