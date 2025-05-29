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

// Send all value to upates and edit exit values(UI will handle it)
export const updateConfigByKey = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const { values } = req.body;

  if (!Array.isArray(values)) {
    return next(new ApiError(`Values must be an array`, 400));
  }

  const config = await Config.findOneAndUpdate(
    { key },
    { values },
    { new: true, upsert: true } // upsert: true will create if not exists
  );

  res.status(200).json({
    success: true,
    message: "Config updated successfully",
    config,
  });
});

export const deleteConfigBykey = asyncHandler(async (req, res, next) => {
  const config = await Config.findOneAndDelete({ key: req.params?.key });

  if (!config) {
    return next(new ApiError("Config not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Deleted Config entry successfully",
  });
});

export const getAllConfigs = asyncHandler(async (req, res, next) => {
  const { keys } = req.query;
  const filter = {};

  if (keys) {
    const keyArr = keys.split(",").map((key) => key.trim());
    filter.key = { $in: keyArr };
  }

  const configs = await Config.find(filter);

  if (!configs || configs.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No configs found",
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: "Configs fetched successfully",
    data: configs,
  });
});
