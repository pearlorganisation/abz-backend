import mongoose from "mongoose";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../../config/index.js";
import { USER_ROLES_ENUM } from "../../../constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    user_name: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be at most 30 characters"],
      match: [
        /^(?!.*[.-]{2})(?!.*[.-]$)[a-zA-Z0-9][a-zA-Z0-9._-]{2,29}$/,
        "Username must start with a letter or number, can include '.', '-', '_' (no consecutive dots or hyphens, and can't end with them)",
      ],
    },
    profile_picture: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    phone_number: {
      // optional
      type: String,
      unique: true,
      match: [/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character",
      ],
    },
    role: {
      type: String,
      enum: USER_ROLES_ENUM,
      required: true,
    },
    // For researchers
    researcher_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Researcher",
      required: function () {
        return this.role === USER_ROLES_ENUM.RESEARCHER;
      },
    },
    // For company representatives
    company_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: function () {
        return this.role === USER_ROLES_ENUM.COMPANY;
      },
    },
    // For treasurers (if they need special attributes)
    treasurer_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treasurer",
      required: function () {
        return this.role === USER_ROLES_ENUM.TREASURER;
      },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "BANNED"],
      default: "ACTIVE",
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
    last_login_at: {
      type: Date,
    },
    login_attempts: {
      type: Number,
      default: 0,
    },
    login_history: {
      type: [
        {
          ip: String,
          userAgent: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    oidc_provider: {
      type: String,
      default: null,
    },
    oidc_sub: {
      // unique field for OIDC users
      type: String,
      default: null,
      unique: true, // Only OIDC users will have this filled
      sparse: true, // Ensures MongoDB doesn't complain when it's null for password users
    },
    login_type: {
      type: String,
      enum: ["PASSWORD", "OIDC"],
      default: "PASSWORD",
    },
    lock_until: {
      type: Date,
      default: null,
    },
    refresh_token: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to hash password before saving it to DB
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
