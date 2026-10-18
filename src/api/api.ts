import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";

import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../services/tokenService";

interface JwtPayload {
  exp: number;
  sub?: string;
  role?: string;
}

const API_URL = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;

    // Обновляем токен за 60 секунд до истечения
    return decoded.exp <= currentTime + 60;
  } catch (error) {
    console.error("Ошибка декодирования JWT:", error);
    return true;
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (
  error: unknown,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  console.log("Refreshing access token...");

  const response = await axios.post<{
    accessToken: string;
    refreshToken?: string;
  }>(
    `${API_URL}/refresh`,
    {
      refreshToken,
    }
  );

  const newAccessToken = response.data.accessToken;

  const newRefreshToken =
    response.data.refreshToken || refreshToken;

  if (!newAccessToken) {
    throw new Error("Backend did not return accessToken");
  }

  saveTokens(
    newAccessToken,
    newRefreshToken
  );

  console.log("Access token refreshed successfully");

  return newAccessToken;
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/refresh")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>(
        (resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }
      ).then((token) => {
        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newAccessToken =
        await refreshAccessToken();

      processQueue(
        null,
        newAccessToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      processQueue(
        refreshError,
        null
      );

      clearTokens();

      return Promise.reject(
        refreshError
      );

    } finally {
      isRefreshing = false;
    }
  }
);

export const initializeAuth =
  async (): Promise<boolean> => {

    try {
      const accessToken =
        getAccessToken();

      const refreshToken =
        getRefreshToken();

      console.log("AUTH INIT:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });

      if (!refreshToken) {
        return false;
      }

      if (
        accessToken &&
        !isTokenExpired(accessToken)
      ) {
        console.log(
          "Access token is valid"
        );

        return true;
      }

      console.log(
        "Access token expired, refreshing..."
      );

      await refreshAccessToken();

      return true;

    } catch (error) {
      console.error(
        "Auth initialization failed:",
        error
      );

      clearTokens();

      return false;
    }
  };