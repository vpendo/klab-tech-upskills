import { Router } from "express";

import {
  getProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller";

import { authenticate, authorizeRoles } from "../middleware/auth.middleware";
import { upload } from "../middleware/uploadMiddleware";

const ProductRoute = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products with pagination, filtering, search, and sorting
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of products per page
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum:
 *             - Shoes
 *             - Clothes
 *         description: Filter products by category
 *
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum:
 *             - Men
 *             - Women
 *         description: Filter products by gender
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum product price
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum product price
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name or description
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - price-asc
 *             - price-desc
 *             - newest
 *             - oldest
 *         description: Sort products
 *
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *     summary: Create a new product with an image (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - gender
 *               - price
 *               - quantity
 *               - image
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product data or missing image
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
  upload.single("image"),
  addProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID, image optional (admin only)
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
 *         multipart/form-data:
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
 *               image:
 *                 type: string
 *                 format: binary
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
  upload.single("image"),
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product and its image by ID (admin only)
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
  deleteProduct
);

export default ProductRoute;