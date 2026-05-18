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
  phone: string;
  role: string;
  status: string;
}

interface CloseOrderFormProps {
  order: Order;
  onClose: (
    orderId: number,
    status: Order['status'],
    paymentMethod: 'Наличный' | 'online',
    courier: Courier | null,
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
  const [paymentMethod, setPaymentMethod] = useState<'Наличный' | 'online'>('Наличный');

  const [selectedCourierId, setSelectedCourierId] = useState<number | null>(
    order.courier?.id ?? null
  );

  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!reason) newErrors.reason = 'Выберите причину закрытия';
    if (status === 'не выбран') newErrors.status = 'Выберите статус заказа';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (reason) {
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
    } else {
      setStatus('не выбран');
    }
  }, [reason]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const courierObject = couriers.find((c) => c.id === selectedCourierId) || null;

      onClose(
        order.id,
        status as Order['status'],
        paymentMethod,
        courierObject, 
        reason
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Причина закрытия */}
        <div className="space-y-2">
          <Label htmlFor="reason">Причина закрытия заказа *</Label>
          <Select value={reason} onValueChange={setReason}>
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
          {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
        </div>

        {/* Статус заказа (отображение) */}
        <div className="space-y-2">
          <Label>Будет установлен статус:</Label>
          <div className="pt-1">
            <StatusBadge status={status === 'не выбран' ? 'ожидает' : status} />
          </div>
        </div>

        {/* Способ оплаты */}
        <div className="space-y-3">
          <Label>Способ оплаты *</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(val) => setPaymentMethod(val as 'Наличный' | 'online')}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
              <RadioGroupItem value="Наличный" id="r1" />
              <Label htmlFor="r1" className="flex-1 cursor-pointer">Наличный расчет</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
              <RadioGroupItem value="online" id="r2" />
              <Label htmlFor="r2" className="flex-1 cursor-pointer">online</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Выбор курьера */}
        <div className="space-y-2">
          <Label htmlFor="courier">Курьер (кто доставил/возвращает)</Label>
          <Select
            value={selectedCourierId ? String(selectedCourierId) : "none"}
            onValueChange={(value) => setSelectedCourierId(value === "none" ? null : Number(value))}
          >
            <SelectTrigger className="w-full bg-white text-black border border-slate-300">
              <SelectValue placeholder="Выберите курьера">
                {couriers.find(c => c.id === selectedCourierId)?.name || "Выберите курьера"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent className="bg-white text-slate-900">
              <SelectItem value="none">Без курьера</SelectItem>
              {couriers.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name} ({item.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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