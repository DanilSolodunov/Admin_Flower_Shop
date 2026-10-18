import { api } from "./api"
import { Courier } from "../types/Courier";

const API_URL = "/courier";

export async function createCourier(courier: Courier) {
  const response = await api.post(API_URL, {
    name: courier.name,
    phone: courier.phone,
    status: courier.status,
  });

  return response.data;
}

export async function getAllCouriers() {
  const response = await api.get(API_URL);

  return response.data;
}

export async function updateCourier(
  id: number,
  courier: Courier
) {
  const response = await api.put(
    `${API_URL}/${id}`,
    {
      name: courier.name,
      phone: courier.phone,
      status: courier.status,
    }
  );

  return response.data;
}

export async function deleteCourier(id: number) {
  const response = await api.delete(
    `${API_URL}/${id}`
  );

  return response.data;
}