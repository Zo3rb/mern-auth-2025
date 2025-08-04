import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import config from "../config/index.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: function () {
        return this.authType === "local";
      },
      select: false,
      validate: {
        validator: function (password) {
          if (this.authType !== "local") return true;
          // At least 1 uppercase, 1 lowercase, 1 symbol, 4 numbers
          const hasUppercase = /[A-Z]/.test(password);
          const hasLowercase = /[a-z]/.test(password);
          const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
            password
          );
          const numberCount = (password.match(/\d/g) || []).length;

          return hasUppercase && hasLowercase && hasSymbol && numberCount >= 4;
        },
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 symbol, and 4 numbers",
      },
    },
    authType: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "/uploads/avatars/default-avatar.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(
      this.password,
      config.bcryptSaltRounds
    );
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
