import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI as string;

async function migrate() {
    if (!MONGO_URI) {
        console.error('❌ MONGODB_URI is not defined in .env file');
        process.exit(1);
    }

    console.log('🚀 Starting i18n Migration...');
    
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected');

        const db = mongoose.connection.db!;

        // 1. Migrate News
        console.log('--- Migrating News ---');
        const newsCount = await db.collection('news').countDocuments();
        const newsCursor = db.collection('news').find({});
        
        while (await newsCursor.hasNext()) {
            const doc = await newsCursor.next();
            if (!doc) continue;

            const updates: any = {};
            
            // Migrate title if string
            if (typeof doc.title === 'string') {
                updates.title = { fr: doc.title, en: doc.title };
            }
            
            // Migrate content if string
            if (typeof doc.content === 'string') {
                updates.content = { fr: doc.content, en: doc.content };
            }

            // Migrate excerpt if string
            if (typeof doc.excerpt === 'string') {
                updates.excerpt = { fr: doc.excerpt || "", en: doc.excerpt || "" };
            }

            if (Object.keys(updates).length > 0) {
                await db.collection('news').updateOne({ _id: doc._id }, { $set: updates });
            }
        }
        console.log(`✅ News Migration Complete (${newsCount} docs processed)`);

        // 2. Migrate Labels
        console.log('--- Migrating Labels ---');
        const labelsCount = await db.collection('labels').countDocuments();
        const labelsCursor = db.collection('labels').find({});

        while (await labelsCursor.hasNext()) {
            const doc = await labelsCursor.next();
            if (!doc) continue;

            const updates: any = {};
            
            if (typeof doc.name === 'string') {
                updates.name = { fr: doc.name, en: doc.name };
            }
            
            if (typeof doc.description === 'string') {
                updates.description = { fr: doc.description, en: doc.description };
            }

            if (Object.keys(updates).length > 0) {
                await db.collection('labels').updateOne({ _id: doc._id }, { $set: updates });
            }
        }
        console.log(`✅ Labels Migration Complete (${labelsCount} docs processed)`);

        // 3. Migrate Events (If any legacy exist)
        console.log('--- Migrating Events ---');
        const eventsCount = await db.collection('events').countDocuments();
        const eventsCursor = db.collection('events').find({});

        while (await eventsCursor.hasNext()) {
            const doc = await eventsCursor.next();
            if (!doc) continue;

            const updates: any = {};
            
            if (typeof doc.title === 'string') {
                updates.title = { fr: doc.title, en: doc.title };
            }
            if (typeof doc.description === 'string') {
                updates.description = { fr: doc.description, en: doc.description };
            }
            if (typeof doc.location === 'string') {
                updates.location = { fr: doc.location, en: doc.location };
            }
            if (typeof doc.organizer === 'string') {
                updates.organizer = { fr: doc.organizer, en: doc.organizer };
            }

            if (Object.keys(updates).length > 0) {
                await db.collection('events').updateOne({ _id: doc._id }, { $set: updates });
            }
        }
        console.log(`✅ Events Migration Complete (${eventsCount} docs processed)`);

        // 4. Migrate Categories
        console.log('--- Migrating Categories ---');
        const catCount = await db.collection('categories').countDocuments();
        const catCursor = db.collection('categories').find({});

        while (await catCursor.hasNext()) {
            const doc = await catCursor.next();
            if (!doc) continue;

            const updates: any = {};
            
            if (typeof doc.name === 'string') {
                updates.name = { fr: doc.name, en: doc.name };
            }
            if (typeof doc.description === 'string') {
                updates.description = { fr: doc.description || "", en: doc.description || "" };
            }

            if (Object.keys(updates).length > 0) {
                await db.collection('categories').updateOne({ _id: doc._id }, { $set: updates });
            }
        }
        console.log(`✅ Categories Migration Complete (${catCount} docs processed)`);

        console.log('🎉 Migration Finished Successfully!');
    } catch (error) {
        console.error('❌ Migration Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
