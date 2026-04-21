import { api } from "./api";
import { Order } from "../types/Order";

export interface OrderResponse {
  id: number;
  date: string;
  status: string;
  total: number;
  address: string;
  items: {
    productId: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export const orderApi = {
  // Получить все заказы текущего пользователя
  getAllOrders: async (): Promise<Order[]> => {
    const token = localStorage.getItem("accessToken");
    console.log('Токен для запроса:', token ? 'Есть' : 'Нет');

    const response = await api.get<OrderResponse[]>("/orders/supplier");
    console.log('С сервера получены заказы:', response.data);

    // Преобразуем OrderResponse[] в Order[]
    return response.data.map(order => ({
      id: order.id,
      date: order.date,
      status: order.status,
      total: order.total,
      courier: null,
      paymentMethod: null,
      address: order.address,
      reason: undefined,
      products: order.items.map(item => ({
        id: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        amount: item.quantity,
        image: item.image && !item.image.startsWith('http')
          ? `http://localhost:8080${item.image}`
          : item.image,
      })),
    }));
  },
};
