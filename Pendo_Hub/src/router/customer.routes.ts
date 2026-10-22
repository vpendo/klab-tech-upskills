
import { Router } from "express";
import { getCustomers } from "../controller/customer.controller";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/users/customers:
 *   get:
 *     summary: Get all registered customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get(
  "/customers",
  authenticate,
  authorizeRoles("admin"),
  getCustomers
);

export default router;
