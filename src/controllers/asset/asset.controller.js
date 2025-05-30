import Asset from "../../models/asset/asset.model.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const createAsset = asyncHandler(async (req, res, next) => {
  const asset = await Asset.create(req.body);

  if (!asset) {
    return next(new ApiError("Failed to create Asset", 400));
  }

  res.status(201).json({
    success: true,
    message: "Asset created successfully",
    data: asset,
  });
});

export const updateAssetById = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!asset) {
    return next(new ApiError("Asset not found or failed to update", 404));
  }

  res.status(200).json({
    success: true,
    message: "Asset updated successfully",
    data: asset,
  });
});

export const deleteAssetById = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findByIdAndDelete(req.params.id);

  if (!asset) {
    return next(new ApiError("Asset not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Asset deleted successfully",
  });
});
