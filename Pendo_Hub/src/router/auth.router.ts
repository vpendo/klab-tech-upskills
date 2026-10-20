
import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controller/auth.controller";

const AuthRoute = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 80
 *                 example: Pendo Vestine
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pendo@gmail.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 72
 *                 example: "PendoHub123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
AuthRoute.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pendo@gmail.com
 *               password:
 *                 type: string
 *                 minLength: 1
 *                 example: "PendoHub123"
 *     responses:
 *       200:
 *         description: Login successful, returns a token and user
 *       400:
 *         description: Invalid login data
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
AuthRoute.post("/login", login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send an OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pendo@gmail.com
 *     responses:
 *       200:
 *         description: Reset code sent to your email
 *       400:
 *         description: Invalid email
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to send reset code
 */
AuthRoute.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using an OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pendo@gmail.com
 *               otp:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 72
 *                 example: "NewPendoHub123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid reset data, OTP, or expired OTP
 *       500:
 *         description: Failed to reset password
 */
AuthRoute.post("/reset-password", resetPassword);

export default AuthRoute;
