import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

import config from "./index.js";

const connectDB = asyncHandler(async () => {
  try {
    const mongoUri = config.mongoUri.replace(
      "<db_password>",
      process.env.DB_PASSWORD
    );

    const conn = await mongoose.connect(mongoUri, {
      dbName: "mern-auth-2025",
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
});

export default connectDB;
