
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";

import User from "../model/user.model";
import {
  sendResetOTP,
  sendWelcomeEmail,
} from "../services/email.service";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/auth.validation";

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    // Validate registration data
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message || "Invalid registration data",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = result.data;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send welcome email without failing registration if email delivery fails
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    // Handle duplicate email errors from MongoDB
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to register user",
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    // Validate login data
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message || "Invalid login data",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password } = result.data;

    // Find user by normalized email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare submitted password with stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Authentication service is not configured",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Failed to login",
    });
  }
};

// Forgot password - send OTP
export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    // Validate email
    const result = forgotPasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message || "Invalid email",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email } = result.data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate a secure 6-digit OTP
    const otp = randomInt(100000, 1000000).toString();

    // OTP expires after 10 minutes
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    try {
      await sendResetOTP(user.email, otp);
    } catch (emailError) {
      console.error("Reset OTP email error:", emailError);

      // Clear the OTP if email delivery fails
      user.resetOTP = undefined;
      user.resetOTPExpires = undefined;
      await user.save();

      return res.status(500).json({
        message: "Failed to send reset code",
      });
    }

    return res.status(200).json({
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Failed to send reset code",
    });
  }
};

// Reset password using OTP
export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    // Validate reset data
    const result = resetPasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message || "Invalid reset data",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, otp, newPassword } = result.data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }

    // Check OTP and expiry
    if (
      !user.resetOTP ||
      user.resetOTP !== otp ||
      !user.resetOTPExpires ||
      user.resetOTPExpires.getTime() <= Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }

    // Hash and save the new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear OTP so it cannot be reused
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Failed to reset password",
    });
  }
};
