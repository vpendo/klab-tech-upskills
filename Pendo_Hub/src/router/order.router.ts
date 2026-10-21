
import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controller/order.controller";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/auth.middleware";

const OrderRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: PendoHub customer orders and admin order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place an order
 *     description: Logged-in customers can place orders. The backend calculates prices and totals.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - email
 *               - phone
 *               - address
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Pendo Vestine
 *               email:
 *                 type: string
 *                 example: pendo@example.com
 *               phone:
 *                 type: string
 *                 example: "0781234567"
 *               address:
 *                 type: string
 *                 example: Kigali, Rwanda
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 671234567890123456789012
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid order data or insufficient stock
 *       401:
 *         description: Authentication token missing or invalid
 *       403:
 *         description: Only customers can place orders
 *       500:
 *         description: Failed to place order
 */
OrderRoute.post(
  "/orders",
  authenticate,
  authorizeRoles("customer"),
  createOrder
);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get the logged-in customer's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer orders retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer access required
 */
OrderRoute.get(
  "/orders/my-orders",
  authenticate,
  authorizeRoles("customer"),
  getMyOrders
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all customer orders
 *     description: Admin-only endpoint.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
OrderRoute.get(
  "/orders",
  authenticate,
  authorizeRoles("admin"),
  getAllOrders
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details
 *     description: Customers can view their own orders; admins can view any order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
OrderRoute.get(
  "/orders/:id",
  authenticate,
  authorizeRoles("customer", "admin"),
  getOrderById
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Admin-only endpoint. Allowed statuses are Pending, Processing, Shipped, Delivered, and Cancelled.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - Processing
 *                   - Shipped
 *                   - Delivered
 *                   - Cancelled
 *                 example: Processing
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid order ID or status
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 *       409:
 *         description: Order status changed concurrently
 */
OrderRoute.patch(
  "/orders/:id/status",
  authenticate,
  authorizeRoles("admin"),
  updateOrderStatus
);

export default OrderRoute;
