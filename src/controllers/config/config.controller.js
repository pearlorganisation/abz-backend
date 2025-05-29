import Config from "../../models/config/config.model.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const createConfig = asyncHandler(async (req, res, next) => {
  const { key, values } = req.body;
  const exists = await Config.findOne({ key });

  if (exists) {
    return next(new ApiError(`Config with key '${key}' already exists`, 400));
  }

  const config = await Config.create({ key, values });
  if (!config) {
    return next(new ApiError("Failed to create the Config", 400));
  }

  res.status(201).json({
    success: true,
    message: "Config created successfully",
    data: config,
  });
});

export const updateConfigByKey = asyncHandler(async (req, res, next) => {});
