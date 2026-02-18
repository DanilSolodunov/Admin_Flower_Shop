export interface Order {
  id: string;
  products: { product: any; quantity: number }[];
  total: number;
  status: 'ожидает' | 'собирается' | 'отправлен' | 'доставлен' | 'отменен' | 'возвращен';
  date: string;
  paymentMethod: 'наличный расчет' | 'online' | null;
  courier: string | null;
  reason?: string; // Новое поле: причина закрытия
}