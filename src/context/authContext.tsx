import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "../api/api";
import { 
  getAccessToken, 
  getRefreshToken, 
  saveTokens, 
  clearTokens, 
  isTokenExpired,
  hasTokens 
} from "../services/tokenService";

interface AuthResponse {
  email: string;
  name: string;
  phone: string;
}

interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  authResponse: AuthResponse;
}

interface AuthContextType {
  user: AuthResponse | null;
  login: (data: AuthTokenResponse) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  checkAndRefreshToken: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);

  const login = (data: AuthTokenResponse) => {
    setUser(data.authResponse);

    localStorage.setItem("adminhub_users", JSON.stringify(data.authResponse));
    saveTokens(data.accessToken, data.refreshToken);
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("adminhub_users");
    clearTokens();

    window.location.href = "/";
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.warn("No refresh token available");
      return false;
    }

    try {
      const { data } = await api.post("/refresh", { refreshToken });
      
      saveTokens(data.accessToken, data.refreshToken || refreshToken);
      
      console.log("Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearTokens();
      setUser(null);
      localStorage.removeItem("adminhub_users");
      return false;
    }
  };

  const checkAndRefreshToken = async (): Promise<void> => {
    if (!hasTokens()) {
      return;
    }

    // Проверяем, истек ли токен (14 минут вместо 15 для запаса)
    if (isTokenExpired(14)) {
      console.log("Token is expired or about to expire, refreshing...");
      const success = await refreshAccessToken();
      
      if (!success) {
        console.warn("Failed to refresh token, user may need to login again");
      }
    } else {
      console.log("Token is still valid");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("adminhub_users");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Проверяем и обновляем токен при запуске приложения
        checkAndRefreshToken();
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshAccessToken,
        checkAndRefreshToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
