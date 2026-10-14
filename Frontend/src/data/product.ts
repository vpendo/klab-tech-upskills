
import type { Product } from "../Services/productService";

export const products: Product[] = [
  {
    _id: "1",
    name: "Classic Sneakers",
    description: "Comfortable sneakers for everyday wear.",
    category: "Shoes",
    gender: "Men",
    price: 25000,
    quantity: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    imagePublicId: "",
  },
  {
    _id: "2",
    name: "Women's Heels",
    description: "Elegant heels for special occasions.",
    category: "Shoes",
    gender: "Women",
    price: 30000,
    quantity: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600",
    imagePublicId: "",
  },
  {
    _id: "3",
    name: "Denim Jacket",
    description: "A timeless jacket for casual outfits.",
    category: "Clothes",
    gender: "Men",
    price: 35000,
    quantity: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    imagePublicId: "",
  },
  {
    _id: "4",
    name: "Women's Casual Style",
    description: "A stylish look for everyday wear.",
    category: "Clothes",
    gender: "Women",
    price: 28000,
    quantity: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
    imagePublicId: "",
  },
];
