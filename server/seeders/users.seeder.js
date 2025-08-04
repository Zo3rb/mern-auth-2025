import UserModel from "../models/user.model.js";

const users = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "Admin123!4567",
    role: "admin",
    isVerified: true,
    authType: "local",
  },
  {
    username: "john_doe",
    email: "john@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: true,
    authType: "local",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: false,
    authType: "local",
  },
  {
    username: "mike_wilson",
    email: "mike@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: true,
    authType: "local",
  },
  {
    username: "sarah_jones",
    email: "sarah@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: false,
    authType: "local",
  },
  {
    username: "admin2",
    email: "admin2@example.com",
    password: "Admin123!4567",
    role: "admin",
    isVerified: true,
    authType: "local",
  },
  {
    username: "alex_brown",
    email: "alex@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: true,
    authType: "local",
  },
  {
    username: "emma_davis",
    email: "emma@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: false,
    authType: "local",
  },
  {
    username: "chris_garcia",
    email: "chris@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: true,
    authType: "local",
  },
  {
    username: "lisa_martinez",
    email: "lisa@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: false,
    authType: "local",
  },
  {
    username: "david_taylor",
    email: "david@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: true,
    authType: "local",
  },
  {
    username: "anna_white",
    email: "anna@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: false,
    authType: "local",
  },
  {
    username: "tom_anderson",
    email: "tom@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: true,
    authType: "local",
  },
  {
    username: "kelly_thomas",
    email: "kelly@example.com",
    password: "User123!4567",
    role: "user",
    isVerified: false,
    authType: "local",
  },
  {
    username: "google_user",
    email: "googleuser@gmail.com",
    googleId: "1234567890",
    role: "user",
    isVerified: true,
    authType: "google",
  },
];

const seedUsers = async () => {
  try {
    console.log("[SEEDER]: Starting users seeder...");

    // Clear existing users
    await UserModel.deleteMany({});
    console.log("[SEEDER]: Cleared existing users");

    // Insert new users
    const createdUsers = await UserModel.insertMany(users);
    console.log(`[SEEDER]: Successfully seeded ${createdUsers.length} users`);

    // Log summary
    const adminCount = createdUsers.filter(
      (user) => user.role === "admin"
    ).length;
    const userCount = createdUsers.filter(
      (user) => user.role === "user"
    ).length;
    const verifiedCount = createdUsers.filter((user) => user.isVerified).length;

    console.log(
      `[SEEDER]: Created ${adminCount} admins and ${userCount} regular users`
    );
    console.log(`[SEEDER]: ${verifiedCount} users are verified`);

    return createdUsers;
  } catch (error) {
    console.error("[SEEDER]: Error seeding users:", error.message);
    throw error;
  }
};

// Export for use in index.js
export { seedUsers };
