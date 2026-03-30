import { useState } from 'react';
import { Courier } from '../../types/Courier';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { User, Phone, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../ui/dialog'; // убедитесь, что путь корректный

interface CourierListProps {
  couriers: Courier[];
  onEdit: (courier: Courier) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export function CourierList({ couriers, onEdit, onDelete, onAdd }: CourierListProps) {
  const [deleteCourierId, setDeleteCourierId] = useState<number | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteCourierId !== null) {
      onDelete(deleteCourierId);
      setDeleteCourierId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Список курьеров</h2>
          <p className="text-sm text-slate-200">Управление персоналом доставки</p>
        </div>
        <Button size="sm" onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
          Добавить курьера
        </Button>
      </div>

      {/* Empty state */}
      {couriers.length === 0 ? (
        <div className="bg-gray-800 rounded-xl border border-gray-900 py-12">
          <div className="flex flex-col items-center gap-2 text-slate-200">
            <User className="w-12 h-12 text-slate-300" />
            <p className="text-lg font-medium">Нет курьеров</p>
            <p className="text-sm">Добавьте первого курьера в систему</p>
          </div>
        </div>
      ) : (
        /* Grid карточек */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {couriers.map((courier) => (
            <div
              key={courier.id}
              className="bg-gray-800 border border-gray-900 rounded-xl p-4 flex flex-col justify-between shadow-sm"
            >
              {/* Верх карточки */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{courier.name}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                    <Phone className="w-4 h-4" />
                    <span className="truncate">{courier.phone}</span>
                  </div>
                </div>
              </div>

              {/* Статус */}
              <div className="mt-4">
                <Badge
                  className={
                    courier.status === 'Активный'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }
                  variant="secondary"
                >
                  {courier.status === 'Активный' ? 'Активен' : 'Неактивен'}
                </Badge>
              </div>

              {/* Действия */}
              <div className="flex justify-end gap-2 mt-4">
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
                  className="text-slate-200 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteCourierId(courier.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Диалог удаления */}
      <Dialog open={deleteCourierId !== null} onOpenChange={() => setDeleteCourierId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этого курьера? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCourierId(null)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}