export const validateImage = (image: string): boolean => {
  if (!image || typeof image !== 'string') return false;
  
  // Проверяем base64 (Data URL)
  const base64Pattern = /^data:image\/(png|jpeg|jpg|webp);base64,/i;
  if (base64Pattern.test(image)) return true;
  
  // Проверяем HTTP(S) URL
  const imagePattern = /^https?:\/\/.+\.(png|jpg|jpeg|webp)$/i;
  return imagePattern.test(image.trim());
};

export const validatePrice = (price: number): boolean => {
  return typeof price === 'number' && price > 0;
};

export const validateAmount = (amount: number): boolean => {
  return typeof amount === 'number' && Number.isInteger(amount) && amount >= 0;
};

export const validateDescription = (description: string): boolean => {
  if (!description || typeof description !== 'string') return false;
  return description.trim().length > 0;
};

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateProduct = (product: {
  image: string;
  name: string;
  description: string;
  price: number;
  amount: number;
  category: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!validateImage(product.image || '')) {
    errors.image = 'не корректный формат изображения (png, jpg, jpeg, webp)';
  }

  if (!product.name || product.name.trim().length === 0) {
    errors.name = 'Название не может быть пустым';
  }

  if (!validateDescription(product.description || '')) {
    errors.description = 'Описание не может быть пустым';
  }

  if (!product.category || product.category.trim().length === 0) {
    errors.category = 'Категория не может быть пустой';
  }

  if (!validatePrice(product.price)) {
    errors.price = 'Цена должна быть больше 0';
  }

  if (!validateAmount(product.amount)) {
    errors.amount = 'Количество должно быть целым числом >= 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};