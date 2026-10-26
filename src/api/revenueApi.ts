import { api } from "./api";

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

export interface DebtorsResponse {
  debtor_id: number;
  debtor_name: string;
  debtor_amount: number;
}

export const getRevenueReport = async (
  period: PeriodType
): Promise<RevenueResponse> => {
  const response = await api.get(
    "/orders/revenue",
    {
      params: {
        period,
      },
    }
  );

  return response.data;
};

export const getDebtorsReport = async () => {
  const response =
  await api.get<DebtorsResponse[]>(
    `/orders/debtors`
  ); 
  return response.data;
};