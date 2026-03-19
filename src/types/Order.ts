import { Product } from "./Product";

export interface Order {
  id: number;
  products: Product[];
  total: number;
  status: string;
  date: string;
  paymentMethod: 'наличный расчет' | 'online' | null;
  courier: string | null;
  reason?: string; 
  address: string;
}