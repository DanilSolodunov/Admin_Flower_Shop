import { useState } from 'react';
import { Order } from '../../types/Order';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Eye, XCircle } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  onCloseOrder: (order: Order) => void;
  onViewOrder: (order: Order) => void;
  showActions?: boolean; // Новый проп для управления видимостью колонки действий
}

export function OrderTable({ orders, onCloseOrder, onViewOrder, showActions = true }: OrderTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ожидает':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'собирается':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'отправлен':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'доставлен':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'отменен':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'возвращен':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  return (
  <div className="space-y-6">
    {showActions && (
      <div className="flex justify-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-56 bg-slate-800 border-slate-700 text-slate-200">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="ожидает">Ожидает</SelectItem>
            <SelectItem value="собирается">Собирается</SelectItem>
            <SelectItem value="отправлен">Отправлен</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )}

    <Table theme="dark">
      <TableHeader theme="dark">
        <TableRow theme="dark">
          <TableHead theme="dark">ID</TableHead>
          <TableHead theme="dark">Дата</TableHead>
          <TableHead theme="dark">Сумма</TableHead>
          <TableHead theme="dark">Статус</TableHead>
          <TableHead theme="dark">Курьер</TableHead>
          {showActions && (
            <TableHead theme="dark" className="text-right">
              Действия
            </TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredOrders.length === 0 ? (
          <TableRow theme="dark">
            <TableCell
              theme="dark"
              colSpan={showActions ? 6 : 5}
              className="text-center py-14 text-slate-400"
            >
              <div className="flex flex-col items-center gap-3">
                <XCircle className="w-12 h-12 opacity-40" />
                <p className="text-lg font-medium">Нет заказов</p>
                <p className="text-sm opacity-60">
                  В этой категории пока нет заказов
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          filteredOrders.map((order) => (
            <TableRow key={order.id} theme="dark">
              <TableCell theme="dark" className="font-medium">
                {order.id}
              </TableCell>

              <TableCell theme="dark" className="text-slate-400">
                {new Date(order.date).toLocaleDateString("ru-RU")}
              </TableCell>

              <TableCell theme="dark" className="font-semibold">
                {order.total.toLocaleString("ru-RU")} ₽
              </TableCell>

              <TableCell theme="dark">
                <Badge
                  className="bg-slate-700 text-white border border-slate-600 px-3 py-1 rounded-full"
                  variant="secondary"
                >
                  {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
                </Badge>
              </TableCell>

              <TableCell theme="dark" className="text-slate-400">
                {order.courier || "—"}
              </TableCell>

              {showActions && (
                <TableCell theme="dark" className="text-right">
                  <div className="flex justify-end gap-3">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3"
                      onClick={() => onViewOrder(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {["ожидает", "собирается", "отправлен"].includes(
                      order.status
                    ) && (
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3"
                        onClick={() => onCloseOrder(order)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);
}