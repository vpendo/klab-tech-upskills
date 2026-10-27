import api from "./api";
import type { Product } from "../Types/product";

const PRODUCT_URL = "/api/products";

export interface ProductResponse {
  products: Product[];
  pagination?: {
    currentPage: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ProductStats {
  totalProducts: number;
  totalStock: number;
  averagePrice: number;
}

interface ProductDataResponse {
  product?: Product;
  message?: string;
}

interface ProductStatsResponse {
  stats?: ProductStats;
  totalProducts?: number;
  totalStock?: number;
  averagePrice?: number;
}

const extractProduct = (
  data: ProductDataResponse | Product
): Product => {
  if ("product" in data && data.product) {
    return data.product;
  }

  return data as Product;
};

export const getProducts = async (
  params: Record<string, string | number> = {}
): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>(PRODUCT_URL, {
    params,
  });

  return response.data;
};

export const getProductById = async (
  id: string
): Promise<Product> => {
  const response = await api.get<ProductDataResponse | Product>(
    `${PRODUCT_URL}/${encodeURIComponent(id)}`
  );

  return extractProduct(response.data);
};

export const addProduct = async (
  product: FormData
): Promise<Product> => {
  const response = await api.post<ProductDataResponse | Product>(
    PRODUCT_URL,
    product
  );

  return extractProduct(response.data);
};

export const updateProduct = async (
  id: string,
  product: FormData
): Promise<Product> => {
  const response = await api.put<ProductDataResponse | Product>(
    `${PRODUCT_URL}/${encodeURIComponent(id)}`,
    product
  );

  return extractProduct(response.data);
};

export const deleteProduct = async (
  id: string
): Promise<void> => {
  await api.delete(`${PRODUCT_URL}/${encodeURIComponent(id)}`);
};

export const getProductStats = async (): Promise<ProductStats> => {
  const response = await api.get<ProductStatsResponse>(
    `${PRODUCT_URL}/stats`
  );

  const data = response.data;

  if (data.stats) {
    return data.stats;
  }

  return {
    totalProducts: data.totalProducts ?? 0,
    totalStock: data.totalStock ?? 0,
    averagePrice: data.averagePrice ?? 0,
  };
};
