// import { Order } from '../../types/Order';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/select';
// import { Label } from '../ui/label';

// export type OrdersViewType = 'new' | 'completed';

// interface OrderFiltersProps {
//   filter: string;
//   onFilterChange: (filter: string) => void;
// }

// const VIEW_STATUS_MAP: Record<OrdersViewType, Order['status'][]> = {
//   new: ['ожидает', 'собирается', 'отправлен'],
//   completed: ['доставлен', 'отменен', 'возвращен'],
// };

// export function filterOrders(
//   orders: Order[],
//   view: OrdersViewType,
//   statusFilter: string
// ): Order[] {
//   const viewFiltered = orders.filter(order =>
//     VIEW_STATUS_MAP[view].includes(order.status)
//   );

//   if (statusFilter === 'Все') {
//     return viewFiltered;
//   }

//   return viewFiltered.filter(order => order.status === statusFilter);
// }

// export function OrderFilters({ filter, onFilterChange }: OrderFiltersProps) {
//   return (
//     <div className="flex items-center gap-4">
//       <div className="space-y-1">
//         <Label htmlFor="status-filter">Фильтр по статусу</Label>
//         <Select value={filter} onValueChange={onFilterChange}>
//           <SelectTrigger id="status-filter" className="w-48">
//             <SelectValue placeholder="Все статусы" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Все">Все</SelectItem>
//             <SelectItem value="ожидает">Ожидает</SelectItem>
//             <SelectItem value="собирается">Собирается</SelectItem>
//             <SelectItem value="отправлен">Отправлен</SelectItem>
//             <SelectItem value="доставлен">Доставлен</SelectItem>
//             <SelectItem value="отменен">Отменен</SelectItem>
//             <SelectItem value="возвращен">Возвращен</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   );
// }