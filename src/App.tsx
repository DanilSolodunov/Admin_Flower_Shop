import { useState, useEffect } from 'react';
import { Product } from './types/Product';
import { Order } from './types/Order';
import { User } from './types/User';
import { Courier } from './types/Courier';
import { Sidebar } from './components/Layout/Sidebar';
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
import { SidebarToggle } from './components/Layout/SidebarToggle';

// Начальные данные
const initialProducts: Product[] = [
  {
    id: 1,
    imageurl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    description: 'Часы классические',
    price: 5000,
    amount: 10,
  },
  {
    id: 2,
    imageurl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    description: 'Наушники беспроводные',
    price: 12000,
    amount: 5,
  },
];

const initialCouriers: Courier[] = [
  { id: 1, name: 'Курьер 1 (Иванов А.)', phone: '+7 (999) 111-11-11', status: 'Активный' },
  { id: 2, name: 'Курьер 2 (Петров Б.)', phone: '+7 (999) 222-22-22', status: 'Активный' },
  { id: 3, name: 'Курьер 3 (Сидоров В.)', phone: '+7 (999) 333-33-33', status: 'Активный' },
];

const initialOrders: Order[] = [
  {
    id: 1,
    products: [],
    total: 5000,
    status: 'ожидает',
    date: new Date().toISOString(),
    paymentMethod: null,
    courier: null,
  },
];

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);


  // Users State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('adminhub_users');
    if (saved) return JSON.parse(saved);
    return [{ id: '1', username: 'admin', password: 'admin123', name: 'Администратор', role: 'admin' }];
  });

  // Data State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('adminhub_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('adminhub_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [couriers, setCouriers] = useState<Courier[]>(() => {
    const saved = localStorage.getItem('adminhub_couriers');
    return saved ? JSON.parse(saved) : initialCouriers;
  });

  // UI State
  const [currentView, setCurrentView] = useState<'products' | 'new_orders' | 'completed_orders' | 'couriers' | 'reports'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [closingOrder, setClosingOrder] = useState<Order | undefined>(undefined);
  const [isCloseOrderFormOpen, setIsCloseOrderFormOpen] = useState(false);

  // Order Details State
  const [viewingOrder, setViewingOrder] = useState<Order | undefined>(undefined);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  // Courier State
  const [editingCourier, setEditingCourier] = useState<Courier | undefined>(undefined);
  const [isCourierFormOpen, setIsCourierFormOpen] = useState(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Фильтрация заказов
  const activeOrders = orders.filter(order =>
    ['ожидает', 'собирается', 'отправлен'].includes(order.status)
  );

  const completedOrders = orders.filter(order =>
    ['доставлен', 'отменен', 'возвращен'].includes(order.status)
  );

  // Persistence
  useEffect(() => {
    localStorage.setItem('adminhub_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('adminhub_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('adminhub_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('adminhub_couriers', JSON.stringify(couriers));
  }, [couriers]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminhub_auth');
    if (savedAuth) {
      setCurrentUser(JSON.parse(savedAuth));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminhub_auth');
  };

  // Handlers
  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('adminhub_auth', JSON.stringify(user));
      return { success: true }; 
    }
    return { success: false, error: 'Неверное имя пользователя или пароль' };
  };

  const handleRegister = (username: string, password: string) => {
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Пользователь с таким именем уже существует' };
    }
    const newUser: User = {
      id: users.length + 1,
      username,
      password,
      name: username,
      role: 'admin',
    };
    users.push(newUser);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('adminhub_auth', JSON.stringify(newUser));
    return { success: true }; 
  };

  const handleUpdateUser = (data: { name: string; username: string; password: string }) => {
    if (!currentUser) return;

    const updatedUsers = users.map(u =>
      u.id === currentUser.id
        ? { ...u, ...data }
        : u
    );
    setUsers(updatedUsers);

    const updatedCurrentUser = { ...currentUser, ...data };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('adminhub_auth', JSON.stringify(updatedCurrentUser));

    setIsSettingsOpen(false);
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;

    const updatedUsers = users.filter(u => u.id !== currentUser.id);
    setUsers(updatedUsers);

    handleLogout();
    setIsSettingsOpen(false);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p));
    } else {
      const newProduct: Product = {
        ...productData,
        id: Number(Date.now()),
      };
      setProducts([...products, newProduct]);
    }
    setIsProductFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleCloseOrder = (
    orderId: number,
    status: Order['status'],
    paymentMethod: 'наличный расчет' | 'online',
    courier: number,
    reason: string
  ) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? {
          ...order,
          status,
          paymentMethod,
          courier,
          reason
        }
        : order
    ));
    setIsCloseOrderFormOpen(false);
    setClosingOrder(undefined);
  };

  const handleCloseOrderClick = (order: Order) => {
    setClosingOrder(order);
    setIsCloseOrderFormOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleAssignCourier = (courier: number | null) => {
    if (viewingOrder) {
      setOrders(orders.map(order =>
        order.id === viewingOrder.id
          ? { ...order, courier }
          : order
      ));
    }
  };

  const handleSaveCourier = (courierData: Omit<Courier, 'id'>) => {
    if (editingCourier) {
      setCouriers(couriers.map(c => c.id === editingCourier.id ? { ...courierData, id: editingCourier.id } : c));
    } else {
      const newCourier: Courier = {
        ...courierData,
        id: Number(Date.now()),
      };
      setCouriers([...couriers, newCourier]);
    }
    setIsCourierFormOpen(false);
    setEditingCourier(undefined);
  };

  const handleDeleteCourier = (id: number) => {
    setCouriers(couriers.filter(c => c.id !== id));
  };

  const handleEditCourier = (courier: Courier) => {
    setEditingCourier(courier);
    setIsCourierFormOpen(true);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} onRegister={handleRegister} />;
  }
  return (
    <div className="h-screen bg-gray-600 relative overflow-hidden">
      {/* Узкая вертикальная панель */}
      <SidebarToggle onClick={() => setSidebarOpen(true)} />

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Выезжающий Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-slate-800 z-50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <Sidebar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Основной контейнер */}
      <div className="flex h-full ml-12">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            username={currentUser?.name || currentUser?.username || 'Admin'}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          <main className="flex-1 overflow-auto p-6">
            {currentView === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-white">
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
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </div>
            )}

            {currentView === 'new_orders' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">
                  Новые заказы
                </h1>

                <OrderTable
                  orders={activeOrders}
                  onCloseOrder={handleCloseOrderClick}
                  onViewOrder={handleViewOrder}
                  showActions={true}
                />
              </div>
            )}

            {currentView === 'completed_orders' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">
                  Завершенные заказы
                </h1>

                <OrderTable
                  orders={completedOrders}
                  onCloseOrder={handleCloseOrderClick}
                  onViewOrder={handleViewOrder}
                  showActions={false}
                />
              </div>
            )}

            {currentView === 'couriers' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">
                  Управление курьерами
                </h1>

                <CourierList
                  couriers={couriers}
                  onEdit={handleEditCourier}
                  onDelete={handleDeleteCourier}
                  onAdd={() => {
                    setEditingCourier(undefined);
                    setIsCourierFormOpen(true);
                  }}
                />
              </div>
            )}

            {currentView === 'reports' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">
                  Финансовые отчеты
                </h1>

                <RevenueReport orders={orders} />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setIsProductFormOpen(false);
              setEditingProduct(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCloseOrderFormOpen} onOpenChange={setIsCloseOrderFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Закрыть заказ</DialogTitle>
          </DialogHeader>
          {closingOrder && (
            <CloseOrderForm
              order={closingOrder}
              onClose={handleCloseOrder}
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
          <DialogHeader>
            <DialogTitle>Детали заказа</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <OrderDetails
              order={viewingOrder}
              onAssignCourier={handleAssignCourier}
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
            onSave={handleSaveCourier}
            onCancel={() => {
              setIsCourierFormOpen(false);
              setEditingCourier(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Настройки профиля</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <SettingsForm
              user={currentUser}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteAccount}
              onCancel={() => setIsSettingsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
