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
import { authApi } from '../../api/authApi';

interface RegisterResponse {
  message: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  role?: string;
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

    console.log('SUBMIT WORKS');

    try {
      if (isRegister) {
        if (!validateEmail(email)) throw new Error('Введите корректный email');
        if (password !== confirmPassword) throw new Error('Пароли не совпадают');
        if (password.length < 6) throw new Error('Минимум 6 символов');

        await authApi.post<RegisterResponse>('/auth/register', {
          name: username,
          email,
          password,
          role: 'ADMIN',
        });
      }

      const response = await authApi.post<LoginResponse>('/auth/login', {
        email,
        password,
        role: 'ADMIN',
      });

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // 🔥 НОВАЯ ЛОГИКА (ключевое изменение)
      localStorage.setItem(
        'authUser',
        JSON.stringify({
          email,
          role: 'ADMIN',
        })
      );

      onLoginSuccess(accessToken);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Ошибка авторизации'
      );
    } finally {
      setIsLoading(false);
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
        <CardHeader className="text-center">
          <CardTitle>
            {isRegister ? 'Регистрация' : 'Вход в AdminHub'}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? 'Создайте аккаунт администратора'
              : 'Введите данные'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <Input
                placeholder="Имя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {isRegister && (
              <Input
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            {error && <div className="text-red-500">{error}</div>}

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Загрузка...'
                : isRegister
                ? 'Регистрация'
                : 'Войти'}
            </Button>
          </form>

          <div className="text-center mt-4">
            <button onClick={toggleMode} className="text-blue-600">
              {isRegister ? 'Войти' : 'Регистрация'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}