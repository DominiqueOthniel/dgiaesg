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
const PORT = Number(process.env.PORT) || 5000;

app.use(morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  let statusColor = chalk.green;
  if (status >= 500) statusColor = chalk.red;
  else if (status >= 400) statusColor = chalk.yellow;
  else if (status >= 300) statusColor = chalk.cyan;

  return [
    chalk.bold.blue(tokens.method(req, res)),
    chalk.white(tokens.url(req, res)),
    statusColor(status),
    chalk.gray(tokens['response-time'](req, res) + ' ms'),
    chalk.gray('-'),
    tokens.res(req, res, 'content-length') || 0
  ].join(' ');
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Swagger Documentation
setupSwagger(app);

app.use("/api", apiRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "DGIAESG Platform API" });
});

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  console.log("Starting server process...");

  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server ready on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("❌ Critical: MongoDB connection failed. Server will not start.");
    process.exit(1); // Exit with failure
  }
};

startServer();

export default app;
