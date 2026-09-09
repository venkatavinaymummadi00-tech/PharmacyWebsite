import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PharmacyProvider } from './context/PharmacyContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

import { LoginPage } from './pages/LoginPage';
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

// Redirects unauthenticated users to /login
function ProtectedRoute({ children }) {
  const { firebaseUser } = useAuth();
  if (!firebaseUser) return <Navigate to="/login" replace />;
  return children;
}

// Main app shell — navbar + sidebar + all protected routes
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-4 lg:p-8 transition-all duration-300">
          <Routes>
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><MedicinesPage /></ProtectedRoute>} />
            <Route path="/inventory/add" element={<ProtectedRoute><MedicinesPage /></ProtectedRoute>} />
            <Route path="/inventory/stock-in" element={<ProtectedRoute><StockInPage /></ProtectedRoute>} />
            <Route path="/inventory/low-stock" element={<ProtectedRoute><LowStockPage /></ProtectedRoute>} />
            <Route path="/inventory/out-of-stock" element={<ProtectedRoute><MedicinesPage /></ProtectedRoute>} />
            <Route path="/inventory/expiring-soon" element={<ProtectedRoute><ExpiringSoonPage /></ProtectedRoute>} />
            <Route path="/inventory/expired" element={<ProtectedRoute><ExpiredPage /></ProtectedRoute>} />

            <Route path="/sales/pos" element={<ProtectedRoute><SalesPOSPage /></ProtectedRoute>} />
            <Route path="/sales/history" element={<ProtectedRoute><SalesHistoryPage /></ProtectedRoute>} />

            <Route path="/purchases" element={<ProtectedRoute><PurchasesPage /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />

            <Route path="/store" element={<ProtectedRoute><CustomerStorePage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/health-info" element={<ProtectedRoute><HealthInfoPage /></ProtectedRoute>} />

            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <PharmacyProvider>
        <CartProvider>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />
            {/* All other routes — protected inside AppShell */}
            <Route path="/*" element={<AppShell />} />
          </Routes>
        </CartProvider>
      </PharmacyProvider>
    </AuthProvider>
  );
}

export default App;

