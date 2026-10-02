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

    //  the Cloudinary URL, used to display the image
    imageUrl: {
      type: String,
      required: true,
    },

    // the Cloudinary public_id, used to delete or replace the image
    imagePublicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;