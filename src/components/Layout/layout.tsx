import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SidebarToggle } from './SidebarToggle';
import { ProductsPage } from '../Products/ProductsPage';
import { OrdersPage } from '../Orders/OrdersPage';
import { CouriersPage } from '../Couriers/CouriersPage';
import { ReportsPage } from '../Reports/ReportsPage';

type ViewType =
    | 'products'
    | 'new_orders'
    | 'completed_orders'
    | 'couriers'
    | 'reports';

export function Layout() {
    const [currentView, setCurrentView] = useState<ViewType>('products');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const views: Record<ViewType, React.ReactNode> = {
        products: <ProductsPage />,
        new_orders: <OrdersPage statusView="new" />,
        completed_orders: <OrdersPage statusView="completed" />,
        couriers: <CouriersPage />,
        reports: <ReportsPage />,
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Узкая вертикальная панель */}
            <SidebarToggle onClick={() => setSidebarOpen(true)} />

            {/* Выезжающий Sidebar */}
            <Sidebar
                currentView={currentView}
                onViewChange={setCurrentView}
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Основной контент */}
            <main className="ml-12 p-6">
                {views[currentView]}
            </main>
        </div>
    );
}
