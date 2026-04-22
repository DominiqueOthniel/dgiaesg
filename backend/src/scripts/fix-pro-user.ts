import dotenv from "dotenv";
dotenv.config({ override: true });

import mongoose from "mongoose";
import connectDB from "../config/db";
import { User, Company } from "../models";

async function fixUser() {
    try {
        await connectDB();
        console.log("Connected to MongoDB.");

        const email = "hackergeek55@gmail.com";

        // 1. Find or Update User to be PRO
        let user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found. Creating a new Pro user...`);
            user = await User.create({
                name: "Hacker Geek",
                username: "hackergeek",
                email: email,
                password: "12345678", // Will be hashed by pre-save hook
                role: "viewer",
                isPro: true,
                proExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
            });
            console.log("User created successfully.");
        } else {
            console.log(`User ${email} found. Updating to Pro...`);
            user.isPro = true;
            user.proExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            await user.save();
            console.log("User updated to Pro successfully.");
        }

        // 2. Associate with a Company
        // Find a company that doesn't have an owner yet, or just take the first one
        let company = await Company.findOne({ ownerId: user._id });

        if (company) {
            console.log(`User is already associated with company: ${company.name}`);
        } else {
            company = await Company.findOne({ ownerId: null });
            if (!company) {
                console.log("No available companies without owners. Taking the first company found.");
                company = await Company.findOne();
            }

            if (company) {
                company.ownerId = user._id as any;
                await company.save();
                console.log(`Successfully associated user with company: ${company.name}`);
            } else {
                console.log("No companies found in database. Please run seed first or create a company.");
            }
        }

        console.log("\nFix completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Fix failed:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

fixUser();
