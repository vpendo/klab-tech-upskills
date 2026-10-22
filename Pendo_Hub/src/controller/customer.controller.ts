
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../model/user.model";

export const getCustomers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Failed to fetch customers:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers",
    });
  }
};
