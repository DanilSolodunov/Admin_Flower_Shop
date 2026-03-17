import { useState } from 'react';
import { Order } from '../../types/Order';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface CloseOrderFormProps {
  order: Order;
  onClose: (
    orderId: number,
    status: Order['status'],
    paymentMethod: 'наличный расчет' | 'online',
    courier: string | null,
    reason: string
  ) => void;
  onCancel: () => void;
}

const REASONS = [
  'Успешная доставка',
  'Отмена клиентом',
  'Нет в наличии',
  'Ошибка оформления',
  'Доставка невозможна',
];

const STATUSES: Order['status'][] = ['доставлен', 'отменен', 'возвращен'];

export function CloseOrderForm({ order, onClose, onCancel }: CloseOrderFormProps) {
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<Order['status']>('доставлен');
  const [paymentMethod, setPaymentMethod] =
    useState<'наличный расчет' | 'online'>('наличный расчет');
  const [courier, setCourier] = useState<string | null>(order.courier ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!reason) {
      newErrors.reason = 'Выберите причину закрытия';
    }
    if (!status) {
      newErrors.status = 'Выберите статус заказа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onClose(order.id, status, paymentMethod, courier, reason);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Причина закрытия */}
        <div className="space-y-2">
          <Label htmlFor="reason">Причина закрытия заказа *</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger id="reason" className={errors.reason ? 'border-red-500' : ''}>
              <SelectValue placeholder="Выберите причину" />
            </SelectTrigger>
            <SelectContent>
              {REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
        </div>

        {/* Статус заказа */}
        <div className="space-y-2">
          <Label htmlFor="status">Статус заказа *</Label>
          <Select value={status} onValueChange={(value: Order['status']) => setStatus(value)}>
            <SelectTrigger id="status" className={errors.status ? 'border-red-500' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
        </div>

        {/* Способ оплаты */}
        <div className="space-y-3">
          <Label>Способ оплаты *</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) =>
              setPaymentMethod(value as 'наличный расчет' | 'online')
            }
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
              <RadioGroupItem value='наличный расчет'>Наличный расчет</RadioGroupItem>
              <Label htmlFor="cash" className="flex-1 cursor-pointer font-normal">
                Наличный расчет
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
              <RadioGroupItem value="online"> online </RadioGroupItem>
              <Label htmlFor="online" className="flex-1 cursor-pointer font-normal">
                Онлайн оплата
              </Label>
            </div>
          </RadioGroup>
          {errors.paymentMethod && <p className="text-sm text-red-500">{errors.paymentMethod}</p>}
        </div>

        {/* Курьер (оставляем для удобства) */}
        <div className="space-y-2">
          <Label htmlFor="courier">Курьер</Label>
          <Select value={courier ?? ''} onValueChange={(val) => setCourier(val || null)}>
            <SelectTrigger id="courier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Курьер 1">Курьер 1</SelectItem>
              <SelectItem value="Курьер 2">Курьер 2</SelectItem>
              <SelectItem value="Курьер 3">Курьер 3</SelectItem>
              <SelectItem value="">Не назначен</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Подтвердить закрытие
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Отмена
        </Button>
      </div>
    </form>
  );
}