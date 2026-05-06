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
import { Eye, XCircle } from 'lucide-react';
import { OrderDetails } from './OrderDetails';
import { Dialog, DialogContent } from '../ui/dialog';
import { Courier } from '../../types/Courier';

interface OrderTableProps {
  orders: Order[];
  onCloseOrder: (order: Order) => void;
  showActions?: boolean;
  couriers?: { courierId: number; name: string }[]
}

export function OrderTable({
  orders,
  onCloseOrder,
  showActions = true,
}: OrderTableProps) {

  const [statusFilter, setStatusFilter] = useState<string>('Все статусы');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'Все статусы') return true;
    return order.status === statusFilter;
  });

  return (
    <>
      <div className="space-y-6">

        {showActions && (
          <div className="flex justify-end">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-56 bg-slate-400 border-slate-400 text-slate-900">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent className="bg-slate-400 border-slate-400 text-slate-900">
                <SelectItem value="Все статусы">Все статусы</SelectItem>
                <SelectItem value="ожидает">Ожидает</SelectItem>
                <SelectItem value="собирается">Собирается</SelectItem>
                <SelectItem value="отправлен">Отправлен</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <XCircle className="w-12 h-12 opacity-40 mb-3" />
            <p className="text-lg font-medium">Нет заказов</p>
            <p className="text-sm opacity-60">В этой категории пока нет заказов</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-white">
                      Заказ #{order.id}
                    </h3>
                    <Badge className="bg-slate-700 text-white border border-slate-600 px-2 py-1 rounded-full text-xs">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400">
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </p>

                  <p className="text-lg font-bold text-white">
                    {order.total.toLocaleString('ru-RU')} ₽
                  </p>

                  <p className="text-xs text-slate-400">
                    Курьер:{' '}
                    <span className="text-slate-200">{order.courier?.name || '—'}</span>
                  </p>
                </div>

                {showActions && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Подробнее
                    </Button>

                    {['ожидает', 'собирается', 'отправлен'].includes(order.status) && (
                      <Button
                        size="sm"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        onClick={() => onCloseOrder(order)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Закрыть
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog с деталями заказа */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="w-full max-w-4xl">
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onAssignCourier={(courierId) => {
              }}
              onChangeStatus={(status) => {
                setSelectedOrder((prev) => prev ? { ...prev, status } : prev);
              }}
              onClose={() => setDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}