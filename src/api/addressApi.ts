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
  // Получить адрес поставщика
  getAddress: async (): Promise<string | null> => {
    const response = await api.get<string | null>(
      "/settings/supplierAddress"
    );

    return response.data || null;
  },

  // Добавить или изменить адрес поставщика
  setAddress: async (
    request: AddressRequest
  ): Promise<void> => {
    await api.post(
      "/settings/supplierAddress",
      request
    );
  },

  // Удалить адрес поставщика
  deleteAddress: async (): Promise<void> => {
    await api.delete("/settings/supplierAddress");
  },
};
