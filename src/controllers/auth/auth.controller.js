import Company from "../../models/company/company.js";
import Researcher from "../../models/researcher/researcher.model.js";
import User from "../../models/user/user.model.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { sendSignupMail } from "../../utils/mail/emailTemplate.js";
import { generateJWTToken } from "../../utils/tokenUtils.js";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res, next) => {
  const {
    first_name,
    last_name,
    user_name,
    email,
    phone_number,
    password,
    confirm_password,
    role,
    company_name,
  } = req.body;

  // Check if passwords match
  if (password !== confirm_password) {
    return next(new ApiError("Passwords do not match", 400));
  }

  // Check for existing user by email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return next(new ApiError("Email already in use", 409));
  }

  // Check for existing user by username
  const existingUsername = await User.findOne({ user_name });
  if (existingUsername) {
    return next(new ApiError("Username already in use", 409));
  }

  // Check for existing user by phone number (if provided)
  if (phone_number) {
    const existingPhone = await User.findOne({ phone_number });
    if (existingPhone) {
      return next(new ApiError("Phone number already in use", 409));
    }
  }

  const signupToken = generateJWTToken({ email, user_name, role });
  // Send verification email
  await sendSignupMail(email, signupToken);
  // Create the user
  const user = new User({
    first_name,
    last_name,
    user_name: user_name.toLowerCase(),
    email,
    phone_number,
    password,
    role,
  });

  if (role === "RESEARCHER") {
    const profile = new Researcher({});
    console.log("profile: ", profile);
    await profile.save();
    user.researcher_profile = profile._id;
  } else if (role === "COMPANY") {
    let company = await Company.findOne({ name: company_name });
    if (!company) {
      company = await Company.create({ name: company_name });
      console.log("company: ", company);
    }
    user.company_profile = company._id;
  }
  await user.save();
  res.status(201).json({
    success: true,
    message:
      "Registration received. Please verify your email to complete the signup process.",
  });
});

export const verifySignUpToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decodedToken) {
    return next(new ApiError("Email is not verified or Invalid token", 400));
  }

  const existingUser = await User.findById(decodedToken._id);
  if (!existingUser) {
    return next(new ApiError("User not found", 404));
  }

  // Check if the user is already verified
  if (existingUser.is_email_verified) {
    return next(new ApiError("User already verified", 400));
  }

  // Update the user's verification status
  existingUser.is_email_verified = true;
  await existingUser.save();

  // Redirect the user to the login page after successful verification
  // res.redirect(302, `${process.env.FRONTEND_LOGIN_PAGE_URL}`); //signup-success

  return res.status(200).json({
    success: true,
    message: "Email successfully verified! You can now log in.",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    return next(new ApiError("All fields are required", 400));
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new ApiError("User not found", 400));

  // Check if the user is verified (if necessary)
  if (!existingUser.is_email_verified) {
    return next(
      new ApiError("Please verify your email before logging in.", 403)
    );
  }

  const isValidPassword = await existingUser.isPasswordCorrect(password);

  if (!isValidPassword) {
    return next(new ApiError("Wrong password", 400));
  }

  const access_token = existingUser.generateAccessToken();
  const refresh_token = existingUser.generateRefreshToken();

  // Convert Mongoose document to plain object
  const sanitizedUser = existingUser.toObject();
  sanitizedUser.password = undefined;
  sanitizedUser.createdAt = undefined;
  sanitizedUser.updatedAt = undefined;
  sanitizedUser.__v = undefined;

  res
    .cookie("access_token", access_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    })
    .cookie("refresh_token", refresh_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    })
    .status(200)
    .json({
      success: true,
      message: "Login Successfull",
      user: sanitizedUser,
    });
});

export const logout = asyncHandler(async (req, res, next) => {});
