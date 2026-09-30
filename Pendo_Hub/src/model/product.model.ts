import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  gender: string;
  price: number;
  quantity: number;
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
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;