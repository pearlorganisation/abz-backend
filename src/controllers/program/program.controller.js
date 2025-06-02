import { uploadFileToCloudinary } from "../../config/cloudinary.js";
import Program from "../../models/program/program.model.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { safeParse } from "../../utils/safeParse.js";

export const createProgram = asyncHandler(async (req, res, next) => {
  const programProfile = req.file;
  let programProfileResponse = null;
  if (programProfile) {
    programProfileResponse = await uploadFileToCloudinary(
      programProfile,
      "Programs"
    );
  }
  const program = await Program.create({
    ...req.body,
    program_additional_details: safeParse(req.body.program_additional_details),
    program_rules_of_engagement: safeParse(
      req.body.program_rules_of_engagement
    ),
    scope_groups: safeParse(req.body.scope_groups),
    program_profile: programProfileResponse ? programProfileResponse[0] : null,
  });
  if (!program) {
    return next(new ApiError("Failed to create Program", 400));
  }
  res.status(201).json({
    success: true,
    message: "Program created successfully",
    data: program,
  });
});

export const deleteProgramById = asyncHandler(async (req, res, next) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) {
    return next(new ApiError("Program not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Program deleted successfully",
  });
});
