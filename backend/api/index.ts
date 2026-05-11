/**
 * Point d'entrée serverless Vercel (@vercel/node).
 * Toutes les routes sont propagées à l'application Express définie dans `src/app.ts`.
 */
import app from "../src/app";

export default app;
