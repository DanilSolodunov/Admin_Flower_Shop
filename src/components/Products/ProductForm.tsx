import { useState } from 'react';
import { Product } from '../../types/Product';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Upload } from 'lucide-react';
import { validateProduct } from '../../utils/validators';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    imageurl: product?.imageurl || '',
    description: product?.description || '',
    price: product?.price || '',
    amount: product?.amount || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Состояние для диалогового окна изображения
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProduct({
      imageurl: formData.imageurl,
      description: formData.description,
      price: Number(formData.price),
      amount: Number(formData.amount),
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave({
      imageurl: formData.imageurl,
      description: formData.description,
      price: Number(formData.price),
      amount: Number(formData.amount),
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleOpenImageDialog = () => {
    setTempImageUrl(formData.imageurl);
    setIsImageDialogOpen(true);
  };

  const handleSaveImageUrl = () => {
    handleChange('imageurl', tempImageUrl);
    setIsImageDialogOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageurl">Изображение *</Label>
        <Button
          type="button"
          variant="outline"
          onClick={handleOpenImageDialog}
          className="w-full justify-start text-slate-900 border-dashed border-2 h-12 hover:bg-slate-50 hover:border-blue-400"
        >
          <Upload className="mr-2 h-4 w-4" />
          {formData.imageurl ? 'Изменить фото' : 'Добавить фото'}
        </Button>
        {formData.imageurl && (
          <div className="flex items-center gap-2 mt-2">
            <div className="h-16 w-16 rounded-md border  overflow-hidden ">
              <img
                src={formData.imageurl}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="text-xs text-slate-500 truncate flex-1">
              {formData.imageurl}
            </p>
          </div>
        )}
        {errors.imageurl && (
          <p className="text-sm text-red-500">{errors.imageurl}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Описание товара"
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Цена (₽) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="0"
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Количество *</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="1"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0"
            className={errors.amount ? 'border-red-500' : ''}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {product ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>

      {/* Диалоговое окно для ввода URL изображения */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ссылка на изображение</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrlInput">URL изображения</Label>
              <Input
                id="imageUrlInput"
                value={tempImageUrl}
                onChange={(e) => setTempImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                autoFocus
              />
              <p className="text-xs text-slate-500">
                Вставьте прямую ссылку на изображение (jpg, png, webp)
              </p>
            </div>
            {tempImageUrl && (
              <div className="flex justify-center p-4 border border-slate-200 rounded-md bg-slate-50">
                <img
                  src={tempImageUrl}
                  alt="Preview"
                  className="max-h-48 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.alt = 'Не удалось загрузить изображение';
                  }}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Отмена
            </Button>
            <Button type="button" onClick={handleSaveImageUrl} className="bg-blue-600 hover:bg-blue-700">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}