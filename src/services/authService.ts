import { UserResponse } from "../api/authApi";

// services/authService.ts
const API_URL = 'http://localhost:8080/api';

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  // другие поля при необходимости
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Неверный логин');
    }

    return response.json();
  },

  async register(data: RegisterData): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка регистрации');
    }

    return response.json();
  },

  async getCurrentUser(token: string): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Не удалось получить данные пользователя');
    }

    return response.json();
  },
};