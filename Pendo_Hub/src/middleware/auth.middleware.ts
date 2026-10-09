
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type UserRole = "customer" | "admin";

export interface AuthRequest extends Request {
  user?: { userId: string; role: UserRole };
}

// Authenticate user using JWT
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authentication token is required",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!token) {
      res.status(401).json({
        message: "Invalid authentication format",
      });
      return;
    }

    if (!secret) {
      res.status(500).json({
        message: "Server configuration error",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Authorize user roles
export const authorizeRoles =
  (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: "Access denied. Admins only.",
      });
      return;
    }

    next();
  };