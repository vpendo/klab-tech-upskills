
import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import Wishlist from "../model/wishlist.model";
import Product from "../model/product.model";

// Check whether a value is a valid MongoDB ObjectId
const isValidId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

// Get the logged-in customer's wishlist
export const getWishlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user!.userId,
    }).populate("products");

    const products = wishlist
      ? wishlist.products.filter((product) => product !== null)
      : [];

    return res.status(200).json({
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return res.status(500).json({
      message: "Failed to get wishlist",
    });
  }
};

// Add a product to the wishlist
export const addToWishlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { productId } = req.body;

    if (
      typeof productId !== "string" ||
      !isValidId(productId)
    ) {
      return res.status(400).json({
        message: "A valid productId is required",
      });
    }

    // Check whether the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Create a wishlist if the customer does not have one.
    // $addToSet prevents the same product from being added twice.
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user!.userId },
      {
        $addToSet: {
          products: product._id,
        },
        $setOnInsert: {
          user: req.user!.userId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate("products");

    return res.status(200).json({
      message: "Product saved to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add wishlist item error:", error);

    return res.status(500).json({
      message: "Failed to add product to wishlist",
    });
  }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = req.params.productId;

    // Validate productId before passing it to MongoDB
    if (
      typeof productId !== "string" ||
      !isValidId(productId)
    ) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user!.userId },
      {
        $pull: {
          products: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        new: true,
      }
    ).populate("products");

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    return res.status(200).json({
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Remove wishlist item error:", error);

    return res.status(500).json({
      message: "Failed to remove product from wishlist",
    });
  }
};
