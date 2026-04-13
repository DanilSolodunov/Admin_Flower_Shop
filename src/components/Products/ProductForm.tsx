import { useState, useRef } from 'react';
import { Product, AddToCartRequest } from '../../types/Product';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload } from 'lucide-react';
import { validateProduct } from '../../utils/validators';
import { prepareImageForSave } from '../../utils/imageUtils';
import { productApi } from '../../api/api';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';

import { FLOWER_CATEGORIES } from '../../constants/flowerCategories';

interface ProductFormProps {
  product?: Product;
  onSave: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    image: product?.image || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    amount: product?.amount || '',
    category: product?.category || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [tempImage, setTempImage] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Сначала проверяем, что файл выбран
    if (!selectedImageFile) {
      setErrors({ image: 'Выберите изображение' });
      return;
    }

    // Валидируем только текстовые поля (изображение уже проверено выше)
    const validation = validateProduct({
      image: 'valid', // Пропускаем валидацию изображения — файл уже выбран
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      amount: Number(formData.amount),
      category: formData.category,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const request: AddToCartRequest = {
        image: '',
        name: formData.name || '',
        description: formData.description,
        price: Number(formData.price),
        amount: Number(formData.amount),
        category: formData.category || '',
      };

      if (product) {
        await productApi.updateProduct(product.id, request);
      } else {
        await productApi.addProduct(request, selectedImageFile);
      }

      onSave();
    } catch (error) {
      console.error(error);
      setErrors({
        submit: 'Не удалось сохранить товар',
      });
    } finally {
      setIsSubmitting(false);
    }
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
    setTempImage(formData.image);
    setIsImageDialogOpen(true);
  };

  const handleSaveImage = () => {
    handleChange('image', tempImage);
    setIsImageDialogOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6">

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="space-y-3">
          <Label htmlFor="image">Изображение *</Label>
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

          <input
            id="image"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={fileInputRef}
            onChange={async (e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              setSelectedImageFile(file);

              try {
                const result = await prepareImageForSave(file);
                handleChange('image', result.image);
              } catch (error) {
                console.error(error);

                alert(
                  error instanceof Error
                    ? error.message
                    : 'Не удалось обработать изображение'
                );
              }
            }}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full justify-start text-slate-900 border-dashed border-2 h-12 hover:bg-slate-50 hover:border-blue-400"
          >
            <Upload className="mr-2 h-4 w-4" />
            {formData.image ? 'Изменить фото' : 'Добавить фото'}
          </Button>

          {formData.image && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-md border overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Название товара */}
        <div className="space-y-3">
          <Label htmlFor="name">Название *</Label>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Введите название товара"
          />
        </div>

        {/* Описание */}
        <div className="space-y-3">
          <Label htmlFor="description">Описание *</Label>
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
          />
        </div>

        {/* Категория */}
        <div className="space-y-3">
          <Label htmlFor="category">Категория *</Label>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

          <Select
            value={formData.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger
              id="category"
              className="w-full justify-between border border-input bg-background"
            >
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>

            <SelectContent className="w-full left-0 right-0">
              {FLOWER_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Цена и количество */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="flex flex-col space-y-3">
            <Label htmlFor="price">Цена</Label>
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            <Input
              id="price"
              type="number"
              max={9000}
              min={0}
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-3">
            <Label htmlFor="amount">Количество</Label>
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
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
            disabled={isSubmitting}
          >
            Отмена
          </Button>

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : (product ? 'Сохранить' : 'Добавить')}
          </Button>

        </div>

      </form>
    </div>
  );
}