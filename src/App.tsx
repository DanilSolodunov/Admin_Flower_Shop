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
import { productApi } from './api/productApi';
import { orderApi } from './api/orderApi';
import { createCourier, getAllCouriers, updateCourier, deleteCourier } from "./api/courierApi";
import { initializeAuth } from "./api/authApi";

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

  const [authLoading, setAuthLoading] =
    useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const data = await productApi.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Ошибка при загрузке товаров:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const loadOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Ошибка при загрузке заказов:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [currentView, setCurrentView] = useState<'products' | 'new_orders' | 'completed_orders' | 'couriers' | 'reports'>('products');

  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  const [closingOrder, setClosingOrder] = useState<Order | undefined>(undefined);
  const [isCloseOrderFormOpen, setIsCloseOrderFormOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {

        const isValid =
          await initializeAuth();

        if (isValid) {

          const savedUser =
            localStorage.getItem("authUser");

          if (savedUser) {

            const parsedUser =
              JSON.parse(savedUser);

            setCurrentUser({
              id: 0,
              username: parsedUser.email,
              password: "",
              role: parsedUser.role,
            });

            setIsAuthenticated(true);
          }

        } else {

          setIsAuthenticated(false);

        }

      } finally {

        setAuthLoading(false);

      }
    };

    init();
  }, []);


  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadProducts();
    loadOrders();
    loadCouriers();

  }, [isAuthenticated]);

  const loadCouriers = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const data = await getAllCouriers(token || undefined);

      setCouriers(data);

      localStorage.setItem(
        "adminhub_couriers",
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Ошибка загрузки курьеров:", error);

      const saved = localStorage.getItem("adminhub_couriers");
      if (saved) {
        setCouriers(JSON.parse(saved));
      }
    }
  };

  const handleCloseOrder = async (
    orderId: number,
    status: Order["status"],
    paymentMethod: "Наличный" | "online",
    courier: Courier | null,
    reason: string
  ) => {
    try {
      await orderApi.closeOrder({
        id: orderId,
        status,
        courier,
        paymentMethod,
        reason,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
              ...o,
              status,
              paymentMethod,
              courier: courier ?? null,
              reason,
            }
            : o
        )
      );

      setIsCloseOrderFormOpen(false);
      setClosingOrder(undefined);

      await loadOrders();

      console.log("Заказ успешно закрыт");
    } catch (error) {
      console.error("Ошибка закрытия заказа:", error);
    }
  };

  const [viewingOrder, setViewingOrder] = useState<Order | undefined>(undefined);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeOrders = orders.filter(order =>
    ['ожидает', 'собирается', 'отправлен'].includes(order.status)
  );

  const completedOrders = orders.filter(order =>
    ['доставлен', 'отменен', 'возвращен'].includes(order.status)
  );

  const [isCourierFormOpen, setIsCourierFormOpen] = useState(false);

  useEffect(() => { localStorage.setItem('adminhub_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('adminhub_couriers', JSON.stringify(couriers)); }, [couriers]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Загрузка...
      </div>
    );
  }

  if (!isAuthenticated)
    return (
      <LoginForm
        onLoginSuccess={(token) => {
          localStorage.setItem('accessToken', token);

          const savedUser = localStorage.getItem('authUser');

          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            setCurrentUser({
              id: 0,
              username: parsedUser.email,
              password: '',
              role: parsedUser.role,
            });
          }

          setIsAuthenticated(true);
        }}
      />
    );

  const views: Record<typeof currentView, React.ReactNode> = {
    products: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Управление товаром</h1>

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

        {isLoadingProducts ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-200">Загрузка товаров...</div>
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsProductFormOpen(true);
            }}
            onDelete={async (id) => {
              setProducts(products.filter((p) => p.id !== id));
            }}
          />
        )}
      </div>
    ),

    new_orders: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Новые заказы</h1>
        {isLoadingOrders ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-200">Загрузка заказов...</div>
          </div>
        ) : (
          <>
            <OrderTable
              orders={activeOrders}
              // couriers={couriers}
              onCloseOrder={(o) => {
                setClosingOrder(o);
                setIsCloseOrderFormOpen(true);

              }}
              showActions
              couriers={couriers}
            />
          </>
        )}
      </div>
    ),

    completed_orders: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Завершенные заказы</h1>
        {isLoadingOrders ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-200">Загрузка заказов...</div>
          </div>
        ) : (
          <OrderTable
            orders={completedOrders}
            couriers={couriers}
            onCloseOrder={() => { }}
            showActions={false}
          />
        )}
      </div>
    ),

    couriers: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Управление курьерами</h1>

        <CourierList
          couriers={couriers}
          onEdit={(courier) => {
            setEditingCourier({ ...courier });
            setIsCourierFormOpen(true);
          }}
          onDelete={async (id) => {
            try {
              const token = localStorage.getItem("accessToken");

              await deleteCourier(id, token || undefined);

              setCouriers(prev => prev.filter(c => c.courier !== id));

              await loadCouriers();
            } catch (error) {
              console.error("Ошибка удаления курьера:", error);
              alert("Не удалось удалить курьера");
            }
          }}
          onAdd={() => {
            setEditingCourier(null);
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
        username={currentUser?.username || 'Admin'}
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

      {/* Диалог ProductForm */}
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent>
          <ProductForm
            product={editingProduct}
            onSave={async () => {
              setIsProductFormOpen(false);
              setEditingProduct(undefined);
              await loadProducts();
            }}
            onCancel={() => setIsProductFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог CloseOrderForm */}
      <Dialog open={isCloseOrderFormOpen} onOpenChange={setIsCloseOrderFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Закрыть заказ</DialogTitle></DialogHeader>
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

      {/* Диалог OrderDetails */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали заказа</DialogTitle>
          </DialogHeader>

          {viewingOrder && (
            <OrderDetails
              order={viewingOrder}
              onAssignCourier={async (courier) => {
                setOrders((prevOrders) =>
                  prevOrders.map((o) =>
                    o.id === viewingOrder.id
                      ? { ...o, courier }
                      : o
                  )
                );

                await loadOrders();
              }}
              onChangeStatus={async (status) => {
                setOrders((prevOrders) =>
                  prevOrders.map((o) =>
                    o.id === viewingOrder.id ? { ...o, status } : o
                  )
                );
                await loadOrders();
              }}
              onClose={() => setIsOrderDetailsOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог CourierForm */}
      <Dialog open={isCourierFormOpen} onOpenChange={setIsCourierFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCourier ? 'Редактировать курьера' : 'Добавить курьера'}
            </DialogTitle>
          </DialogHeader>
          <CourierForm
            courier={editingCourier || undefined}
            onSave={async (data) => {
              try {
                const token = localStorage.getItem("accessToken");

                let updatedCouriers;

                if (editingCourier) {
                  const updated = await updateCourier(
                    editingCourier.id,
                    data,
                    token || undefined
                  );

                  updatedCouriers = couriers.map((c) =>
                    c.id === editingCourier.id ? updated : c
                  );

                } else {
                  const savedCourier = await createCourier(
                    data,
                    token || undefined
                  );

                  const normalizedCourier = {
                    id: savedCourier.id,
                    name: savedCourier.name,
                    phone: savedCourier.phone,
                    status: savedCourier.status,
                  };

                  updatedCouriers = [...couriers, normalizedCourier];
                }

                setCouriers(updatedCouriers);

                localStorage.setItem(
                  "adminhub_couriers",
                  JSON.stringify(updatedCouriers)
                );

                await loadCouriers();

                setIsCourierFormOpen(false);
                setEditingCourier(null);

              } catch (error) {
                console.error(error);
                alert("Ошибка сохранения курьера");
              }
            }}
            onCancel={() => {
              setIsCourierFormOpen(false);
              setEditingCourier(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог Settings */}
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
              onLogout={() => {
                setIsAuthenticated(false);
                setCurrentUser(null);
                setIsSettingsOpen(false);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('adminhub_auth');
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}