import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8001;
const MONGODB_URI = process.env.MONGODB_URI;
const BASE_URL = process.env.BASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "1d"; // chnge to 15m
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "30d";
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_AUTH_URL = process.env.AUTH0_AUTH_URL;
const AUTH0_TOKEN_URL = process.env.AUTH0_TOKEN_URL;
const AUTH0_USERINFO_URL = process.env.AUTH0_USERINFO_URL;
const AUTH0_ISSUER = process.env.AUTH0_ISSUER;
const AUTH0_CALLBACK_URL = process.env.AUTH0_CALLBACK_URL;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export {
  PORT,
  MONGODB_URI,
  BASE_URL,
  JWT_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUTH_URL,
  AUTH0_TOKEN_URL,
  AUTH0_USERINFO_URL,
  AUTH0_ISSUER,
  AUTH0_CALLBACK_URL,
  FRONTEND_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
