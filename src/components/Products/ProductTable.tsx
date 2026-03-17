import { useState } from 'react';
import { Product } from '../../types/Product';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleDeleteConfirm = () => {
    if (deleteProductId) {
      onDelete(deleteProductId);
      setDeleteProductId(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteProductId(id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-slate-200 p-6">
      {currentProducts.length === 0 ? (
        <div className="text-center text-white py-12">
          Товары не найдены
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-800 transition-colors border border-slate-700"
            >
              {/* Изображение */}
              <div className="h-40 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center mb-4">
                {product.imageurl ? (
                  <img
                    src={product.imageurl}
                    alt={product.description}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('flex');
                    }}
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-slate-900" />
                )}
              </div>

              {/* Описание */}
              <div className="mb-2 h-[40px]">
                <div className="text-sm text-slate-200 font-medium line-clamp-2 break-all">
                  {product.description}
                </div>
              </div>

              {/* Цена */}
              <div className="text-lg text-white font-semibold mb-2">
                {formatPrice(product.price)}
              </div>

              {/* Количество */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.amount > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}
                >
                  {product.amount} шт.
                </span>
              </div>

              {/* Действия */}
              <div className="flex justify-end gap-2 mt-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(product.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="bg-white mt-6 px-6 py-4 border-t border-slate-200 flex items-center justify-between rounded-lg">
          <div className="text-sm text-slate-700">
            Показано с <span className="font-medium">{startIndex + 1}</span> по{' '}
            <span className="font-medium">
              {Math.min(endIndex, products.length)}
            </span>{' '}
            из <span className="font-medium">{products.length}</span> товаров
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
            >
              Назад
            </Button>

            <span className="text-sm text-slate-700 px-2">
              Страница {currentPage} из {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}

      {/* Диалог удаления */}
      <Dialog
        open={deleteProductId !== null}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProductId(null)}>
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