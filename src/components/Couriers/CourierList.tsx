//../components/Couries/CourierList
import { Courier } from '../../types/Courier';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { User, Phone, Trash2, Edit } from 'lucide-react';

interface CourierListProps {
  couriers: Courier[];
  onEdit: (courier: Courier) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export function CourierList({ couriers, onEdit, onDelete, onAdd }: CourierListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Список курьеров</h2>
          <p className="text-sm text-slate-200">Управление персоналом доставки</p>
        </div>
        <Button 
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Добавить курьера
        </Button>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-slate-50 border-b border-gray-900">
              <TableHead className="font-semibold text-white">Имя</TableHead>
              <TableHead className="font-semibold text-white">Телефон</TableHead>
              <TableHead className="font-semibold text-white">Статус</TableHead>
              <TableHead className="text-right font-semibold text-white">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couriers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-200 py-12">
                  <div className="flex flex-col items-center gap-2">
                    <User className="w-12 h-12 text-slate-300" />
                    <p className="text-lg font-medium">Нет курьеров</p>
                    <p className="text-sm">Добавьте первого курьера в систему</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              couriers.map((courier) => (
                <TableRow key={courier.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="w-4 h-4" />
                      </div>
                      {courier.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {courier.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={courier.status === 'Активный' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                      } 
                      variant="secondary"
                    >
                      {courier.status === 'Активный' ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-200 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => onEdit(courier)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(courier.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}