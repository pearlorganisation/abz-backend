import {
  COOKIE_OPTIONS,
  LOCK_TIME,
  MAX_LOGIN_ATTEMPTS,
} from "../../../constants.js";
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

  const existingUser = await User.findOne({ email: decodedToken.email });
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
  const { email, user_name, password, identifier_type } = req.body;
  if (!password || (!email && !user_name)) {
    return next(
      new ApiError("Email or username and password are required", 400)
    );
  }
  let existingUser;

  if (identifier_type === "EMAIL") {
    existingUser = await User.findOne({ email: email.toLowerCase() });
  } else if (identifier_type === "USERNAME") {
    existingUser = await User.findOne({ user_name: user_name.toLowerCase() });
  } else {
    return next(new ApiError("Invalid identifier type", 400));
  }
  if (!existingUser) return next(new ApiError("User not found", 400));

  // Check if the user is verified (if necessary)
  if (!existingUser.is_email_verified) {
    return next(
      new ApiError("Please verify your email before logging in.", 403)
    );
  }

  // Check user account status
  if (existingUser.status === "SUSPENDED") {
    return next(
      new ApiError("Your account has been suspended. Contact support.", 403)
    );
  }

  if (existingUser.status === "BANNED") {
    return next(new ApiError("Your account has been banned.", 403));
  }
  if (existingUser.lock_until && existingUser.lock_until > new Date()) {
    return next(
      new ApiError(
        `Too many failed login attempts. Account locked until ${existingUser.lock_until.toLocaleString()}`,
        403
      )
    );
  }

  const isValidPassword = await existingUser.isPasswordCorrect(password);

  if (!isValidPassword) {
    // Increment login attempts
    existingUser.login_attempts = (existingUser.login_attempts || 0) + 1;
    console.log("login_attempts", existingUser.login_attempts);
    if (existingUser.login_attempts >= MAX_LOGIN_ATTEMPTS) {
      existingUser.lock_until = new Date(Date.now() + LOCK_TIME);
    }
    await existingUser.save();
    return next(new ApiError("Wrong password", 400));
  }
  // Extract IP and User-Agent
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];

  // Track login device/IP info
  existingUser.login_history.push({
    ip: ipAddress,
    userAgent,
    timestamp: new Date(),
  });

  // Limit login history entries (keep last 10)
  if (existingUser.login_history.length > 10) {
    existingUser.login_history = existingUser.login_history.slice(-10);
  }

  // Optional alert for new device or IP
  const knownDevice = existingUser.login_history.some(
    (entry) => entry.ip === ipAddress && entry.userAgent === userAgent
  );

  if (!knownDevice) {
    // You can send an alert email or log the new device login
    console.log("New device or IP detected.");
  }

  // Reset login attempts and update last login timestamp
  existingUser.login_attempts = 0;
  existingUser.last_login_at = new Date();
  await existingUser.save();

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
// Log IPs of repeated failed attempts (block suspicious IPs)
// Email the user when account is locked
// Allow manual unlock via admin panel or email verification

export const logout = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refresh_token: 1 } },
      { new: true }
    );

    // Check if user was found
    if (!user) {
      return next(new ApiError("User not found", 404)); // Return 404 if no user found
    }

    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(200)
      .json({ success: true, message: "Logout successfully!" });
  } catch (error) {
    console.log(`Error in logout: ${error.message}`);
    return next(new ApiError(`Error in logout: ${error.message}`, 500));
  }
});
