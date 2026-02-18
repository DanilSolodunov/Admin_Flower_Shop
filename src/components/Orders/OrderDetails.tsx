//..components/Orders
import React from 'react';
import { Order } from '../../types/Order';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table } from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { User, Calendar, Package, CreditCard, MapPin } from 'lucide-react';

interface OrderDetailsProps {
  order: Order;
  onAssignCourier: (courier: 'Курьер 1' | 'Курьер 2' | 'Курьер 3') => void;
  onClose: () => void;
}

export function OrderDetails({ order, onAssignCourier, onClose }: OrderDetailsProps) {
  const [selectedCourier, setSelectedCourier] = React.useState<'Курьер 1' | 'Курьер 2' | 'Курьер 3' | ''>(
    order.courier || ''
  );

  const handleSaveCourier = () => {
    if (selectedCourier) {
      onAssignCourier(selectedCourier);
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ожидает': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'собирается': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'отправлен': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'доставлен': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
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
        <Badge className={getStatusColor(order.status)} variant="secondary">
          {order.status}
        </Badge>
      </div>

      {/* Список товаров */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50/50 pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <Package className="w-4 h-4 text-slate-500" />
            Состав заказа
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {order.products.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">Список товаров пуст</p>
          ) : (
            <div className="space-y-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img 
                        src={item.product.imageurl} 
                        alt={item.product.description}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.product.description}</p>
                      <p className="text-xs text-slate-500">{item.product.price.toLocaleString()} ₽ / шт.</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-slate-600">x{item.quantity}</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {(item.product.price * item.quantity).toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="font-semibold text-slate-700">Итого к оплате:</span>
            <span className="text-2xl font-bold text-slate-900">{order.total.toLocaleString()} ₽</span>
          </div>
        </CardContent>
      </Card>

      {/* Информация об оплате и доставке */}
      <div className="grid grid-cols-2 gap-4">
        {order.paymentMethod && (
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-900 block">Способ оплаты:</span>
                <span className="ml-auto">{order.paymentMethod}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-900 block">Статус доставки:</span>
              <span className="ml-auto capitalize">{order.status}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Назначение курьера */}
      <Card className={`border-slate-200 ${order.status === 'доставлен' ? 'bg-slate-50' : ''}`}>
        <CardHeader className="bg-slate-50/50 pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
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
              <p className="text-sm text-slate-500">Курьер еще не назначен</p>
            </div>
          )}
          
          {order.status !== 'доставлен' && (
            <div className="space-y-3 pt-2">
              <Table htmlFor="courier-select" className="text-sm font-medium text-slate-700">
                {order.courier ? 'Сменить курьера' : 'Назначить курьера'}
              </Table>
              <Select 
                value={selectedCourier} 
                onValueChange={(value) => setSelectedCourier(value as any)}
              >
                <SelectTrigger id="courier-select" className="w-full">
                  <SelectValue placeholder="Выберите курьера из списка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Курьер 1">Курьер 1 (Иванов А.)</SelectItem>
                  <SelectItem value="Курьер 2">Курьер 2 (Петров Б.)</SelectItem>
                  <SelectItem value="Курьер 3">Курьер 3 (Сидоров В.)</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveCourier} 
                  disabled={!selectedCourier}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Сохранить
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1"
                >
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