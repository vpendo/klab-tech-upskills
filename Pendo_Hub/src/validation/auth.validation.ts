

import { z } from "zod";

// Validate and normalize email addresses
const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Please enter a valid email address")
  .transform((email) => email.toLowerCase());

// Validate passwords for login
const passwordSchema = z
  .string()
  .min(1, "Password is required");

// Validate user registration
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),

  email: emailSchema,

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

// Validate user login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Validate forgot-password requests
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Validate password-reset requests
export const resetPasswordSchema = z.object({
  email: emailSchema,

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit code"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});
