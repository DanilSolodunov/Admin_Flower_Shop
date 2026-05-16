import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
  const [reportData, setReportData] = useState<RevenueResponse[]>([]);
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
    reportData.length > 0 ? reportData[0].totalRevenue : 0;

  const orderCount =
    reportData.length > 0 ? reportData[0].count : 0;

  const averageCheck =
    reportData.length > 0 ? reportData[0].average : 0;

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
      </div>
    </div>
  );
}