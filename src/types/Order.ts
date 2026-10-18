import { Product } from "./Product";

export interface Order {
  id: number;
  products: Product[];
  total: number;
  status: string;
  date: string;
  paymentMethod: string;

  courier: {
    id: number;
    name: string;
    phone?: string;
    role?: string;
    status?: string;
  } | null;

  // courierId: number | null;
  address: string;
  reason?: string;
}