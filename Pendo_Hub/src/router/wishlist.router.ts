
import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controller/wishlist.controller";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/auth.middleware";

const WishlistRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Customer wishlist management
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get the logged-in customer's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer access only
 */
WishlistRoute.get(
  "/wishlist",
  authenticate,
  authorizeRoles("customer"),
  getWishlist
);

/**
 * @swagger
 * /api/wishlist/items:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
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
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer access only
 */
WishlistRoute.post(
  "/wishlist/items",
  authenticate,
  authorizeRoles("customer"),
  addToWishlist
);

/**
 * @swagger
 * /api/wishlist/items/{productId}:
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
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
 *         description: Product removed from wishlist
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer access only
 *       404:
 *         description: Product not found in wishlist
 */
WishlistRoute.delete(
  "/wishlist/items/:productId",
  authenticate,
  authorizeRoles("customer"),
  removeFromWishlist
);

export default WishlistRoute;
