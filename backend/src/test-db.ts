import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;

async function test() {
    if (!uri) {
        console.error("No MONGODB_URI found in .env");
        process.exit(1);
    }

    console.log("Connecting with serverSelectionTimeoutMS: 5000...");

    try {
        const start = Date.now();
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        const end = Date.now();
        console.log(`✅ CONNECTED in ${end - start}ms`);
        console.log("Database:", mongoose.connection.name);
        await mongoose.connection.close();
        process.exit(0);
    } catch (err: any) {
        console.error("❌ CONNECTION FAILED");
        console.error("Name:", err.name);
        console.error("Message:", err.message);
        process.exit(1);
    }
}

test();
