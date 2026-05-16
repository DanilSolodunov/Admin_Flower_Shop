
// import axios from "axios";
// import { Product, AddToCartRequest } from "../types/Product";

// export const api = axios.create({
//   baseURL: "http://localhost:8080/api",
// });

// const STATIC_BASE_URL = "http://localhost:8080";

// // Продукты
// export const productApi = {
//   // Получить все товары
//   getAllProducts: async () => {
//     const response = await api.get<Product[]>("/products");
//     console.log('С сервера получены товары:', response.data);
//     // Добавляем baseURL к изображениям, если сервер возвращает относительный путь
//     return response.data.map(product => ({
//       ...product,
//       image: product.image && !product.image.startsWith('http')
//         ? `${STATIC_BASE_URL}${product.image}`
//         : product.image,
//     }));
//   },

//   // Получить товар по ID
//   getProductById: async (id: number) => {
//     const response = await api.get<Product>(`/products/id`, { params: { id } });
//     const product = response.data;
//     // Добавляем baseURL к изображению
//     if (product.image && !product.image.startsWith('http')) {
//       product.image = `${STATIC_BASE_URL}${product.image}`;
//     }
//     return product;
//   },

//   // Получить товары по категории
//   getProductsByCategory: async (category: string) => {
//     const response = await api.get<Product[]>(`/products/category/${category}`);
//     return response.data.map(product => ({
//       ...product,
//       image: product.image && !product.image.startsWith('http')
//         ? `${STATIC_BASE_URL}${product.image}`
//         : product.image,
//     }));
//   },

//   // Поиск товаров
//   searchProducts: async (keyword: string) => {
//     const response = await api.get<Product[]>("/products/search", { params: { keyword } });
//     return response.data.map(product => ({
//       ...product,
//       image: product.image && !product.image.startsWith('http')
//         ? `${STATIC_BASE_URL}${product.image}`
//         : product.image,
//     }));
//   },

//   // Получить все категории
//   getCategories: async () => {
//     const response = await api.get<string[]>("/products/categories");
//     return response.data;
//   },

//   // Сжать изображение перед загрузкой
//   compressImage: async (file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<File> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target?.result as string;
//         img.onload = () => {
//           const canvas = document.createElement('canvas');
//           let width = img.width;
//           let height = img.height;

//           // Вычисляем новые размеры, сохраняя пропорции
//           if (width > height) {
//             if (width > maxWidth) {
//               height = Math.round((height * maxWidth) / width);
//               width = maxWidth;
//             }
//           } else {
//             if (height > maxHeight) {
//               width = Math.round((width * maxHeight) / height);
//               height = maxHeight;
//             }
//           }

//           canvas.width = width;
//           canvas.height = height;

//           const ctx = canvas.getContext('2d');
//           if (!ctx) {
//             reject(new Error('Не удалось получить контекст canvas'));
//             return;
//           }

//           ctx.drawImage(img, 0, 0, width, height);

//           canvas.toBlob(
//             (blob) => {
//               if (!blob) {
//                 reject(new Error('Не удалось сжать изображение'));
//                 return;
//               }
//               const compressedFile = new File([blob], file.name, {
//                 type: 'image/jpeg',
//                 lastModified: Date.now(),
//               });
//               console.log(`Изображение сжато: ${file.size} -> ${compressedFile.size} bytes (${Math.round((1 - compressedFile.size / file.size) * 100)}% сжатие)`);
//               resolve(compressedFile);
//             },
//             'image/jpeg',
//             quality
//           );
//         };
//         img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
//       };
//       reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
//     });
//   },

//   // Загрузить изображение
//   uploadImage: async (image: File, compress: boolean = true) => {
//     let fileToUpload = image;

//     // Сжимаем изображение перед загрузкой
//     if (compress) {
//       try {
//         fileToUpload = await productApi.compressImage(image);
//       } catch (error) {
//         console.warn('Не удалось сжать изображение, загружаем оригинал:', error);
//         fileToUpload = image;
//       }
//     }

//     const formData = new FormData();
//     formData.append("image", fileToUpload);

//     console.log('Загрузка изображения:', fileToUpload.name, fileToUpload.size, 'bytes');

//     const response = await api.post<string>("/products/upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     console.log('Изображение загружено, ответ сервера:', response.data);
//     return response.data;
//   },

//   addProduct: async (formData: FormData) => {
//     const response = await api.post<Product>(
//       "/products/addproduct",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     return response.data;
//   },

//   updateProduct: async (id: number, formData: FormData) => {
//     const response = await api.put<Product>(
//       `/products/${id}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     return response.data;
//   },
// };

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshToken = localStorage.getItem("refreshToken");
//       if (!refreshToken) {
//         return Promise.reject(error);
//       }

//       try {
//         const { data } = await api.post("/auth/refresh", { refreshToken });

//         localStorage.setItem("accessToken", data.accessToken);

//         processQueue(null, data.accessToken);

//         return api(originalRequest);

//       } catch (err) {

//         processQueue(err, null);

//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");

//         return Promise.reject(err);

//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );




import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:8080/api",
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (
  error: any,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

authApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return authApi(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        localStorage.getItem("refreshToken");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const { data } = await authApi.post(
          "/auth/refresh",
          {
            refreshToken,
          }
        );

        localStorage.setItem(
          "accessToken",
          data.accessToken
        );

        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return authApi(originalRequest);
      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);