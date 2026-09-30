
import { Request, Response } from "express";
import Product from "../model/product.model";

// Get all products
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

// Get product by ID
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

// Create a new product
export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      gender,
      price,
      quantity,
    } = req.body;

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

    const product = await Product.create({
      name,
      description,
      category,
      gender,
      price,
      quantity,
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

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
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

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
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
