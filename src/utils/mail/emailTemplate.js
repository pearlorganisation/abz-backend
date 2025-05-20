import { FRONTEND_URL } from "../../config/index.js";
import { sendMail } from "./sendMail.js";

export const sendSignupMail = async (email, signUptoken) => {
  const subject = "Email Verification";
  const emailVerificationLink = `${FRONTEND_URL}/verify-email?token=${signUptoken}`;
  const templateName = "emailVerification";
  const data = { emailVerificationLink };

  return sendMail(email, subject, templateName, data);
};
