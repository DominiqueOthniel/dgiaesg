import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Company from '../models/Company';
import Label from '../models/Label';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const setupProOrg = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected.');

    // 1. Find the PRO user
    const proUser = await User.findOne({ isPro: true });
    if (!proUser) {
      console.log('No PRO user found. Please log in as a PRO user first.');
      process.exit(1);
    }
    console.log(`Found PRO user: ${proUser.email} (${proUser._id})`);

    // 2. Check if they already have an org
    let company = await Company.findOne({ ownerId: proUser._id });
    if (company) {
      console.log(`User already has an organization: ${company.name}. Ensuring it is certified...`);
      company.status = 'certified';
      await company.save();
      console.log('Organization status updated to certified.');
    } else {
      console.log('No organization found for this user. Creating one...');

      // We need a label to associate with
      const label = await Label.findOne({ status: 'active' });
      if (!label) {
        console.log('No active label found. Please seed labels first.');
        process.exit(1);
      }

      company = await Company.create({
        name: `Startup Excellence de ${proUser.name || proUser.username}`,
        description: "Leader panafricain de l'innovation durable et de l'excellence opérationnelle.",
        sector: 'tech',
        region: 'Afrique de l\'Ouest',
        ownerId: proUser._id,
        labelId: label._id,
        status: 'certified',
        certificationDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        score: 85,
        socialScore: 80,
        governanceScore: 90
      });
      console.log(`Created and certified organization: ${company.name}`);
    }

    console.log('DONE.');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up PRO org:', error);
    process.exit(1);
  }
};

setupProOrg();
