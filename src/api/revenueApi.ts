import { authApi } from "./authApi";

export type PeriodType =
  | "day"
  | "week"
  | "month"
  | "year"
  | "all";

export interface RevenueResponse {
  totalRevenue: number;
  count: number;
  average: number;
  period: string;
  data: string;
  payment: string;
  courier: string;
  total: number;
}

export const getRevenueReport = async (
  period: PeriodType
): Promise<RevenueResponse[]> => {
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