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
      {/* Фильтр показываем только если есть заказы и это не "Завершенные заказы" (опционально, но оставим для гибкости) */}
      {showActions && (
        <div className="flex justify-end">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="ожидает">Ожидает</SelectItem>
              <SelectItem value="собирается">Собирается</SelectItem>
              <SelectItem value="отправлен">Отправлен</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="font-semibold text-slate-700">ID</TableHead>
              <TableHead className="font-semibold text-slate-700">Дата</TableHead>
              <TableHead className="font-semibold text-slate-700">Сумма</TableHead>
              <TableHead className="font-semibold text-slate-700">Статус</TableHead>
              <TableHead className="font-semibold text-slate-700">Курьер</TableHead>
              {showActions && (
                <TableHead className="text-right font-semibold text-slate-700">Действия</TableHead>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 6 : 5} className="text-center text-slate-500 py-12">
                  <div className="flex flex-col items-center gap-2">
                    <XCircle className="w-12 h-12 text-slate-300" />
                    <p className="text-lg font-medium">Нет заказов</p>
                    <p className="text-sm">В этой категории пока нет заказов</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                  <TableCell className="font-medium text-slate-900">{order.id}</TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {order.total.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)} variant="secondary">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {order.courier || '—'}
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => onViewOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {['ожидает', 'собирается', 'отправлен'].includes(order.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-600 hover:text-green-600 hover:bg-green-50"
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
    </div>
  );
}