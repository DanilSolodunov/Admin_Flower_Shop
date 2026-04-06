export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputType?: 'image/jpeg' | 'image/png' | 'image/webp';
}

const DEFAULT_OPTIONS: Required<CompressImageOptions> = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.7,
  outputType: 'image/jpeg',
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
};

export const validateImageFile = (
  file: File,
  maxSizeMB: number = 10
): { isValid: boolean; error?: string } => {
  if (!isImageFile(file)) {
    return {
      isValid: false,
      error: 'Можно выбрать только изображение',
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Изображение слишком большое. Максимум ${maxSizeMB} МБ`,
    };
  }

  return { isValid: true };
};

export const fileToData = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Не удалось прочитать файл'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };

    reader.readAsDataURL(file);
  });
};

export const loadImage = (data: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      reject(new Error('Не удалось загрузить изображение'));
    };

    image.src = data;
  });
};

export const compressImage = async (
  file: File,
  options: CompressImageOptions = {}
): Promise<string> => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  const data = await fileToData(file);
  const image = await loadImage(data);

  let width = image.width;
  let height = image.height;

  if (width > height) {
    if (width > config.maxWidth) {
      height = Math.round((height * config.maxWidth) / width);
      width = config.maxWidth;
    }
  } else {
    if (height > config.maxHeight) {
      width = Math.round((width * config.maxHeight) / height);
      height = config.maxHeight;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Не удалось создать canvas');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL(config.outputType, config.quality);
};

export const estimateBase64Size = (base64: string): number => {
  const cleaned = base64.split(',')[1] || '';
  return Math.round((cleaned.length * 3) / 4);
};

export const prepareImageForSave = async (
  file: File
): Promise<{
  [x: string]: string;
  image: string;
  originalSize: string;
  compressedSize: string;
}> => {
  const validation = validateImageFile(file);

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const compressed = await compressImage(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.7,
    outputType: 'image/jpeg',
  });

  const originalSize = formatFileSize(file.size);
  const compressedSize = formatFileSize(estimateBase64Size(compressed));

  return {
    image: compressed,
    originalSize,
    compressedSize,
  };
};