export interface Order {
  id: number;
  products: { product: any; quantity: number }[];
  total: number;
  status: string;
  date: string;
  paymentMethod: 'наличный расчет' | 'online' | null;
  courier: number | null;
  reason?: string; // Новое поле: причина закрытия
}