import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  gender: string;
  price: number;
  quantity: number;
  imageUrl: string;
  imagePublicId: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Shoes", "Clothes"],
    },

    gender: {
      type: String,
      required: true,
      enum: ["Men", "Women"],
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    // Cloudinary URL used to display the image
    imageUrl: {
      type: String,
      required: true,
    },

    // Cloudinary public ID used to delete or replace the image
    imagePublicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster product filtering and searching
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;