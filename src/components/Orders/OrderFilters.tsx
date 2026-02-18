//../components/Orders
import { Table } from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface OrderFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export function OrderFilters({ filter, onFilterChange }: OrderFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="space-y-1">
        <Table htmlFor="status-filter">Фильтр по статусу</Table>
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger id="status-filter" className="w-48">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="ожидает">Ожидает</SelectItem>
            <SelectItem value="собирается">Собирается</SelectItem>
            <SelectItem value="отправлен">Отправлен</SelectItem>
            <SelectItem value="доставлен">Доставлен</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}