import { api } from "./api";
import { Order } from "../types/Order";

export interface OrderResponse {
  id: number;
  date: string;
  status: string;
  total: number;
  courier: string | null;
  paymentMethod: string | null;
  address: string;
  reason?: string;
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
    
    const response = await api.get<OrderResponse[]>("/orders");
    console.log('С сервера получены заказы:', response.data);
    
    // Преобразуем OrderResponse[] в Order[]
    return response.data.map(order => ({
      id: order.id,
      date: order.date,
      status: order.status,
      total: order.total,
      courier: order.courier,
      paymentMethod: order.paymentMethod as any,
      address: order.address,
      reason: order.reason,
      products: order.items.map(item => ({
        id: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        amount: 0,
        image: item.image && !item.image.startsWith('http') 
          ? `http://localhost:8080${item.image}` 
          : item.image,
      })),
    }));
  },
};
