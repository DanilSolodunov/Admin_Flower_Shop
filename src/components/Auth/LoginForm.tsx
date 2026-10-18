import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  loginUser,
  registerUser,
} from "../../api/authApi";

import {
  saveTokens,
} from "../../services/tokenService";

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

export function LoginForm({
  onLoginSuccess,
}: LoginFormProps) {

  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);


  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const resetForm = () => {

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {

      if (isRegister) {

        if (!validateEmail(email)) {
          throw new Error(
            "Введите корректный email"
          );
        }

        if (password !== confirmPassword) {
          throw new Error(
            "Пароли не совпадают"
          );
        }

        if (password.length < 6) {
          throw new Error(
            "Минимум 6 символов"
          );
        }

        await registerUser(
          username,
          email,
          password,
          "ADMIN"
        );

        setIsRegister(false);

        setPassword("");
        setConfirmPassword("");

        setError(
          "Регистрация успешна. Теперь войдите."
        );

        return;
      }

      const response = await loginUser(
        email,
        password,
        "ADMIN"
      );


      console.log(
        "LOGIN RESPONSE:",
        response
      );

      if (!response.accessToken) {

        throw new Error(
          "Backend не вернул accessToken"
        );
      }

      if (!response.refreshToken) {

        throw new Error(
          "Backend не вернул refreshToken"
        );
      }

      saveTokens(
        response.accessToken,
        response.refreshToken
      );


      console.log(
        "Tokens saved successfully"
      );

      localStorage.setItem(
        "authUser",
        JSON.stringify({
          email,
          role: response.role ?? "ADMIN",
        })
      );

      onLoginSuccess(
        response.accessToken
      );

    } catch (err: any) {

      console.error(
        "Ошибка авторизации:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Ошибка авторизации"
      );

    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {

    setIsRegister(
      !isRegister
    );
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="text-center">
          <CardTitle>
            {isRegister
              ? "Регистрация"
              : "Вход в AdminHub"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Создайте аккаунт администратора"
              : "Введите данные"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {isRegister && (
              <Input
                placeholder="Имя"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            {isRegister && (

              <Input
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
              />
            )}

            {error && (
              <div className="text-red-500">
                {error}
              </div>

            )}

            <Button
              type="submit"
              disabled={isLoading}
            >

              {isLoading
                ? "Загрузка..."
                : isRegister
                  ? "Регистрация"
                  : "Войти"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600"
            >
              {isRegister
                ? "Войти"
                : "Регистрация"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}