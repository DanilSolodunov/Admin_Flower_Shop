import { Package, ShoppingCart, CheckCircle, BarChart3, Users, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarProps {
  currentView: 'products' | 'new_orders' | 'completed_orders' | 'couriers' | 'reports';
  onViewChange: (view: 'products' | 'new_orders' | 'completed_orders' | 'couriers' | 'reports') => void;
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'products' as const, label: 'Товары', icon: Package },
    { id: 'new_orders' as const, label: 'Новые заказы', icon: ShoppingCart },
    { id: 'completed_orders' as const, label: 'Завершенные заказы', icon: CheckCircle },
    { id: 'couriers' as const, label: 'Курьеры', icon: Users },
    { id: 'reports' as const, label: 'Отчеты', icon: BarChart3 },
  ];

  return (
    <aside className="h-full w-64 bg-slate-800 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-tight">AdminHub</h1>
        <p className="text-xs text-slate-400 mt-1">Панель управления</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-slate-900 hover:bg-slate-700"
          onClick={() => window.location.reload()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Выйти
        </Button>
      </div>
    </aside>
  );
}