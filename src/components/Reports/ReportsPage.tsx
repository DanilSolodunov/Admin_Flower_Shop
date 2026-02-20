import { useState } from 'react';
import { RevenueReport } from './RevenueReport';

export function ReportsPage() {
  const [orders, setOrders] = useState([]);

  return (
    <RevenueReport
      orders={orders}
    />
  );
}
