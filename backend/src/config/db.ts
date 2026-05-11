import mongoose from "mongoose";
import dns from "dns";

// Force Node.js to use public DNS resolvers (Google + Cloudflare).
// Required because some local/ISP DNS servers refuse SRV queries used by
// `mongodb+srv://` Atlas URIs (ECONNREFUSED on querySrv).
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

let connectionPromise: Promise<void> | null = null;

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
          throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(mongoURI, {
          serverSelectionTimeoutMS: 45000,
          family: 4, // prefer IPv4 — avoids some DNS hiccups on Windows
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
        connectionPromise = null;
        if (error instanceof Error) {
          console.error(`MongoDB connection error: ${error.message}`);
        }
        throw error;
      }
    })();
  }

  await connectionPromise;
};

export default connectDB;
