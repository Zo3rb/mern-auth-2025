import connectDB from "../config/dbConnect.js";
import { seedUsers } from "./users.seeder.js";

const runAllSeeders = async () => {
  try {
    console.log("[SEEDER]: Starting database seeding...");

    // Connect to database
    await connectDB();

    // Run all seeders
    await seedUsers();

    // Add more seeders here as you create them
    // await seedPosts();
    // await seedCategories();

    console.log("[SEEDER]: All seeders completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[SEEDER]: Seeding failed:", error.message);
    process.exit(1);
  }
};

runAllSeeders();
