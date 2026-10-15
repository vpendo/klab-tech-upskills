
import type { Product } from "../Types/product";

export const products: Product[] = [
  {
    _id: "1",
    name: "New Balance",
    description: "Comfortable sneakers for everyday wear.",
    category: "Shoes",
    gender: "Men",
    price: 25000,
    quantity: 10,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_TrQ1-dvkbr3tqfVf3rSsoxBtyUgK_e5E-aiM-Ylc-g&s=10",
    imagePublicId: "",
  },
  {
    _id: "2",
    name: "Heels",
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
    name: "Jacket",
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
