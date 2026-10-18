import { Product } from "../types/Product";
import { api } from "./api";

const STATIC_BASE_URL = "http://localhost:8080";

export const productApi = {
  getAllProducts: async () => {
    const response =
      await api.get<Product[]>("/products/supplier");

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
      await api.get<Product>(
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
      await api.get<Product[]>(
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
      await api.get<Product[]>(
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
      await api.get<string[]>(
        "/products/categories"
      );

    return response.data;
  },

  uploadImage: async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    const response =
      await api.post<string>(
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

addProduct: async (formData: FormData): Promise<Product> => {

  try {
    const response = await api.post<Product>(
      '/products/addproduct',
      formData
    );

    return response.data;
  } catch (error) {
    throw error;
  }
},

updateProduct: async (id: number, formData: FormData): Promise<Product> => {
  const response = await api.put<Product>(
    `/products/${id}`,
    formData
  );

  return response.data;
},
};