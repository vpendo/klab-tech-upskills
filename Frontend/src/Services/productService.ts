import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

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
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

// Get all products
export const getProducts = async (
  page = 1,
  limit = 10
): Promise<ProductsResponse> => {
  const response = await axios.get(API_URL, {
    params: { page, limit },
  });

  return response.data;
};

// Get one product by ID
export const getProductById = async (
  id: string
): Promise<Product> => {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data;
};