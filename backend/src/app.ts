import dotenv from "dotenv";
dotenv.config({ override: true });

import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import chalk from "chalk";
import connectDB from "./config/db";
import apiRoutes from "./routes/index";
import { setupSwagger } from "./config/swagger";
import { notFound, errorHandler } from "./middleware/errorHandler";

const app = express();

/** Détection serverless Vercel (VAR env officielles). */
const IS_VERCEL_SERVERLESS = Boolean(
    process.env.VERCEL || process.env.VERCEL_ENV,
);

/**
 * Sur Vercel (serverless), MongoDB est branché au premier passage sur cette chaîne.
 * En local, `server.ts` appelle `connectDB()` avant `listen()` ; les appels suivants sont no-op grâce au cache dans `db.ts`.
 */
if (IS_VERCEL_SERVERLESS) {
  app.use(async (_req, _res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      next(err);
    }
  });
}

app.use(
  morgan((tokens, req, res) => {
    const status = Number(tokens.status(req, res));
    let statusColor = chalk.green;
    if (status >= 500) statusColor = chalk.red;
    else if (status >= 400) statusColor = chalk.yellow;
    else if (status >= 300) statusColor = chalk.cyan;

    return [
      chalk.bold.blue(tokens.method(req, res)),
      chalk.white(tokens.url(req, res)),
      statusColor(status),
      chalk.gray(tokens["response-time"](req, res) + " ms"),
      chalk.gray("-"),
      tokens.res(req, res, "content-length") || 0,
    ].join(" ");
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

setupSwagger(app);

app.use("/api", apiRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "DGIAESG Platform API" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
