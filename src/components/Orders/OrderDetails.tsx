import React from 'react';
import { Order } from '../../types/Order';
import { Product } from '../../types/Product';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Calendar, Package, CreditCard, MapPin } from 'lucide-react';
import { Label } from '../ui/label';

interface OrderDetailsProps {
  order: Order | null;
  onAssignCourier: (courier: string) => void;
  onChangeStatus: (status: string) => void;
  onClose: () => void;
}
export function OrderDetails({ order, onAssignCourier, onChangeStatus, onClose }: OrderDetailsProps) {
  if (!order) return null;
  const [selectedCourier, setSelectedCourier] = React.useState<string | ''>(order.courier ?? '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ожидает': return 'bg-yellow-300 text-yellow-800 border-yellow-200';
      case 'собирается': return 'bg-blue-300 text-blue-800 border-blue-200';
      case 'отправлен': return 'bg-purple-300 text-purple-800 border-purple-200';
      case 'доставлен': return 'bg-green-300 text-green-800 border-green-200';
      default: return 'bg-gray-200 text-gray-800 border-gray-200';
    }
  };

  const [selectedStatus, setSelectedStatus] = React.useState(order.status);

  const handleAcceptOrder = () => {
    if (selectedCourier) {
      onAssignCourier(selectedCourier);
      setSelectedStatus('собирается');
      onChangeStatus?.('собирается');
      onClose();
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-full sm:max-w-md mx-auto">
      {/* Заголовок и статус */}
      <div className="flex justify-between items-start pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Заказ #{order.id}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(order.date).toLocaleString('ru-RU')}
            </span>
          </div>
        </div>
        <Badge className={getStatusColor(selectedStatus)} variant="secondary">
          {selectedStatus}
        </Badge>
      </div>

      {/* Список товаров */}
      <Card className="border-slate-900 bg-white">
        <CardHeader className="bg-slate-50/50 pb-3">
          <CardTitle className="text-base flex items-center gap-2 !text-black">
            <Package className="w-4 h-4 !text-slate-900" />
            Состав заказа
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {order.products.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">Список товаров пуст</p>
          ) : (
            <div className="space-y-4 overflow-x-auto">
              {order.products.map((item, index) => {
                const itemAny = item as unknown;
                const hasWrapper = (itemAny as any).product !== undefined;
                const product: Product = hasWrapper
                  ? ((itemAny as { product: Product; quantity: number }).product)
                  : (itemAny as Product);
                const quantity: number = hasWrapper
                  ? (itemAny as { product: Product; quantity: number }).quantity
                  : 1;

                return (
                  <div key={index} className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                        {product?.imageurl && (
                          <img
                            src={product.imageurl}
                            alt={product.description || ''}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{product?.description || '—'}</p>
                        <p className="text-xs text-slate-500">
                          {product?.price?.toLocaleString() ?? '0'} ₽ × {quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {((product?.price ?? 0) * quantity).toLocaleString()} ₽
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {/* Адрес доставки */}
        <CardContent className="pt-4">
          <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-sm text-slate-700">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-500" />
              Адрес доставки:{' '}
              <span className="text-slate-700">
                {order.address && order.address.trim() !== '' ? order.address : 'Адрес не указан'}
              </span>
            </span>
          </div>

          {/* Итоговая сумма */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="font-semibold text-slate-700">Итого к оплате:</span>
            <span className="text-2xl font-bold text-slate-900">{order.total.toLocaleString()} ₽</span>
          </div>
        </CardContent>
      </Card>

      {/* Информация об оплате и доставке */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
  {order.paymentMethod && (
    <Card className="border-slate-200 bg-white flex-1 min-w-0">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CreditCard className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-900 block">Способ оплаты:</span>
          <span
            className={`ml-auto font-semibold px-2 py-1 rounded-full ${
              order.paymentMethod === 'наличный расчет'
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
</div>

      {/* Назначение курьера */}
      <Card className={`border-slate-200 bg-white`}>
        <CardHeader className="bg-slate-50/50 pb-3">
          <CardTitle className="text-base flex items-center gap-2 !text-black">
            <User className="w-4 h-4 text-slate-500" />
            Курьер
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {order.courier ? (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">Назначен курьер</p>
                  <p className="text-sm font-bold text-blue-900">{order.courier}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <p className="text-sm text-slate-900">Курьер еще не назначен</p>
            </div>
          )}

          {order.status !== 'доставлен' && (
            <div className="space-y-3 pt-2">
              <Label htmlFor="courier-select" className="text-sm flex items-center gap-2 !text-black">
                {order.courier ? 'Сменить курьера' : 'Назначить курьера'}
              </Label>
              <Select
                value={selectedCourier}
                onValueChange={(val) => setSelectedCourier(val === '0' ? "" : val)}
              >
                <SelectTrigger
                  id="courier-select"
                  className="w-full bg-white text-black border border-slate-300 hover:bg-slate-50"
                >
                  <SelectValue placeholder="Выберите курьера из списка" />
                </SelectTrigger>

                <SelectContent className="bg-white text-slate-900 border border-slate-300">
                  <SelectItem value="Курьер 1">Курьер 1 (Иванов А.)</SelectItem>
                  <SelectItem value="Курьер 2">Курьер 2 (Петров Б.)</SelectItem>
                  <SelectItem value="Курьер 3">Курьер 3 (Сидоров В.)</SelectItem>
                  <SelectItem value="0">Не назначен</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex flex-col sm:flex-row gap-2">
                 {!order.courier && (
                <Button
                  onClick={handleAcceptOrder}
                  disabled={!selectedCourier}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Принять заказ
                </Button>
                 )}
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}