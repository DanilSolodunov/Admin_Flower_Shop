import { authApi } from "./authApi";
import { Order } from "../types/Order";
import { Courier } from "../types/Courier";

export interface OrderResponse {
  id: number;
  date: string;
  status: string;
  total: number;
  address: string;
  courier: Courier | null;
  items: {
    productId: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export interface UpdateOrderRequest {
  id: number;
  status: string;
  courier?: Courier | null;
  paymentMethod?: string;
  reason?: string;
}

export const orderApi = {
  getAllOrders: async (): Promise<Order[]> => {
    const token = localStorage.getItem("accessToken");

    console.log(
      "Токен для запроса:",
      token ? "Есть" : "Нет"
    );

    const response =
      await authApi.get<OrderResponse[]>("/orders");

    console.log(
      "С сервера получены заказы:",
      response.data
    );

    return response.data.map((order) => ({
      id: order.id,
      date: order.date,
      status: order.status,
      total: order.total,
      courier: order.courier ?? null,
      paymentMethod: null,
      address: order.address,
      reason: undefined,

      products: order.items.map((item) => ({
        id: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        amount: item.quantity,
        image:
          item.image &&
          !item.image.startsWith("http")
            ? `http://localhost:8080${item.image}`
            : item.image,
      })),
    }));
  },

  updateOrder: async ({
    id,
    status,
    courier,
    paymentMethod,
    reason,
  }: UpdateOrderRequest): Promise<Order> => {
    const requestBody = {
      status,
      courier,
      paymentMethod,
      reason,
    };

    console.log("Отправляем запрос:", {
      url: `/orders/supplier/${id}`,
      body: requestBody,
    });

    try {
      const response = await authApi.put(
        `/orders/supplier/${id}`,
        requestBody
      );

      console.log(
        "Заказ успешно обновлён:",
        response.data
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Ошибка обновления заказа:",
        error?.response?.data || error.message
      );

      throw new Error(
        error?.response?.data?.message ||
          "Ошибка при обновлении заказа"
      );
    }
  },

  closeOrder: async (
    request: UpdateOrderRequest
  ): Promise<Order> => {
    return orderApi.updateOrder(request);
  },
};