import { z } from "zod";

// Define Zod Schema for user registration validation
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .max(30, "Username is too long"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  phone_number: z
    .string()
    .optional()
    .refine(
      (val) => /^\+?[1-9]\d{9,14}$/.test(val),
      "Please enter a valid phone number"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
      "Password must include at least one uppercase letter, one lowercase letter, and one special character"
    ),
  confirm_password: z.string().min(1, "Confirm password is required"),
  role: z.enum(["ADMIN", "USER"], "Invalid role").optional().default("USER"),
});

export default registerSchema;
