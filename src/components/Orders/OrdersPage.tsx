import { useState, useMemo } from 'react';
import { OrderTable } from './OrderTable';
import { Order } from '../../types/Order';

interface OrdersPageProps {
  status: 'new' | 'completed';
}

export function OrdersPage({ status }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => order.status === status);
  }, [orders, status]);

  const handleEdit = (order: Order) => {
    console.log('edit order', order);
  };

  const handleDelete = (id: number) => {
    console.log('delete order', id);
  };

  return (
    <OrderTable
      orders={filteredOrders}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
