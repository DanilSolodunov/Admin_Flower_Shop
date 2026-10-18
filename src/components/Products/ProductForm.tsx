import { useState, useRef } from 'react';
import { Product } from '../../types/Product';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload } from 'lucide-react';
import { prepareImageForSave } from '../../utils/imageUtils';
import { productApi } from '../../api/productApi';
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
    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name || "Без названия");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("price", String(formData.price || 0));
      formDataToSend.append("amount", String(formData.amount || 0));
      formDataToSend.append("category", formData.category || "");

      if (selectedImageFile) {
        formDataToSend.append("file", selectedImageFile);
      }

      if (product) {
        await productApi.updateProduct(product.id, formDataToSend);
      } else {
        await productApi.addProduct(formDataToSend);
      }

      onSave();
    } catch (error) {
      setErrors({
        submit: "Не удалось сохранить товар. Проверьте консоль.",
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

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="price" className="block text-sm font-medium">
              Цена
            </Label>
            <Input
              id="price"
              type="number"
              min={0}
              max={9000}
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="amount" className="block text-sm font-medium">
              Количество
            </Label>
            <Input
              id="amount"
              type="number"
              min={0}
              max={9000}
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
            />
          </div>
        </div>

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