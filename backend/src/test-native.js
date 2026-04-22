const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
    console.log("Starting native driver test...");
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
    });

    try {
        console.time("Connect");
        await client.connect();
        console.timeEnd("Connect");
        console.log("✅ Native driver connected successfully!");
        const db = client.db();
        const collections = await db.listCollections().toArray();
        console.log("Accessible collections:", collections.map(c => c.name));
    } catch (err) {
        console.timeEnd("Connect");
        console.error("❌ Native driver FAILED");
        console.error(err);
    } finally {
        await client.close();
        process.exit(0);
    }
}

run();
