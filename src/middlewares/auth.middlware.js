import { ACCESS_TOKEN_SECRET } from "../config/index.js";
import User from "../models/user/user.model.js";
import ApiError from "../utils/error/ApiError.js";
import { asyncHandler } from "../utils/error/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authenticateToken = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError("Unauthorized user", 401));
  }
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    return next(new ApiError("Invalid access token!", 401));
  }
  req.user = user;
  next();
});
