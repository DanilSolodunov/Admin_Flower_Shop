import { authApi } from "./authApi";

export type PeriodType =
  | "day"
  | "week"
  | "month"
  | "year"
  | "all";

export interface OrderResponse {
  id: number;
  date: string;
  total: number;
  address: string;
  image: string;
  paymentMethod: string;
  courier: {
    id: number;
    name: string;
    phone: string;
    status: string;
  } | null;
}

export interface RevenueResponse {
  totalRevenue: number;
  count: number;
  average: number;
  orders: OrderResponse[];
}

export const getRevenueReport = async (
  period: PeriodType
): Promise<RevenueResponse> => {
  const response = await authApi.get(
    "/orders/revenue",
    {
      params: {
        period,
      },
    }
  );

  return response.data;
};