import { useState, useEffect } from 'react';
import { Product } from '../../types/Product';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { productApi } from '../../api/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка товаров при монтировании компонента
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке товаров:', err);
      setError('Не удалось загрузить товары. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    console.log('edit', product);
    // TODO: реализовать редактирование
  };

  const handleDelete = async (id: number) => {
    try {
      // TODO: реализовать удаление на сервере
      console.log('delete', id);
      // После удаления обновляем список
      await loadProducts();
    } catch (err) {
      console.error('Ошибка при удалении товара:', err);
    }
  };

  const handleSaveProduct = async () => {
    // После успешного сохранения обновляем список товаров
    setIsFormOpen(false);
    await loadProducts();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-200">Загрузка товаров...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-200">Товары</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadProducts}
            className="mt-2"
          >
            Повторить
          </Button>
        </div>
      )}

      {/* Таблица товаров */}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Диалог добавления/редактирования товара */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить новый товар</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSave={handleSaveProduct}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
