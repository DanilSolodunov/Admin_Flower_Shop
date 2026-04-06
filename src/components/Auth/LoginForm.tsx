import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { api } from '../../api/api';

interface RegisterResponse {
  message: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isRegister) {
      if (!validateEmail(email)) {
        setError('Введите корректный email');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        setIsLoading(false);
        return;
      }

      try {
        await api.post<RegisterResponse>('/auth/register', {
          username,
          email,
          password,
          role: 'ADMIN',
        });

        const loginResponse = await api.post<LoginResponse>('/auth/login', {
          email,
          password,
        });

        localStorage.setItem('accessToken', loginResponse.data.accessToken);

        if (loginResponse.data.refreshToken) {
          localStorage.setItem(
            'refreshToken',
            loginResponse.data.refreshToken
          );
        }

        onLoginSuccess(loginResponse.data.accessToken);
      }

      catch (err: any) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Ошибка регистрации'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await api.post<LoginResponse>('/auth/login', {
          email,
          password,
        });

        localStorage.setItem('accessToken', response.data.accessToken);

        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        onLoginSuccess(response.data.accessToken);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Ошибка входа'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);

    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            {isRegister ? 'Регистрация' : 'Вход в AdminHub'}
          </CardTitle>

          <CardDescription className="text-slate-500">
            {isRegister
              ? 'Создайте новый аккаунт администратора'
              : 'Введите свои учетные данные для доступа'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-slate-300"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-300"
              />
            </div>


            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-300"
              />
            </div>

            {isRegister && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-slate-300"
                />
              </div>
            )}

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading
                ? isRegister
                  ? 'Регистрация...'
                  : 'Вход...'
                : isRegister
                  ? 'Зарегистрироваться'
                  : 'Войти'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-slate-500">
              {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
            </span>{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-blue-600 hover:underline"
            >
              {isRegister ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}