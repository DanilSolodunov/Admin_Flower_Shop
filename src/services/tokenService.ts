// src/services/tokenService.ts

import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = 'https://your-api-url.com';

interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

let accessToken: string | null = null;
let refreshToken: string | null = null;
let expiresAt: number | null = null;

async function fetchToken() {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { username: 'your_username', password: 'your_password' });
    accessToken = response.data.token;
    refreshToken = response.data.refreshToken;
    expiresAt = Date.now() + response.data.expiresIn * 1000; // Convert seconds to milliseconds

    console.log('Access token fetched:', accessToken);
    return response.data;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

function isTokenExpired(): boolean {
  return expiresAt ? Date.now() > expiresAt : true;
}

async function refreshAccessToken() {
  try {
    const response = await axios.post(`${API_URL}/api/token/refresh`, { refreshToken });
    accessToken = response.data.token;
    expiresAt = Date.now() + response.data.expiresIn * 1000; // Convert seconds to milliseconds

    console.log('Access token refreshed:', accessToken);
    return response.data;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function initAuth() {
      try {
        await fetchToken();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    const intervalId = setInterval(async () => {
      if (isTokenExpired()) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Failed to refresh access token:', error);
          // Handle the error, e.g., redirect to login page
        }
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  const logout = async () => {
    accessToken = null;
    refreshToken = null;
    expiresAt = null;
    setIsAuthenticated(false);
  };

  return { isLoading, isAuthenticated, logout };
}

export default { fetchToken, isTokenExpired, refreshAccessToken };