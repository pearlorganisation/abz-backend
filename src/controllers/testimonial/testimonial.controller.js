import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../config/cloudinary.js";
import Testimonial from "../../models/testimonials/testimonials.model.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import fs from "fs/promises";

// Create Testimonial
export const createTestimonial = asyncHandler(async (req, res, next) => {
  const image = req.file;
  let imageResponse = null;

  if (image) {
    imageResponse = await uploadFileToCloudinary(image, "Testimonial");
  }

  await fs.unlink(image.path);

  const testimonial = await Testimonial.create({
    ...req.body,
    image: (imageResponse && imageResponse[0]) || null,
  });

  if (!testimonial) {
    return next(new ApiError("Failed to create testimonial", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Testimonial created successfully.",
    data: testimonial,
  });
});

// Get All Testimonials
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find();
  if (!testimonials) {
    return next(new ApiError("Testimonials not found.", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Fetched all testimonials successfully",
    data: testimonials,
  });
});

// Update Testimonial by ID
export const updateTestimonialById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const image = req.file;

  const existingTestimonial = await Testimonial.findById(id);
  if (!existingTestimonial) {
    return next(new ApiError("Testimonial not found", 404));
  }
  

  let imageResponse = null;

  if (image) {
    imageResponse = await uploadFileToCloudinary(image, "Testimonial");
    if (existingTestimonial.image) {
      await deleteFileFromCloudinary(existingTestimonial.image);
    }
  }

  const testimonialData = {
    ...req.body,
    image: imageResponse ? imageResponse[0] : undefined,
  };

  const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, testimonialData, {
    new: true,
    runValidators: true,
  });

  if (!updatedTestimonial) {
    return next(new ApiError("Testimonial update failed", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Testimonial updated successfully",
    data: updatedTestimonial,
  });
});

// Delete Testimonial by ID
export const deleteTestimonialById = asyncHandler(async (req, res, next) => {
  const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);

  if (!deletedTestimonial) {
    return next(new ApiError("Testimonial not found", 404));
  }

  if (deletedTestimonial?.image) {
    await deleteFileFromCloudinary(deletedTestimonial.image);
  }

  return res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
  });
});
