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
      console.log(validation.errors);
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
    <div className="w-full max-w-md mx-auto px-4 sm:px-6">

      
       <form
  onSubmit={(e) => {
    e.preventDefault();

    onSave({
      imageurl: formData.imageurl,
      description: formData.description || "",
      price: Number(formData.price),
      amount: Number(formData.amount),
    });
  }}
>
        ...
        <Button type="submit">
          {product ? 'Сохранить' : 'Добавить'}
        </Button>


        {/* Изображение */}
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
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-md border overflow-hidden">
                <img
                  src={formData.imageurl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Описание */}
        <div className="space-y-2">
          <Label htmlFor="description">Описание *</Label>

          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
          />
        </div>

        {/* Цена и количество */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              type="number"
              max={9000}
              min={0}
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Количество</Label>
            <Input
              id="amount"
              type="number"
              max={9000}
              min={0}
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
            />
          </div>

        </div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Отмена
          </Button>

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {product ? 'Сохранить' : 'Добавить'}
          </Button>

        </div>

      </form>

      {/* DIALOG ВНЕ ФОРМЫ */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>

        <DialogContent className="w-full sm:max-w-md">

          <DialogHeader>
            <DialogTitle>Ссылка на изображение</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">

            <Label>URL изображения</Label>

            <Input
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
            />

          </div>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImageDialogOpen(false)}
            >
              Отмена
            </Button>

            <Button
              type="button"
              onClick={handleSaveImageUrl}
            >
              Сохранить
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}