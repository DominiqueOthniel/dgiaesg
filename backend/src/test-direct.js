const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
    console.log("Starting advanced diagnostic test...");
    // Attempting to use the first shard directly to bypass SRV/Topology complexity
    const directUri = "mongodb://ditrichnkwesi_db_user:ditrich15072005@ac-xbjjbte-shard-00-00.ccj3q5q.mongodb.net:27017,ac-xbjjbte-shard-00-01.ccj3q5q.mongodb.net:27017,ac-xbjjbte-shard-00-02.ccj3q5q.mongodb.net:27017/?ssl=true&replicaSet=atlas-plz06s-shard-0&authSource=admin";

    console.log("Trying direct connection string (non-SRV) with explicit SSL and ReplicaSet...");

    const client = new MongoClient(directUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
    });

    try {
        await client.connect();
        console.log("✅ DIRECT CONNECTION SUCCESS!");
        const db = client.db("admin");
        const status = await db.command({ serverStatus: 1 });
        console.log("Server version:", status.version);
    } catch (err) {
        console.error("❌ DIRECT CONNECTION FAILED");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.reason) {
            console.log("Reason servers:", Array.from(err.reason.servers.keys()));
            for (const [host, desc] of err.reason.servers) {
                console.log(`Server [${host}] error:`, desc.error ? desc.error.message : "No error reported");
            }
        }
    } finally {
        await client.close();
        process.exit(0);
    }
}

run();
