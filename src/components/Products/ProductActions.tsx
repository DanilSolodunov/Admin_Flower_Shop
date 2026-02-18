import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface ProductActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductActions({ onEdit, onDelete }: ProductActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}