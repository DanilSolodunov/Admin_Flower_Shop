import { useState, useMemo } from 'react';
import { Order } from '../../types/Order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
//import { Table } from '../ui/table';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Calendar, DollarSign, ShoppingCart, TrendingUp, Infinity } from 'lucide-react';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format
} from 'date-fns';
import { ru } from 'date-fns/locale';

type PeriodType = 'day' | 'week' | 'month' | 'year' | 'all';

interface RevenueReportProps {
  orders: Order[];
}

export function RevenueReport({ orders }: RevenueReportProps) {
  // Изменено начальное значение на 'day'
  const [period, setPeriod] = useState<PeriodType>('day');

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Вычисляем диапазон дат на основе выбранного периода
  const dateRange = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case 'day':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 }); // Неделя начинается с понедельника
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'all':
        start = new Date(0); // Начало эпохи Unix
        end = new Date(); // Текущее время
        break;
      default:
        start = startOfDay(now);
        end = endOfDay(now);
    }

    return { start, end };
  }, [period]);

  // Форматирование диапазона дат для отображения
  const dateRangeDisplay = useMemo(() => {
    if (period === 'all') {
      return 'За все время';
    }

    const { start, end } = dateRange;

    // Если даты совпадают (день)
    if (start.getTime() === end.getTime() || period === 'day') {
      return format(start, 'd MMMM yyyy', { locale: ru });
    }

    // Если год
    if (period === 'year') {
      return format(start, 'yyyy', { locale: ru });
    }

    // Иначе диапазон
    return `${format(start, 'd MMMM', { locale: ru })} — ${format(end, 'd MMMM yyyy', { locale: ru })}`;
  }, [dateRange, period]);

  // Логика фильтрации и подсчета
  const reportData = useMemo(() => {
    // Фильтруем только завершенные заказы
    const completedOrders = orders.filter(order => order.status === 'доставлен');

    // Фильтруем по вычисленному диапазону дат
    const filteredOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= dateRange.start && orderDate <= dateRange.end;
    });

    // Подсчет метрик
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = filteredOrders.length;
    const avgCheck = orderCount > 0 ? totalRevenue / orderCount : 0;

    return {
      totalRevenue,
      orderCount,
      avgCheck,
      filteredOrders,
    };
  }, [orders, dateRange]);

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
          <div className="flex flex-col gap-6">
            <RadioGroup
  value={period}
  onChange={(value) => setPeriod(value as PeriodType)}
>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    <RadioGroupItem value="day">День</RadioGroupItem>
    <RadioGroupItem value="week">Неделя</RadioGroupItem>
    <RadioGroupItem value="month">Месяц</RadioGroupItem>
    <RadioGroupItem value="year">Год</RadioGroupItem>
    <RadioGroupItem value="all">Все время</RadioGroupItem>
  </div>
</RadioGroup>

          </div>
        </CardContent>


      </Card>

      {/* Метрики */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Общая выручка */}
        {/* <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-white"> */}
        <Card className="bg-gradient-to-br from-blue-800/40 to-slate-900 border border-blue-800/40">

          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Общая выручка
            </CardTitle>
            {/* <DollarSign className="h-4 w-4 text-blue-600" /> */}
            <DollarSign className="h-4 w-4 text-blue-400" />

          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(reportData.totalRevenue)}
            </div>
            <p className="text-xs text-slate-200 mt-1">
              За выбранный период
            </p>
          </CardContent>
        </Card>

        {/* Количество заказов */}
        {/* <Card className="border-slate-50 bg-gradient-to-br from-emerald-50 to-orders"> */}
        <Card className="bg-gradient-to-br from-emerald-800/40 to-slate-900 border border-emerald-800/40">

          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Завершено заказов
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {reportData.orderCount}
            </div>
            <p className="text-xs text-slate-200 mt-1">
              Статус: "Доставлен"
            </p>
          </CardContent>
        </Card>

        {/* Средний чек */}
        {/* <Card className="border-slate-200 bg-gradient-to-br from-violet-50 to-white"> */}
        <Card className="bg-gradient-to-br from-violet-800/40 to-slate-900 border border-violet-800/40">

          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Средний чек
            </CardTitle>
            {/* <TrendingUp className="h-4 w-4 text-violet-600" /> */}
            <TrendingUp className="h-4 w-4 text-violet-400" />

          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(reportData.avgCheck)}
            </div>
            <p className="text-xs text-slate-200 mt-1">
              На один заказ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Детализация */}
      {reportData.filteredOrders.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Детализация заказов</CardTitle>
            <CardDescription>
              {period === 'all'
                ? `Полный список завершенных заказов (${reportData.filteredOrders.length})`
                : `Список заказов за период: ${dateRangeDisplay} (${reportData.filteredOrders.length})`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">ID Заказа</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Дата</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Способ оплаты</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Курьер</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">{order.id}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {format(new Date(order.date), 'd MMM yyyy', { locale: ru })}
                      </td>
                      <td className="py-3 px-4 text-slate-600 capitalize">{order.paymentMethod}</td>
                      <td className="py-3 px-4 text-slate-600">{order.courier || '-'}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {reportData.filteredOrders.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="py-12 text-center">
            <p className="text-slate-300">
              Нет завершенных заказов за выбранный период
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}