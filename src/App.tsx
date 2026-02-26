// App.tsx
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

// Навигационные вкладки
const menuItems = [
  { id: 'products' as const, label: 'Товары', icon: Package },
  { id: 'new_orders' as const, label: 'Новые', icon: ShoppingCart },
  { id: 'completed_orders' as const, label: 'Завершенные', icon: CheckCircle },
  { id: 'couriers' as const, label: 'Курьеры', icon: Users },
  { id: 'reports' as const, label: 'Отчеты', icon: BarChart3 },

];

export default function App() {

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Users State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('adminhub_users');
    if (saved) return JSON.parse(saved);
    return [{ id: '1', username: 'admin', password: 'admin123', name: 'Администратор', role: 'admin' }];
  });

  // Data State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('adminhub_products');
    return saved ? JSON.parse(saved) : [];
  });



  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('adminhub_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [couriers, setCouriers] = useState<Courier[]>(() => {
    const saved = localStorage.getItem('adminhub_couriers');
    return saved ? JSON.parse(saved) : [];
  });

  // UI State
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

  // Фильтрация заказов
  const activeOrders = orders.filter(order =>
    ['ожидает', 'собирается', 'отправлен'].includes(order.status)
  );
  const completedOrders = orders.filter(order =>
    ['доставлен', 'отменен', 'возвращен'].includes(order.status)
  );

  // Persistence
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

  if (!isAuthenticated) return <LoginForm onLogin={(u, p) => {
    const user = users.find(x => x.username === u && x.password === p);
    if (user) { setCurrentUser(user); setIsAuthenticated(true); localStorage.setItem('adminhub_auth', JSON.stringify(user)); return { success: true }; }
    return { success: false, error: 'Неверные данные' };
  }} onRegister={(u, p) => {
    if (users.find(x => x.username === u)) return { success: false, error: 'Пользователь существует' };
    const newUser: User = { id: String(users.length + 1), username: u, password: p, name: u, role: 'admin' };
    setUsers([...users, newUser]); setCurrentUser(newUser); setIsAuthenticated(true); localStorage.setItem('adminhub_auth', JSON.stringify(newUser)); return { success: true };
  }} />;

  const views: Record<typeof currentView, React.ReactNode> = {
    products: (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-1g font-bold text-white">
            Управление товарами
          </h1>

          <Button
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
            setIsProductFormOpen(true); // 🔥 ВАЖНО
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
        <OrderTable orders={activeOrders} onCloseOrder={(o) => { setClosingOrder(o); setIsCloseOrderFormOpen(true); }} onViewOrder={setViewingOrder} showActions />
      </div>
    ),
    completed_orders: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Завершенные заказы</h1>
        <OrderTable orders={completedOrders} onCloseOrder={() => { }} onViewOrder={setViewingOrder} showActions={false} />
      </div>
    ),
    couriers: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Управление курьерами</h1>
        <CourierList couriers={couriers} onEdit={setEditingCourier} onDelete={(id) => setCouriers(couriers.filter(c => c.id !== id))} onAdd={() => { setEditingCourier(undefined); setIsCourierFormOpen(true) }} />
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
      <Header username={currentUser?.name || 'Admin'} onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="flex-1 overflow-auto p-6">
        {views[currentView]}
      </main>
      {/* Нижнее меню */}
      <nav className="fixed bottom-0 left-0 w-full bg-slate-800 border-t border-slate-700 flex justify-around items-center py-2 z-50">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`flex flex-col items-center text-xs transition-colors ${isActive ? 'text-blue-500' : 'text-slate-300 hover:text-white'}`}>
              <Icon className="w-6 h-6 mb-1" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Диалоги */}
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</DialogTitle></DialogHeader>
          <ProductForm product={editingProduct} onSave={(data) => { if (editingProduct) { setProducts(products.map(p => p.id === editingProduct.id ? { ...data, id: p.id } : p)) } else { setProducts([...products, { ...data, id: Date.now() }]) } setIsProductFormOpen(false); setEditingProduct(undefined) }} onCancel={() => { setIsProductFormOpen(false); setEditingProduct(undefined) }} />
        </DialogContent>
      </Dialog>

      <Dialog open={isCloseOrderFormOpen} onOpenChange={setIsCloseOrderFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Закрыть заказ</DialogTitle></DialogHeader>
          {closingOrder && <CloseOrderForm order={closingOrder} onClose={(id, status, paymentMethod, courier, reason) => { setOrders(orders.map(o => o.id === id ? { ...o, status, paymentMethod, courier, reason } : o)); setIsCloseOrderFormOpen(false); setClosingOrder(undefined) }} onCancel={() => { setIsCloseOrderFormOpen(false); setClosingOrder(undefined) }} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Детали заказа</DialogTitle></DialogHeader>
          {viewingOrder && <OrderDetails order={viewingOrder} onAssignCourier={(c) => { setOrders(orders.map(o => o.id === viewingOrder.id ? { ...o, courier: c } : o)) }} onClose={() => setIsOrderDetailsOpen(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isCourierFormOpen} onOpenChange={setIsCourierFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingCourier ? 'Редактировать курьера' : 'Добавить курьера'}</DialogTitle></DialogHeader>
          <CourierForm courier={editingCourier} onSave={(data) => { if (editingCourier) { setCouriers(couriers.map(c => c.id === editingCourier.id ? { ...data, id: c.id } : c)) } else { setCouriers([...couriers, { ...data, id: Date.now() }]) } setIsCourierFormOpen(false); setEditingCourier(undefined) }} onCancel={() => { setIsCourierFormOpen(false); setEditingCourier(undefined) }} />
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Настройки профиля</DialogTitle></DialogHeader>
          {currentUser && <SettingsForm user={currentUser} onUpdate={(data) => { const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, ...data } : u); setUsers(updatedUsers); setCurrentUser({ ...currentUser, ...data }); setIsSettingsOpen(false); localStorage.setItem('adminhub_auth', JSON.stringify({ ...currentUser, ...data })) }} onDelete={() => { setUsers(users.filter(u => u.id !== currentUser.id)); setIsSettingsOpen(false); setCurrentUser(null); setIsAuthenticated(false); localStorage.removeItem('adminhub_auth') }} onCancel={() => setIsSettingsOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}