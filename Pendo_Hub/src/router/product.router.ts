import { Router } from "express";

import {
  getProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";

const ProductRoute = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (public)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Get all products successfully
 *       500:
 *         description: Server error
 */
ProductRoute.get("/products", getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID (public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found successfully
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
ProductRoute.get("/products/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - gender
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Running Shoes
 *               description:
 *                 type: string
 *                 example: Comfortable running shoes
 *               category:
 *                 type: string
 *                 enum:
 *                   - Shoes
 *                   - Clothes
 *                 example: Shoes
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Men
 *                   - Women
 *                 example: Men
 *               price:
 *                 type: number
 *                 example: 25000
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *                 example: 5
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin access only
 *       500:
 *         description: Server error
 */
ProductRoute.post(
  "/products",
  authenticate,
  authorizeRoles("admin"),
  addProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Running Shoes
 *               description:
 *                 type: string
 *                 example: Updated product description
 *               category:
 *                 type: string
 *                 enum:
 *                   - Shoes
 *                   - Clothes
 *                 example: Shoes
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Men
 *                   - Women
 *                 example: Men
 *               price:
 *                 type: number
 *                 example: 30000
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *                 example: 10
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product ID or product data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
ProductRoute.put(
  "/products/:id",
  authenticate,
  authorizeRoles("admin"),
  updateProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
ProductRoute.delete(
  "/products/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteProduct,
);

export default ProductRoute;