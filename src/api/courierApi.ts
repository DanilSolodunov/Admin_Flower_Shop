import { Courier } from "../types/Courier";

const API_URL = "http://localhost:8080/api/courier";

export async function createCourier(courier: Courier, token?: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      name: courier.name,
      phone: courier.phone,
      status: courier.status
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ошибка: ${response.status} - ${text}`);
  }

  return response.json();
}

export async function getAllCouriers(token?: string) {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? {
        Authorization: `Bearer ${token}`
      } : {})
    }
  });

  if (!response.ok) {
    throw new Error("Ошибка загрузки курьеров");
  }

  return response.json();
}

export async function updateCourier(
  id: number,
  courier: Courier,
  token?: string
) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      name: courier.name,
      phone: courier.phone,
      status: courier.status,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ошибка: ${response.status} - ${text}`);
  }

  return response.json();
}

export async function deleteCourier(id: number, token?: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ошибка удаления: ${response.status} - ${text}`);
  }

  // если сервер возвращает JSON — можно вернуть его, иначе просто ok
  return response.ok;
}