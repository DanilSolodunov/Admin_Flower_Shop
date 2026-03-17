import { useState, useMemo } from 'react';
import { Order } from '../../types/Order';
import { OrderTable } from './OrderTable';
import { OrderFilters, filterOrders, OrdersViewType } from './OrderFilters';

interface OrdersPageProps {
  statusView: OrdersViewType;
}

export function OrdersPage({ statusView }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('Все');

  const filteredOrders = useMemo(() => {
    return filterOrders(orders, statusView, statusFilter);
  }, [orders, statusView, statusFilter]);

  const handleCloseOrder = (order: Order) => {
    console.log('close order', order);
  };

  return (
    <div className="space-y-4">
      <OrderFilters
        filter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <OrderTable
        orders={filteredOrders}
        onCloseOrder={handleCloseOrder}
      />
    </div>
  );
}