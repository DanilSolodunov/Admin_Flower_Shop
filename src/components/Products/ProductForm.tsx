import { useState, useRef } from 'react';
import { Product } from '../../types/Product';
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

export function ProductForm({
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    image: product?.image || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    amount: product?.amount?.toString() || '',
    category: product?.category || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const isNewProduct = !product;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNewProduct && !selectedImageFile) {
      setErrors({
        image: 'Выберите изображение',
      });
      return;
    }

    const validation = validateProduct({
      image: 'valid',
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
      const formDataToSend = new FormData();

      if (formData.name) {
        formDataToSend.append('name', formData.name);
      }

      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }

      if (formData.price) {
        formDataToSend.append('price', formData.price);
      }

      if (formData.amount) {
        formDataToSend.append('amount', formData.amount);
      }

      if (formData.category) {
        formDataToSend.append('category', formData.category);
      }

      if (selectedImageFile) {
        formDataToSend.append('file', selectedImageFile);
      }

      if (product) {
        await productApi.updateProduct(product.id, formDataToSend);
      } else {
        await productApi.addProduct(formDataToSend);
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

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6">

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* IMAGE */}
        <div className="space-y-3">
          <Label htmlFor="image">
            Изображение {isNewProduct ? '*' : ''}
          </Label>

          {errors.image && (
            <p className="text-red-500 text-sm">
              {errors.image}
            </p>
          )}

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
            className="w-full justify-start text-slate-900 border-dashed border-2 h-12"
          >
            <Upload className="mr-2 h-4 w-4" />
            {formData.image ? 'Изменить фото' : 'Добавить фото'}
          </Button>

          {formData.image && (
            <div className="h-20 w-20 rounded-md border overflow-hidden">
              <img
                src={formData.image}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* NAME */}
        <div className="space-y-3">
          <Label htmlFor="name">Название *</Label>

          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              handleChange('name', e.target.value)
            }
          />
        </div>

        {/* CATEGORY */}
        <div className="space-y-3">
          <Label htmlFor="category">Категория *</Label>

          <Select
            value={formData.category}
            onValueChange={(value) =>
              handleChange('category', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>

            <SelectContent>
              {FLOWER_CATEGORIES.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-3">
          <Label htmlFor="description">Описание *</Label>

          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              handleChange('description', e.target.value)
            }
            rows={3}
          />
        </div>

        {/* PRICE + AMOUNT */}
        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-3">
            <Label htmlFor="price">Цена</Label>

            <Input
              id="price"
              type="number"
              min={0}
              max={9000}
              value={formData.price}
              onChange={(e) =>
                handleChange('price', e.target.value)
              }
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="amount">Количество</Label>

            <Input
              id="amount"
              type="number"
              min={0}
              max={9000}
              value={formData.amount}
              onChange={(e) =>
                handleChange('amount', e.target.value)
              }
            />
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-4">

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
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting
              ? 'Сохранение...'
              : product
                ? 'Сохранить'
                : 'Добавить'}
          </Button>

        </div>
      </form>
    </div>
  );
}