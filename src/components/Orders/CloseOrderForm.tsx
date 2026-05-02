import { useState, useEffect } from 'react';
import { Order } from '../../types/Order';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { StatusBadge } from '../ui/status-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface Courier {
  id: number;
  name: string;
  phone?: string;
  transport?: string;
}

interface CloseOrderFormProps {
  order: Order;
  onClose: (
    orderId: number,
    status: Order['status'],
    paymentMethod: 'Наличный' | 'online',
    courier: string | null,
    reason: string
  ) => void;
  onCancel: () => void;
}

type UIOrderStatus = Order['status'] | 'не выбран';

const REASONS = [
  'Успешная доставка',
  'Отмена клиентом',
  'Нет в наличии',
  'Ошибка оформления',
  'Доставка невозможна',
];

export function CloseOrderForm({
  order,
  onClose,
  onCancel,
}: CloseOrderFormProps) {
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<UIOrderStatus>('не выбран');
  const [paymentMethod, setPaymentMethod] =
    useState<'Наличный' | 'online'>('Наличный');

  const [courier, setCourier] = useState<string | null>(
    order.courier ?? ''
  );

  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /*
    Загружаем курьеров из localStorage
  */
  useEffect(() => {
    const savedCouriers = localStorage.getItem('adminhub_couriers');

    if (savedCouriers) {
      try {
        const parsedCouriers = JSON.parse(savedCouriers);
        setCouriers(parsedCouriers);
      } catch (error) {
        console.error('Ошибка чтения курьеров из localStorage:', error);
        setCouriers([]);
      }
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!reason) {
      newErrors.reason = 'Выберите причину закрытия';
    }

    if (status === 'не выбран') {
      newErrors.status = 'Выберите статус заказа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (reason) {
      updateStatusByReason();
    } else {
      setStatus('не выбран');
    }
  }, [reason]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onClose(
        order.id,
        status,
        paymentMethod,
        courier,
        reason
      );
    }
  };

  const updateStatusByReason = () => {
    switch (reason) {
      case 'Успешная доставка':
        setStatus('доставлен');
        break;

      case 'Отмена клиентом':
        setStatus('возвращен');
        break;

      default:
        setStatus('отменен');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">

        {/* Причина закрытия */}
        <div className="space-y-2">
          <Label htmlFor="reason">
            Причина закрытия заказа *
          </Label>

          <Select
            value={reason}
            onValueChange={setReason}
          >
            <SelectTrigger
              id="reason"
              className={errors.reason ? 'border-red-500' : ''}
            >
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

          {errors.reason && (
            <p className="text-sm text-red-500">
              {errors.reason}
            </p>
          )}
        </div>

        {/* Статус заказа */}
        <div className="space-y-2">
          <Label>Статус заказа</Label>
          <StatusBadge status={status} />
        </div>

        {/* Способ оплаты */}
        <div className="space-y-3">
          <Label>Способ оплаты *</Label>

          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) =>
              setPaymentMethod(
                value as 'Наличный' | 'online'
              )
            }
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-lg">
              <RadioGroupItem value="Наличный">
                Наличный расчет
              </RadioGroupItem>
            </div>

            <div className="flex items-center space-x-2 border p-3 rounded-lg">
              <RadioGroupItem value="online">
                online
              </RadioGroupItem>
            </div>
          </RadioGroup>
        </div>

        {/* Курьер */}
        <div className="space-y-2">
          <Label htmlFor="courier">
            Курьер
          </Label>

          <Select
            value={courier ?? ''}
            onValueChange={(val) =>
              setCourier(val || null)
            }
          >
            <SelectTrigger id="courier">
              <SelectValue placeholder="Выберите курьера" />
            </SelectTrigger>

            <SelectContent>
              {couriers.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.name}
                >
                  {item.name}
                </SelectItem>
              ))}

              <SelectItem value="">
                Не назначен
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Подтвердить закрытие
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}