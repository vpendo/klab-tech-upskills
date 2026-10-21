
import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cart.controller";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/auth.middleware";

const CartRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Customer shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the logged-in customer's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer access only
 */
CartRoute.get("/cart", authenticate, authorizeRoles("customer"), getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: MongoDB ID of the product
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *     responses:
 *       200:
 *         description: Product added to cart
 *       400:
 *         description: Invalid product or quantity
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer access only
 */
CartRoute.post("/cart/items", authenticate, authorizeRoles("customer"), addToCart);

/**
 * @swagger
 * /api/cart/items/{productId}:
 *   patch:
 *     summary: Update a cart item's quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Invalid product ID or quantity
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Cart item not found
 */
CartRoute.patch(
  "/cart/items/:productId",
  authenticate,
  authorizeRoles("customer"),
  updateCartItem
);

/**
 * @swagger
 * /api/cart/items/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the product
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Cart item not found
 */
CartRoute.delete(
  "/cart/items/:productId",
  authenticate,
  authorizeRoles("customer"),
  removeFromCart
);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear the logged-in customer's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Authentication required
 */
CartRoute.delete("/cart", authenticate, authorizeRoles("customer"), clearCart);

export default CartRoute;
