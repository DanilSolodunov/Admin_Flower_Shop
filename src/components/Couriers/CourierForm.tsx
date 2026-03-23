//../components/Couries/CourierForm
import { useState, useEffect } from 'react';
import { Courier } from '../../types/Courier';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface CourierFormProps {
  courier?: Courier;
  onSave: (courierData: Courier) => void;
  onCancel: () => void;
}

export function CourierForm({ courier, onSave, onCancel }: CourierFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Активный' | 'Неактивный'>('Активный');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (courier) {
      setName(courier.name);
      setPhone(courier.phone);
      setStatus(courier.status);
    }
  }, [courier]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^[\d\+\-\(\) ]+$/.test(phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }
    if (name.length > 20) {
      newErrors.name = 'Имя не должно превышать 20 символов';
    }
    if (phone.length > 15) {
      newErrors.phone = 'Телефон не должен превышать 15 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...(courier ? { id: courier.id } : {}),
        name,
        phone,
        status,
      } as Courier);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name">Имя курьера *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              if (e.target.value.length <= 20) setName(e.target.value);
            }}
            maxLength={20} // ограничение в HTML
            placeholder="Иванов Иван"
            className={errors.name ? 'border-red-300 focus-visible:ring-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="phone">Телефон *</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => {
              if (e.target.value.length <= 15) setPhone(e.target.value);
            }}
            maxLength={15} // ограничение в HTML
            placeholder="+7 (999) 123-45-67"
            className={errors.phone ? 'border-red-300 focus-visible:ring-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Статус</Label>
          <Select value={status} onValueChange={(value: 'Активный' | 'Неактивный') => setStatus(value)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Активный">Активен</SelectItem>
              <SelectItem value="Неактивный">Неактивен</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {courier ? 'Сохранить' : 'Добавить'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Отмена
        </Button>
      </div>
    </form>
  );
}