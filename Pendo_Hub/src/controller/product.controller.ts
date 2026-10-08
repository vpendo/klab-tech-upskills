import { Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";
import Product from "../model/product.model";
import cloudinary from "../config/cloudinary";

// Upload image to Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// Get all products with pagination, filtering, and sorting
export const getProduct = async (req: Request, res: Response) => {
  try {
    // Pagination
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    // Filters
    const { category, gender, sort } = req.query;

    const filter: any = {};

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by gender
    if (gender) {
      filter.gender = gender;
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };

    if (sort === "price-asc") {
      sortOption = { price: 1 };
    }

    if (sort === "price-desc") {
      sortOption = { price: -1 };
    }

    if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    // Get products
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Get total matching products
    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

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

    // Product image is required
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      name,
      description,
      category,
      gender,
      price,
      quantity,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });

    return res.status(201).json({
      message: "Product Created",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(400).json({
      message: "Failed to create product",
    });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const {
      name,
      description,
      category,
      gender,
      price,
      quantity,
    } = req.body;

    // Update only fields that were sent
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (gender !== undefined) product.gender = gender;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;

    // Replace image if a new one was uploaded
    let oldPublicId: string | undefined;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);

      oldPublicId = product.imagePublicId;

      product.imageUrl = uploadResult.secure_url;
      product.imagePublicId = uploadResult.public_id;
    }

    await product.save();

    // Delete old image after successful save
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    return res.status(200).json({
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

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

    // Remove image from Cloudinary
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    return res.status(200).json({
      message: "Product Deleted Successfully",
      product,
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(400).json({
      message: "Failed to delete product",
    });
  }
};

// Database seeding
export const seedProducts = async (req: Request, res: Response) => {
  try {
    const sampleProducts = [
      {
        name: "Nike Running Shoes",
        description: "Comfortable running shoes",
        category: "Shoes",
        gender: "Men",
        price: 25000,
        quantity: 10,
        imageUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        imagePublicId: "sample-nike-shoes",
      },
      {
        name: "Adidas Sneakers",
        description: "Stylish sneakers for women",
        category: "Shoes",
        gender: "Women",
        price: 30000,
        quantity: 8,
        imageUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        imagePublicId: "sample-adidas-shoes",
      },
      {
        name: "Classic Skirt",
        description: "Simple women's skirt",
        category: "Clothes",
        gender: "Women",
        price: 10000,
        quantity: 15,
        imageUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        imagePublicId: "sample-skirt",
      },
      {
        name: "Men T-Shirt",
        description: "Comfortable cotton t-shirt",
        category: "Clothes",
        gender: "Men",
        price: 12000,
        quantity: 20,
        imageUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        imagePublicId: "sample-tshirt",
      },
    ];

    const products = await Product.insertMany(sampleProducts);

    return res.status(201).json({
      message: "Sample products added successfully",
      products,
    });
  } catch (error) {
    console.error("Seed products error:", error);

    return res.status(500).json({
      message: "Failed to seed products",
    });
  }
};

// Product statistics using MongoDB aggregation
export const getProductStats = async (req: Request, res: Response) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$quantity" },
          averagePrice: { $avg: "$price" },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        totalProducts: 0,
        totalStock: 0,
        averagePrice: 0,
      });
    }

    return res.status(200).json({
      totalProducts: stats[0].totalProducts,
      totalStock: stats[0].totalStock,
      averagePrice: Math.round(stats[0].averagePrice),
    });
  } catch (error) {
    console.error("Product statistics error:", error);

    return res.status(500).json({
      message: "Failed to get product statistics",
    });
  }
};