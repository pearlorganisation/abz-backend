import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../config/cloudinary.js";
import Program from "../../models/program/program.model.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";
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

export const getAllPrograms = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, q } = req.query;
  const { data: programs, pagination } = await paginate(
    Program,
    parseInt(page),
    parseInt(limit),
    {},
    [
      {
        path: "scope_groups",
        populate: {
          path: "assets",
        },
      },
    ]
  );

  if (!programs || programs.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No programs found.",
      data: [],
    });
  }

  return res.status(200).json({
    success: true,
    message: "Programs found successfully.",
    pagination,
    data: programs,
  });
});

export const deleteProgramById = asyncHandler(async (req, res, next) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) {
    return next(new ApiError("Program not found", 404));
  }
  if (program?.program_profile)
    await deleteFileFromCloudinary(program.program_profile);

  res.status(200).json({
    success: true,
    message: "Program deleted successfully",
  });
});

export const updateProgram = asyncHandler(async (req, res, next) => {
  const { programUsername } = req.params;
  const existingProgram = await Program.findOne({
    program_username: programUsername,
  });
  if (!existingProgram) {
    return next(new ApiError("Program not found", 404));
  }
  const programProfile = req.file;
  let programProfileResponse = null;
  if (programProfile) {
    if (existingProgram.program_profile) {
      await deleteFileFromCloudinary(existingProgram.program_profile);
    }
    programProfileResponse = await uploadFileToCloudinary(
      programProfile,
      "Programs"
    );
  }
  const updatedProgram = await Program.findOneAndUpdate(
    { program_username: programUsername },
    {
      ...req.body,
      program_additional_details: safeParse(
        req.body.program_additional_details
      ),
      program_rules_of_engagement: safeParse(
        req.body.program_rules_of_engagement
      ),
      scope_groups: safeParse(req.body.scope_groups),
      program_profile: programProfileResponse
        ? programProfileResponse[0]
        : existingProgram.program_profile,
    },
    { new: true }
  );
  if (!updatedProgram) {
    return next(new ApiError("Failed to update Program", 400));
  }
  res.status(200).json({
    success: true,
    message: "Program updated successfully",
    data: updatedProgram,
  });
});
