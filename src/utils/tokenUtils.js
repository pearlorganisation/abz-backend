import jwt from "jsonwebtoken";

export const generateJWTToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d", // Set to min later
  });
  return token;
};
