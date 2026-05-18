import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { OrderDetails } from "../Orders/OrderDetails";
import { Order } from "../../types/Order";
import {
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import {
  getRevenueReport,
  RevenueResponse,
  PeriodType,
} from "../../api/revenueApi";

export function RevenueReport() {
  const [period, setPeriod] = useState<PeriodType>("day");
  const [reportData, setReportData] =
    useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const loadRevenueData = async () => {
    try {
      setLoading(true);

      const data = await getRevenueReport(period);

      setReportData(data);
    } catch (error) {
      console.error("Ошибка загрузки отчета:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenueData();
  }, [period]);


  const totalRevenue =
    reportData?.totalRevenue || 0;

  const orderCount =
    reportData?.count || 0;

  const averageCheck =
    reportData?.average || 0;

    const [selectedOrder, setSelectedOrder] =
  useState<Order | null>(null);

  return (
    <div className="space-y-6">
      {/* Выбор периода */}
      <Card className="border-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-900" />
            Период отчета
          </CardTitle>
          <CardDescription>
            Выберите период для формирования отчета о выручке
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={period}
            onValueChange={(value) => setPeriod(value as PeriodType)}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <RadioGroupItem value="day">День</RadioGroupItem>
              <RadioGroupItem value="week">Неделя</RadioGroupItem>
              <RadioGroupItem value="month">Месяц</RadioGroupItem>
              <RadioGroupItem value="year">Год</RadioGroupItem>
              <RadioGroupItem value="all">Все время</RadioGroupItem>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Метрики */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Общая выручка */}
        <Card className="bg-gradient-to-br from-blue-800/40 to-slate-900 border border-blue-800/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Общая выручка
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? "Загрузка..." : formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-slate-200 mt-1">
              За выбранный период
            </p>
          </CardContent>
        </Card>

        {/* Количество заказов */}
        <Card className="bg-gradient-to-br from-emerald-800/40 to-slate-900 border border-emerald-800/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Завершено заказов
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-emerald-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : orderCount}
            </div>
            <p className="text-xs text-slate-200 mt-1">
              Статус: "Доставлен"
            </p>
          </CardContent>
        </Card>

        {/* Средний чек */}
        <Card className="bg-gradient-to-br from-violet-800/40 to-slate-900 border border-violet-800/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Средний чек
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-violet-400" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : formatCurrency(averageCheck)}
            </div>
            <p className="text-xs text-slate-200 mt-1">
              На один заказ
            </p>
          </CardContent>
        </Card>

        {/* Детализация заказов */}
        <Card className="bg-slate-950 border border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">
              Детализация заказов
            </CardTitle>

            <CardDescription className="text-slate-400">
              Список заказов за период: {period} ({reportData?.orders?.length || 0})
            </CardDescription>
          </CardHeader>

          <CardContent>
            {reportData?.orders?.length ? (
              <div className="space-y-4">

                {/* Заголовок */}
                <div className="grid grid-cols-4 gap-4 border-b border-slate-700 pb-2 text-sm font-medium text-slate-300">
                  <div>Дата</div>
                  <div>Способ оплаты</div>
                  <div>Курьер</div>
                  <div>Сумма</div>
                </div>

                {/* Строки */}
                {reportData.orders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-4 gap-4 border-b border-slate-800 pb-3 text-sm text-white"
                  >
                    <div>
                      {new Date(order.date).toLocaleDateString("ru-RU")}
                    </div>

                    <div>
                      {order.paymentMethod || "-"}
                    </div>

                    <div>
                      {order.courier?.name || "-"}
                    </div>

                    <div>
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400">
                Заказы не найдены
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}