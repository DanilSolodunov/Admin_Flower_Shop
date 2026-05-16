import axios from "axios";
import { Product } from "../types/Product";
import { authApi } from "./authApi";

const STATIC_BASE_URL = "http://localhost:8080";

export const productApi = {
  getAllProducts: async () => {
    const response =
      await authApi.get<Product[]>("/products");

    return response.data.map((product) => ({
      ...product,
      image:
        product.image &&
        !product.image.startsWith("http")
          ? `${STATIC_BASE_URL}${product.image}`
          : product.image,
    }));
  },

  getProductById: async (id: number) => {
    const response =
      await authApi.get<Product>(
        "/products/id",
        {
          params: { id },
        }
      );

    const product = response.data;

    if (
      product.image &&
      !product.image.startsWith("http")
    ) {
      product.image =
        `${STATIC_BASE_URL}${product.image}`;
    }

    return product;
  },

  getProductsByCategory: async (
    category: string
  ) => {
    const response =
      await authApi.get<Product[]>(
        `/products/category/${category}`
      );

    return response.data.map((product) => ({
      ...product,
      image:
        product.image &&
        !product.image.startsWith("http")
          ? `${STATIC_BASE_URL}${product.image}`
          : product.image,
    }));
  },

  searchProducts: async (keyword: string) => {
    const response =
      await authApi.get<Product[]>(
        "/products/search",
        {
          params: { keyword },
        }
      );

    return response.data.map((product) => ({
      ...product,
      image:
        product.image &&
        !product.image.startsWith("http")
          ? `${STATIC_BASE_URL}${product.image}`
          : product.image,
    }));
  },

  getCategories: async () => {
    const response =
      await authApi.get<string[]>(
        "/products/categories"
      );

    return response.data;
  },

  uploadImage: async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    const response =
      await authApi.post<string>(
        "/products/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

  addProduct: async (formData: FormData) => {
    const response =
      await authApi.post<Product>(
        "/products/addproduct",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

  updateProduct: async (
    id: number,
    formData: FormData
  ) => {
    const response =
      await authApi.put<Product>(
        `/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },
};