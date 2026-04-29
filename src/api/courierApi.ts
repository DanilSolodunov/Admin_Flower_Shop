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