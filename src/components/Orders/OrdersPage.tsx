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

  const handleEdit = (order: Order) => {
    console.log('edit order', order);
  };

  const handleDelete = (id: number) => {
    console.log('delete order', id);
  };

  const handleCloseOrder = (order: Order) => {
    console.log('close order', order);
  };

  const handleViewOrder = (order: Order) => {
    console.log('view order', order);
  };

  return (
    <div className="space-y-4">
      <OrderFilters
        filter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <OrderTable
        orders={filteredOrders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCloseOrder={handleCloseOrder}
        onViewOrder={handleViewOrder}
      />
    </div>
  );
}