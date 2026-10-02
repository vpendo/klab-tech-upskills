import { Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";            // NEW
import Product from "../model/product.model";
import cloudinary from "../config/cloudinary";              // NEW

// NEW: sends the image buffer (from Multer) to Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

// Get all products (no change)
export const getProduct = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get products",
    });
  }
};

// Get product by ID (no change)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }
};

// Create a new product (CHANGED: now uploads an image)
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, category, gender, price, quantity } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      !gender ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message:
          "name, description, category, gender, price, and quantity are required",
      });
    }

    // NEW: the image is required
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    // NEW: upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      name,
      description,
      category,
      gender,
      price,
      quantity,
      imageUrl: uploadResult.secure_url,     // NEW
      imagePublicId: uploadResult.public_id, // NEW
    });

    return res.status(201).json({
      message: "Product Created",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create product",
    });
  }
};

// Update a product by ID (CHANGED: image is optional)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const { name, description, category, gender, price, quantity } = req.body;

    // Update only the fields that were sent
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (gender !== undefined) product.gender = gender;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;

    // NEW: if a new image was sent, replace the old one
    let oldPublicId: string | undefined;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);

      oldPublicId = product.imagePublicId;
      product.imageUrl = uploadResult.secure_url;
      product.imagePublicId = uploadResult.public_id;
    }

    // save() runs the schema validation (enum, min, required)
    await product.save();

    // NEW: delete the old image only after the save succeeded
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    return res.status(200).json({
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update product",
    });
  }
};

// Delete a product by ID (CHANGED: also deletes the image)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    // NEW: remove the image from Cloudinary (skip old products with no image)
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    return res.status(200).json({
      message: "Product Deleted Successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to delete product",
    });
  }
};