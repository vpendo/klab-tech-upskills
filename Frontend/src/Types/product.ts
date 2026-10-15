
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: "Shoes" | "Clothes";
  gender: "Men" | "Women";
  price: number;
  quantity: number;
  imageUrl: string;
  imagePublicId: string;
}
