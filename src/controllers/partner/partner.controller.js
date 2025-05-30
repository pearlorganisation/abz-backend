import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../config/cloudinary.js";
import Partner from "../../models/partner/partner.model.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const createPartner = asyncHandler(async (req, res, next) => {
  const image = req.file;
  let imageResponse = null;

  if (image) {
    imageResponse = await uploadFileToCloudinary(image, "Partner");
  }

  console.log("this is my response ", imageResponse);
  const partner = await Partner.create({
    ...req.body,
    image: (imageResponse && imageResponse[0]) || null,
  });

  if (!partner) {
    return next(new ApiError("Failed to create partner", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Partner created successfully.",
    data: partner,
  });
});

export const getAllPartners = asyncHandler(async (req, res) => {
  const partners = await Partner.find();
  if (!partners) {
    return next(new ApiError("Partners not found.", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Fetched all partners successfully",
    data: partners,
  });
});

export const updatePartnerById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const image = req.file;

  const existingPartner = await Partner.findById(id);
  if (!existingPartner) {
    return next(new ApiError("Partner not found", 404));
  }

  let imageResponse = null;

  if (image) {
    imageResponse = await uploadFileToCloudinary(image, "Partner");
    if (existingPartner.image) {
      await deleteFileFromCloudinary(existingPartner.image);
    }
  }

  const partnerData = {
    ...req.body,
    image: imageResponse ? imageResponse[0] : undefined,
  };

  const updatedPartner = await Partner.findByIdAndUpdate(id, partnerData, {
    new: true,
    runValidators: true,
  });

  if (!updatedPartner) {
    return next(new ApiError("Partner update failed", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Partner updated successfully",
    data: updatedPartner,
  });
});

export const deletePartnerById = asyncHandler(async (req, res, next) => {
  const deletedPartner = await Partner.findByIdAndDelete(req.params.id);

  if (!deletedPartner) {
    return next(new ApiError("Partner not found", 404));
  }

  if (deletedPartner?.image) {
    await deleteFileFromCloudinary(deletedPartner.image);
  }

  return res.status(200).json({
    success: true,
    message: "Partner deleted successfully",
  });
});
