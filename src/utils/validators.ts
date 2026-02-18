export const validateImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const urlPattern = /^https?:\/\/.+\.(png|jpg|jpeg|webp)$/i;
  return urlPattern.test(url.trim());
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
  imageurl: string;
  description: string;
  price: number;
  amount: number;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!validateImageUrl(product.imageurl || '')) {
    errors.imageurl = 'Введите корректный URL изображения (png, jpg, jpeg, webp)';
  }

  if (!validateDescription(product.description || '')) {
    errors.description = 'Описание не может быть пустым';
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