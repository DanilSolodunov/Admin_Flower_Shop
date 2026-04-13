import { api } from "./api";

export interface Address {
  id: number;
  city: string;
  street: string;
  houseNumber: string;
}

export interface AddressRequest {
  city: string;
  street: string;
  houseNumber: string;
}

export const addressApi = {
  // Получить адрес (сервер возвращает одну строку)
  getAddress: async (): Promise<string | null> => {
    const response = await api.get<string>("/settings/supplierAddress");
    return response.data || null;
  },

  // Добавить/обновить адрес
  setAddress: async (request: AddressRequest): Promise<void> => {
    await api.post("/settings/supplierAddress", request);
  },

  // Удалить адрес
  deleteAddress: async (): Promise<void> => {
    await api.delete("/settings/supplierAddress");
  },
};
