import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PharmacyProvider } from './context/PharmacyContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

import { DashboardPage } from './pages/DashboardPage';
import { MedicinesPage } from './pages/MedicinesPage';
import { StockInPage } from './pages/StockInPage';
import { LowStockPage } from './pages/LowStockPage';
import { ExpiringSoonPage } from './pages/ExpiringSoonPage';
import { ExpiredPage } from './pages/ExpiredPage';
import { SalesPOSPage } from './pages/SalesPOSPage';
import { SalesHistoryPage } from './pages/SalesHistoryPage';
import { PurchasesPage } from './pages/PurchasesPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CustomerStorePage } from './pages/CustomerStorePage';
import { OrdersPage } from './pages/OrdersPage';
import { HealthInfoPage } from './pages/HealthInfoPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <PharmacyProvider>
        <CartProvider>
          <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 flex">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              <main className="flex-1 lg:pl-64 p-4 lg:p-8 transition-all duration-300">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/inventory" element={<MedicinesPage />} />
                  <Route path="/inventory/add" element={<MedicinesPage />} />
                  <Route path="/inventory/stock-in" element={<StockInPage />} />
                  <Route path="/inventory/low-stock" element={<LowStockPage />} />
                  <Route path="/inventory/out-of-stock" element={<MedicinesPage />} />
                  <Route path="/inventory/expiring-soon" element={<ExpiringSoonPage />} />
                  <Route path="/inventory/expired" element={<ExpiredPage />} />

                  <Route path="/sales/pos" element={<SalesPOSPage />} />
                  <Route path="/sales/history" element={<SalesHistoryPage />} />

                  <Route path="/purchases" element={<PurchasesPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />

                  <Route path="/store" element={<CustomerStorePage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/health-info" element={<HealthInfoPage />} />

                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </CartProvider>
      </PharmacyProvider>
    </AuthProvider>
  );
}

export default App;
