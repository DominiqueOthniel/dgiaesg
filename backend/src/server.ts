import app from "./app";
import connectDB from "./config/db";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  console.log("Starting server process...");

  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready on port ${PORT} in ${process.env.NODE_ENV} mode`,
      );
    });
  } catch (error) {
    console.error(
      "❌ Critical: MongoDB connection failed. Server will not start.",
    );
    process.exit(1);
  }
};

/** Déployé sur Vercel : pas de serveur HTTP — `/api/index.ts` charge cette app en serverless. */
if (!(process.env.VERCEL || process.env.VERCEL_ENV)) {
  startServer();
}
