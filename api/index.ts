/**
 * Entrée serverless Vercel à la racine du dépôt.
 * Les requêtes /api/* sont réécrites ici (voir vercel.json).
 */
import app from "../backend/src/app";

export default app;
