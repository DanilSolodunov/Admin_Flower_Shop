import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  sub?: string;
  role?: string;
}

export const authApi = axios.create({
  baseURL: "http://localhost:8080/api",
});

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime + 60;
  } catch (error) {
    return true;
  }
};

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

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const { data } = await axios.post(
    "http://localhost:8080/api/auth/refresh",
    {
      refreshToken,
    }
  );

  localStorage.setItem(
    "accessToken",
    data.accessToken
  );

  if (data.refreshToken) {
    localStorage.setItem(
      "refreshToken",
      data.refreshToken
    );
  }

  return data.accessToken;
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

      try {
        const newAccessToken =
          await refreshAccessToken();

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return authApi(originalRequest);
      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");

        window.location.href = "/";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const initializeAuth = async (): Promise<boolean> => {
  try {
    const accessToken =
      localStorage.getItem("accessToken");

    const refreshToken =
      localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return false;
    }

    if (
      accessToken &&
      !isTokenExpired(accessToken)
    ) {
      return true;
    }

    await refreshAccessToken();

    return true;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");

    return false;
  }
};