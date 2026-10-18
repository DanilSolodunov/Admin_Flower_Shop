export const API_URL =
  "http://localhost:8080";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role?: string;
}

export interface RegisterResponse {
  message: string;
}

export async function loginUser(
  email: string,
  password: string,
  role: string = "ADMIN"
): Promise<LoginResponse> {

  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email,
        password,
        role,
      }),
    }
  );


  if (!response.ok) {
    const errorData =
      await response.json();

    throw new Error(
      errorData.message ||
      "Ошибка при логине"
    );
  }

  const data =
    await response.json();

  console.log(
    "Backend login response:",
    data
  );

  return data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string = "ADMIN"
): Promise<RegisterResponse> {

  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    }
  );

  if (!response.ok) {

    const errorData =
      await response.json();

    throw new Error(
      errorData.message ||
      "Ошибка при регистрации"
    );
  }

  return response.json();
}