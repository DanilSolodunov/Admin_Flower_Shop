import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import { Product } from '../../types/Product';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  User,
  Calendar,
  Package,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { Label } from '../ui/label';
import { orderApi } from "../../api/orderApi";

interface Courier {
  id: number;
  name: string;
  phone: string;
  role?: string;
  status?: string;
}

interface OrderDetailsProps {
  order: Order | null;
  onAssignCourier: (courier: Courier | null) => void;
  onChangeStatus: (status: string) => void;
  onClose: () => void;
}

export function OrderDetails({
  order,
  onAssignCourier,
  onChangeStatus,
  onClose,
}: OrderDetailsProps) {
  const [courierId, setCourierId] = useState<number | null>(null);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const savedCouriers = localStorage.getItem('adminhub_couriers');

    if (savedCouriers) {
      try {
        const parsedCouriers = JSON.parse(savedCouriers);

        if (Array.isArray(parsedCouriers)) {
          setCouriers(parsedCouriers);
        } else {
          setCouriers([]);
        }
      } catch (error) {
        console.error(
          'Ошибка чтения курьеров из localStorage:',
          error
        );
        setCouriers([]);
      }
    } else {
      setCouriers([]);
    }
  }, []);

  useEffect(() => {
    if (order) {
      setCourierId(order.courier?.id ?? null);
      setSelectedStatus(order.status ?? '');
    }
  }, [order]);

  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ожидает':
        return 'bg-yellow-300 text-yellow-800 border-yellow-200';

      case 'собирается':
        return 'bg-blue-300 text-blue-800 border-blue-200';

      case 'отправлен':
        return 'bg-purple-300 text-purple-800 border-purple-200';

      case 'доставлен':
        return 'bg-green-300 text-green-800 border-green-200';

      default:
        return 'bg-gray-200 text-gray-800 border-gray-200';
    }
  };

  const handleAcceptOrder = async () => {
    try {
      if (!courierId || !order?.id) return;

      setIsLoading(true);
      setError(null);

      await orderApi.updateOrder({
        id: order.id,
        status: "собирается",
        courierId: courierId ?? null,
      });

      const selectedCourier = couriers.find(
        (item) => item.id === courierId
      );

      if (!selectedCourier) return;

      onAssignCourier(selectedCourier);
      setSelectedStatus("собирается");
      onChangeStatus("собирается");

      onClose();
    } catch (err) {
      console.error(
        "Ошибка назначения курьера:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Ошибка при обновлении заказа"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 px-2 sm:px-3 w-full max-w-full sm:max-w-md mx-auto box-border max-h-[90vh] overflow-y-auto">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Заголовок */}
      <div className="flex justify-between items-start pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Заказ #{order.id}
          </h3>

          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(order.date).toLocaleString('ru-RU')}
            </span>
          </div>
        </div>

        <Badge
          className={getStatusColor(selectedStatus)}
          variant="secondary"
        >
          {selectedStatus}
        </Badge>
      </div>

      {/* Состав заказа */}
      <Card className="border-slate-900 bg-white">
        <CardHeader className="bg-slate-50/50 py-2 sm:py-3 px-3">
          <CardTitle className="text-base flex-1 min-w-0 w-full items-center gap-2 !text-black">
            <Package className="w-4 h-4 !text-slate-900" />
            Состав заказа
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-2 sm:pt-4 px-3">
          {order.products.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">
              Список товаров пуст
            </p>
          ) : (
            <div className="space-y-4 overflow-x-auto">
              {order.products.map((item, index) => {
                const itemAny = item as any;

                const hasWrapper =
                  itemAny?.product !== undefined;

                const product: Product = hasWrapper
                  ? itemAny.product
                  : itemAny;

                const quantity: number = hasWrapper
                  ? itemAny.quantity
                  : 1;

                return (
                  <div
                    key={index}
                    className="flex justify-between items-start gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                        {product?.image && (
                          <img
                            src={product.image}
                            alt={product.name || ''}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition"
                            onClick={() => setPreviewImage(product.image)}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {product?.name || '—'}
                        </p>

                        <p className="text-xs text-slate-500">
                          {(product?.price ?? 0).toLocaleString()} ₽ × {quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {(
                          (product?.price ?? 0) * quantity
                        ).toLocaleString()} ₽
                      </p>
                    </div>
                  </div>
                );
              })}

              {previewImage && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                  onClick={() => setPreviewImage(null)}
                >
                  <img
                    src={previewImage}
                    className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
                    alt="preview"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Адрес + сумма */}
        <CardContent className="pt-2 sm:pt-4 px-3">
          <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-sm text-slate-700">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-500" />
              Адрес доставки:{' '}
              <span className="text-slate-700">
                {order.address?.trim()
                  ? order.address
                  : 'Адрес не указан'}
              </span>
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="font-semibold text-slate-700">
              Итого к оплате:
            </span>

            <span className="text-lg sm:text-2xl font-bold text-slate-900">
              {(order.total ?? 0).toLocaleString()} ₽
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Оплата */}
      {order.paymentMethod && (
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-2 sm:pt-4 px-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CreditCard className="w-4 h-4 text-slate-400" />

              <span className="font-medium text-slate-900">
                Способ оплаты:
              </span>

              <span
                className={`ml-auto font-semibold px-2 py-1 rounded-full ${order.paymentMethod === 'Наличный'
                  ? 'bg-green-300 text-green-900'
                  : order.paymentMethod === 'online'
                    ? 'bg-yellow-300 text-yellow-900'
                    : ''
                  }`}
              >
                {order.paymentMethod}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-200 bg-white">
        <CardHeader className="bg-slate-50/50 py-2 sm:py-3 px-3">
          <CardTitle className="text-base flex items-center gap-2 !text-black">
            <User className="w-4 h-4 text-slate-500" />
            Курьер
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-2 sm:pt-4 px-3">

          {order.status === 'собирается' && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">
                Назначенный курьер
              </p>

              <p className="text-sm font-bold text-blue-900">
                {order.courier?.name || 'Не назначен'}
              </p>
            </div>
          )}

          {order.status === 'ожидает' && (
            <div className="space-y-3">

              <p className="text-sm font-bold text-blue-900">
                {order.courier?.name || 'Не назначен'}
              </p>

              <Label className="text-sm !text-black">
                Назначить курьера
              </Label>
              <Select
                value={courierId ? String(courierId) : ""}
                onValueChange={(value) =>
                  setCourierId(value ? Number(value) : null)
                }
              >
                <SelectTrigger className="w-full bg-white text-black border border-slate-300">
                  <span>
                    {couriers.find(
                      (item) => item.id === courierId
                    )?.name || "Выберите курьера"}
                  </span>
                </SelectTrigger>

                <SelectContent className="bg-white text-slate-900 border border-slate-300">
                  {couriers.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={String(item.id)}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-4">

            {order.status === 'ожидает' && (
              <Button
                onClick={handleAcceptOrder}
                disabled={!courierId || isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Обработка...' : 'Принять заказ'}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Закрыть
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
