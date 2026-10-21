
import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import Cart from "../model/cart.model";
import Product from "../model/product.model";
import type { IProduct } from "../model/product.model";

// A product after its ObjectId reference has been populated
type PopulatedCartItem = {
  product: IProduct | null;
  quantity: number;
};

const isValidId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

// Get the logged-in customer's cart
export const getCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user!.userId,
    }).populate<{ items: PopulatedCartItem[] }>(
      "items.product"
    );

    if (!cart) {
      return res.status(200).json({
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    // Ignore items whose products no longer exist
    const items = cart.items.filter(
      (item) => item.product !== null
    );

    const totalItems = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalPrice = items.reduce(
      (sum, item) =>
        sum + item.product!.price * item.quantity,
      0
    );

    return res.status(200).json({
      items,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      message: "Failed to get cart",
    });
  }
};

// Add a product to the cart
export const addToCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (
      typeof productId !== "string" ||
      !isValidId(productId)
    ) {
      return res.status(400).json({
        message: "A valid productId is required",
      });
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        message: "Not enough stock available",
        availableStock: product.quantity,
      });
    }

    let cart = await Cart.findOne({
      user: req.user!.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user!.userId,
        items: [{ product: product._id, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.quantity) {
          return res.status(400).json({
            message: "Requested quantity exceeds available stock",
            availableStock: product.quantity,
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: product._id,
          quantity,
        });
      }

      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product");

    return res.status(200).json({
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      message: "Failed to add product to cart",
    });
  }
};

// Update a cart item's quantity
export const updateCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = req.params.productId;
    const { quantity } = req.body;

    if (
      typeof productId !== "string" ||
      !isValidId(productId)
    ) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock",
        availableStock: product.quantity,
      });
    }

    const cart = await Cart.findOne({
      user: req.user!.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (entry) => entry.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product is not in your cart",
      });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product");

    return res.status(200).json({
      message: "Cart quantity updated",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      message: "Failed to update cart",
    });
  }
};

// Remove one product from the cart
export const removeFromCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = req.params.productId;

    if (
      typeof productId !== "string" ||
      !isValidId(productId)
    ) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const cart = await Cart.findOne({
      user: req.user!.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const previousLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === previousLength) {
      return res.status(404).json({
        message: "Product is not in your cart",
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product");

    return res.status(200).json({
      message: "Product removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      message: "Failed to remove cart item",
    });
  }
};

// Clear the customer's cart
export const clearCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user!.userId },
      { $set: { items: [] } }
    );

    return res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      message: "Failed to clear cart",
    });
  }
};
