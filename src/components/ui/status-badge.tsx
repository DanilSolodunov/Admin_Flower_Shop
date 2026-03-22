import React from 'react';
import clsx from 'clsx';
import { Order } from '../../types/Order';

type UIOrderStatus = Order['status'] | 'не выбран';

interface StatusBadgeProps {
  status: UIOrderStatus;
  className?: string;
}

const statusStyles: Record<UIOrderStatus, string> = {
  ожидает: 'bg-yellow-300 text-yellow-800 border-yellow-200',
  собирается: 'bg-blue-300 text-blue-800 border-blue-200',
  отправлен: 'bg-purple-300 text-purple-800 border-purple-200',
  доставлен: 'bg-green-300 text-green-800 border-green-200',
  возвращен: 'bg-orange-300 text-orange-800 border-orange-200',
  отменен: 'bg-red-300 text-red-800 border-red-200',
  'не выбран': 'bg-gray-200 text-gray-500 border-gray-200',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  return (
    <span
      className={clsx(
        'inline-block px-3 py-1 rounded-full text-sm font-medium border',
        statusStyles[status],
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};