export const DB_NAME = "ABZ-DB";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
  secure: process.env.NODE_ENV !== "development",
};

export const USER_ROLES_ENUM = {
  ADMIN: "ADMIN",
  COMPANY: "COMPANY",
  RESEARCHER: "RESEARCHER",
  TREASURER: "TREASURER",
};

export const MAX_LOGIN_ATTEMPTS = 50; // set to 5 for production
export const LOCK_TIME = 1000; //2 * 60 * 60 * 1000; set  2 hours  for production
