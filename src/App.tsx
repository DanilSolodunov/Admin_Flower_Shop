import { useState, useEffect } from 'react';
import { Product } from './types/Product';
import { Order } from './types/Order';
import { User } from './types/User';
import { Courier } from './types/Courier';
import { Header } from './components/Layout/Header';
import { LoginForm } from './components/Auth/LoginForm';
import { ProductTable } from './components/Products/ProductTable';
import { ProductForm } from './components/Products/ProductForm';
import { OrderTable } from './components/Orders/OrderTable';
import { CloseOrderForm } from './components/Orders/CloseOrderForm';
import { OrderDetails } from './components/Orders/OrderDetails';
import { RevenueReport } from './components/Reports/RevenueReport';
import { CourierList } from './components/Couriers/CourierList';
import { CourierForm } from './components/Couriers/CourierForm';
import { SettingsForm } from './components/Settings/SettingsForm';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Package, ShoppingCart, CheckCircle, BarChart3, Users } from 'lucide-react';

const menuItems = [
  { id: 'products' as const, label: 'Товары', icon: Package },
  { id: 'new_orders' as const, label: 'Новые', icon: ShoppingCart },
  { id: 'completed_orders' as const, label: 'Завершенные', icon: CheckCircle },
  { id: 'couriers' as const, label: 'Курьеры', icon: Users },
  { id: 'reports' as const, label: 'Отчеты', icon: BarChart3 },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('adminhub_users');
    if (saved) return JSON.parse(saved);
    return [{ id: 1, username: 'admin', password: 'admin123', name: 'Администратор', role: 'admin' }];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('adminhub_products');
    return saved ? JSON.parse(saved) : [];
  });

  // === Временные заглушки заказов ===
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('adminhub_orders');
    if (saved) return JSON.parse(saved);

    // Тестовые заказы
    return [
      {
        id: 1001,
        date: new Date().toISOString(),
        status: 'ожидает',
        total: 3200,
        courier: null,
        paymentMethod: 'online',
        products: [
          { product: { id: 1, description: 'Букет роз красных', price: 1600, imageurl: 'https://images.unsplash.com/photo-1548095115-45697e72b73d' }, quantity: 2 }
        ]
      },
      {
        id: 1002,
        date: new Date().toISOString(),
        status: 'собирается',
        total: 2100,
        courier: 'Курьер 1',
        paymentMethod: 'наличный расчет',
        products: [
          { product: { id: 2, description: 'Букет тюльпанов', price: 700, imageurl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d' }, quantity: 3 }
        ]
      },
      {
        id: 1003,
        date: new Date().toISOString(),
        status: 'отправлен',
        total: 4500,
        courier: 'Курьер 2',
        paymentMethod: 'online',
        products: [
          { product: { id: 3, description: 'Пионовый букет', price: 1500, imageurl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93' }, quantity: 3 }
        ]
      },
      {
        id: 1004,
        date: '2026-03-16T09:00:00.000Z',
        status: 'доставлен',
        total: 1800,
        courier: 'Курьер 3',
        paymentMethod: 'наличный расчет',
        products: [
          { product: { id: 4, description: 'Букет ромашек', price: 600, imageurl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6' }, quantity: 3 }
        ]
      },
      {
        id: 1006,
        date: '2026-03-16T09:00:00.000Z',
        status: 'доставлен',
        total: 3700,
        courier: 'Курьер 1',
        paymentMethod: 'наличный расчет',
        products: [
          { product: { id: 4, description: 'Букет ромашек', price: 600, imageurl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6' }, quantity: 3 }
        ]
      },
      {
        id: 1007,
        date: '2026-02-10T09:00:00.000Z',
        status: 'доставлен',
        total: 5200,
        courier: 'Курьер 2',
        paymentMethod: 'online',
        products: [
          { product: { id: 4, description: 'Букет ромашек', price: 600, imageurl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6' }, quantity: 3 }
        ]
      },
      {
        id: 1063,
        date: '2026-01-09T09:00:00.000Z',
        status: 'доставлен',
        total: 9800,
        courier: 'Курьер 1',
        paymentMethod: 'online',
        products: [
          { product: { id: 4, description: 'Букет ромашек', price: 600, imageurl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6' }, quantity: 3 }
        ]
      }
    ];
  });

  const [couriers, setCouriers] = useState<Courier[]>(() => {
    const saved = localStorage.getItem('adminhub_couriers');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<'products' | 'new_orders' | 'completed_orders' | 'couriers' | 'reports'>('products');

  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  const [closingOrder, setClosingOrder] = useState<Order | undefined>(undefined);
  const [isCloseOrderFormOpen, setIsCloseOrderFormOpen] = useState(false);

  const [viewingOrder, setViewingOrder] = useState<Order | undefined>(undefined);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const [editingCourier, setEditingCourier] = useState<Courier | undefined>(undefined);
  const [isCourierFormOpen, setIsCourierFormOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeOrders = orders.filter(order =>
    ['ожидает', 'собирается', 'отправлен'].includes(order.status)
  );

  const completedOrders = orders.filter(order =>
    ['доставлен', 'отменен', 'возвращен'].includes(order.status)
  );

  useEffect(() => { localStorage.setItem('adminhub_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('adminhub_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('adminhub_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('adminhub_couriers', JSON.stringify(couriers)); }, [couriers]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminhub_auth');
    if (savedAuth) {
      setCurrentUser(JSON.parse(savedAuth));
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated)
    return (
      <LoginForm
        onLogin={(u, p) => {
          const user = users.find(x => x.username === u && x.password === p);
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('adminhub_auth', JSON.stringify(user));
            return { success: true };
          }
          return { success: false, error: 'Неверные данные' };
        }}
        onRegister={(u, p) => {
          if (users.find(x => x.username === u))
            return { success: false, error: 'Пользователь существует' };

          const newUser: User = {
            id: users.length + 1,
            username: u,
            password: p,
            name: u,
            role: 'admin'
          };

          setUsers([...users, newUser]);
          setCurrentUser(newUser);
          setIsAuthenticated(true);

          localStorage.setItem('adminhub_auth', JSON.stringify(newUser));

          return { success: true };
        }}
      />
    );

  const views: Record<typeof currentView, React.ReactNode> = {
    products: (
     <div className="space-y-6">
  <div>
    <h1 className="text-2xl font-bold text-white">
      Управление товаром
    </h1>
  </div>

  <div className="flex justify-end">
    <Button
      size="sm"
      onClick={() => {
        setEditingProduct(undefined);
        setIsProductFormOpen(true);
      }}
      className="bg-blue-600 hover:bg-blue-700"
    >
      Добавить товар
    </Button>
  </div>

        <ProductTable
          products={products}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsProductFormOpen(true);
          }}
          onDelete={(id) =>
            setProducts(products.filter((p) => p.id !== id))
          }
        />
      </div>
    ),

    new_orders: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Новые заказы</h1>

        <OrderTable
          orders={activeOrders}
          onCloseOrder={(o) => {
            setClosingOrder(o);
            setIsCloseOrderFormOpen(true);
          }}
          showActions
        />

        {/* Кнопка сброса тестовых данных */}
        <div className="pt-4">
          <Button
            size="sm"
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => {
              localStorage.removeItem('adminhub_orders');
              window.location.reload();
            }}
          >
            Сбросить тестовые заказы
          </Button>
        </div>
      </div>
    ),

    completed_orders: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Завершенные заказы</h1>

        <OrderTable
          orders={completedOrders}
          onCloseOrder={() => { }}
          showActions={false}
        />
      </div>
    ),

    couriers: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Управление курьерами</h1>

        <CourierList
          couriers={couriers}
          onEdit={setEditingCourier}
          onDelete={(id) =>
            setCouriers(couriers.filter(c => c.id !== id))
          }
          onAdd={() => {
            setEditingCourier(undefined);
            setIsCourierFormOpen(true);
          }}
        />
      </div>
    ),

    reports: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Финансовые отчеты</h1>
        <RevenueReport orders={orders} />
      </div>
    ),
  };

  return (
    <div className="h-screen flex flex-col bg-gray-600">

      <Header
        username={currentUser?.name || 'Admin'}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 overflow-auto p-6" style={{ paddingBottom: '120px' }}>
        {views[currentView]}
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-slate-800 border-t border-slate-700 flex justify-around items-center z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingTop: '8px' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center text-xs transition-colors ${isActive ? 'text-blue-500' : 'text-slate-300 hover:text-white'}`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent>
          <ProductForm
            product={editingProduct}
            onSave={(product) => {
              setProducts([...products, { ...product, id: Date.now() }]);
              setIsProductFormOpen(false);
            }}
            onCancel={() => setIsProductFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCloseOrderFormOpen} onOpenChange={setIsCloseOrderFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Закрыть заказ</DialogTitle></DialogHeader>
          {closingOrder && (
            <CloseOrderForm
              order={closingOrder}
              onClose={(id, status, paymentMethod, courier, reason) => {
                const courierString = String(courier);
                setOrders(orders.map(o =>
                  o.id === id ? { ...o, status, paymentMethod, courier: courierString, reason } : o
                ));
                setIsCloseOrderFormOpen(false);
                setClosingOrder(undefined);
              }}
              onCancel={() => {
                setIsCloseOrderFormOpen(false);
                setClosingOrder(undefined);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Детали заказа</DialogTitle></DialogHeader>
          {viewingOrder && (
            <OrderDetails
              order={viewingOrder}
              onAssignCourier={(c) => {
                const courierString = String(c);
                setOrders(orders.map(o =>
                  o.id === viewingOrder.id ? { ...o, courier: courierString } : o
                ));
              }}
              onClose={() => setIsOrderDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCourierFormOpen} onOpenChange={setIsCourierFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCourier ? 'Редактировать курьера' : 'Добавить курьера'}</DialogTitle>
          </DialogHeader>
          <CourierForm
            courier={editingCourier}
            onSave={(data) => {
              if (editingCourier) {
                setCouriers(couriers.map(c =>
                  c.id === editingCourier.id ? { ...data, id: c.id } : c
                ));
              } else {
                setCouriers([...couriers, { ...data, id: Date.now() }]);
              }
              setIsCourierFormOpen(false);
              setEditingCourier(undefined);
            }}
            onCancel={() => {
              setIsCourierFormOpen(false);
              setEditingCourier(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Настройки профиля</DialogTitle></DialogHeader>
          {currentUser && (
            <SettingsForm
              user={currentUser}
              onUpdate={(data) => {
                const updatedUsers = users.map(u =>
                  u.id === currentUser.id ? { ...u, ...data } : u
                );
                setUsers(updatedUsers);
                setCurrentUser({ ...currentUser, ...data });
                setIsSettingsOpen(false);
                localStorage.setItem('adminhub_auth', JSON.stringify({ ...currentUser, ...data }));
              }}
              onDelete={() => {
                setUsers(users.filter(u => u.id !== currentUser.id));
                setIsSettingsOpen(false);
                setCurrentUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('adminhub_auth');
              }}
              onCancel={() => setIsSettingsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}