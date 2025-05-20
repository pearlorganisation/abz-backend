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
