
import { Request, Response } from "express";
import { Types } from "mongoose";
import Product from "../model/product.model";
import Order, { OrderStatus } from "../model/order.model";
import { AuthRequest } from "../middleware/auth.middleware";

interface RequestedItem {
  productId: string;
  quantity: number;
}

interface ReservedItem {
  productId: Types.ObjectId;
  quantity: number;
}

const allowedStatuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const isCancelled = (status: OrderStatus): boolean =>
  status === "Cancelled";

// Restore reserved stock if creating an order fails.
const restoreStock = async (
  items: ReservedItem[]
): Promise<void> => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { quantity: item.quantity } }
    );
  }
};

// Customer places an order.
export const createOrder = async (
  req: AuthRequest,
  res: Response
) => {
  const reservedItems: ReservedItem[] = [];

  try {
    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({
        message: "Only logged-in customers can place orders",
      });
    }

    const {
      customerName,
      email,
      phone,
      address,
      items,
    } = req.body as {
      customerName?: string;
      email?: string;
      phone?: string;
      address?: string;
      items?: RequestedItem[];
    };

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof address !== "string" ||
      !address.trim()
    ) {
      return res.status(400).json({
        message:
          "Name, email, phone, and delivery address are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your order must contain at least one product",
      });
    }

    // Validate items and combine duplicate product IDs.
    const quantities = new Map<string, number>();

    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !Types.ObjectId.isValid(item.productId) ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Each product must have a valid ID and quantity",
        });
      }

      const productId = item.productId;
      const quantity =
        (quantities.get(productId) || 0) + item.quantity;

      if (!Number.isSafeInteger(quantity)) {
        return res.status(400).json({
          message: "Invalid product quantity",
        });
      }

      quantities.set(productId, quantity);
    }

    const orderItems: {
      productId: Types.ObjectId;
      name: string;
      price: number;
      quantity: number;
      imageUrl: string;
    }[] = [];

    let total = 0;

    for (const [productId, quantity] of quantities) {
      // Reserve available stock atomically.
      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          quantity: { $gte: quantity },
        },
        {
          $inc: { quantity: -quantity },
        },
        { new: true }
      );

      if (!product) {
        await restoreStock(reservedItems);
        reservedItems.length = 0;

        return res.status(400).json({
          message:
            "A product is unavailable or stock is insufficient. Please refresh your cart.",
        });
      }

      reservedItems.push({
        productId: product._id,
        quantity,
      });

      const lineTotal = product.price * quantity;

      if (
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isFinite(lineTotal) ||
        !Number.isFinite(total + lineTotal)
      ) {
        await restoreStock(reservedItems);
        reservedItems.length = 0;

        return res.status(400).json({
          message: "Unable to calculate the order total",
        });
      }

      total += lineTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl || "",
      });
    }

    const order = await Order.create({
      customerId: req.user.userId,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      items: orderItems,
      total,
      status: "Pending",
    });

    // The order was saved successfully.
    reservedItems.length = 0;

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    try {
      await restoreStock(reservedItems);
    } catch (restoreError) {
      console.error("Stock restoration error:", restoreError);
    }

    return res.status(500).json({
      message: "Failed to place order. Please try again.",
    });
  }
};

// Customer can view only their own orders.
export const getMyOrders = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({
        message: "Only customers can access their order history",
      });
    }

    const orders = await Order.find({
      customerId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get customer orders error:", error);

    return res.status(500).json({
      message: "Failed to get your orders",
    });
  }
};

// Admin can view all customer orders.
export const getAllOrders = async (
  _req: Request,
  res: Response
) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      message: "Failed to get orders",
    });
  }
};

// Customer can view their own order; admin can view any order.
export const getOrderById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const orderId = req.params.id;

    if (
      typeof orderId !== "string" ||
      !Types.ObjectId.isValid(orderId)
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const isAdmin = req.user?.role === "admin";
    const isOwner =
      order.customerId.toString() === req.user?.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You cannot access this order",
      });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Get order details error:", error);

    return res.status(500).json({
      message: "Failed to get order details",
    });
  }
};

// Admin updates an order status.
export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const orderId = req.params.id;

    if (
      typeof orderId !== "string" ||
      !Types.ObjectId.isValid(orderId)
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const requestedStatus: unknown = req.body?.status;

    if (
      typeof requestedStatus !== "string" ||
      !allowedStatuses.some(
        (allowedStatus) => allowedStatus === requestedStatus
      )
    ) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // Validation above confirms this is an allowed status.
    const status = requestedStatus as OrderStatus;

    const existingOrder = await Order.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const currentStatus: OrderStatus = existingOrder.status;

    if (isCancelled(currentStatus)) {
      return res.status(400).json({
        message: "A cancelled order cannot be reopened",
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: { $ne: "Cancelled" },
      },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(409).json({
        message:
          "The order status has changed. Refresh and try again.",
      });
    }

    // Return the reserved stock if the admin cancels the order.
    if (status === "Cancelled" && !isCancelled(currentStatus)) {
      for (const item of updatedOrder.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { quantity: item.quantity } }
        );
      }
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "Failed to update order status",
    });
  }
};
