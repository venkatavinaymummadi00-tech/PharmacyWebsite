import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  PlusCircle,
  PackagePlus,
  AlertCircle,
  AlertTriangle,
  Clock,
  CalendarX,
  ShoppingCart,
  Receipt,
  Truck,
  Users,
  Store,
  FileText,
  HeartPulse,
  BarChart3,
  Bell,
  History,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { isCustomer } = useAuth();
  const { metrics } = usePharmacy();
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(false);

  const lowStockBadge = metrics?.lowStockCount > 0 ? metrics.lowStockCount : null;
  const outOfStockBadge = metrics?.outOfStockCount > 0 ? metrics.outOfStockCount : null;
  const expiringBadge = metrics?.expiringSoonCount > 0 ? metrics.expiringSoonCount : null;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
      isActive
        ? 'bg-pharmacy-600 text-white shadow-sm shadow-pharmacy-600/30'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const subLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive ? 'bg-pharmacy-50 text-pharmacy-700 font-bold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
    }`;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Core Links */}
          <div className="space-y-1">
            <NavLink to="/" end className={linkClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/store" className={linkClass} onClick={onClose}>
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Customer Storefront</span>
            </NavLink>
          </div>

          {/* INVENTORY MODULE */}
          {!isCustomer && (
            <div>
              <button
                onClick={() => setInventoryOpen(!inventoryOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600"
              >
                <span className="flex items-center gap-2">
                  <Pill className="w-3.5 h-3.5 text-pharmacy-600" /> Inventory
                </span>
                {inventoryOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {inventoryOpen && (
                <div className="mt-1 pl-3 space-y-1 border-l-2 border-slate-100 ml-3">
                  <NavLink to="/inventory" end className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <Pill className="w-3.5 h-3.5" /> All Medicines
                    </span>
                  </NavLink>

                  <NavLink to="/inventory/add" className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <PlusCircle className="w-3.5 h-3.5 text-pharmacy-600" /> Add Medicine
                    </span>
                  </NavLink>

                  <NavLink to="/inventory/stock-in" className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <PackagePlus className="w-3.5 h-3.5 text-teal-600" /> Stock In
                    </span>
                  </NavLink>

                  <NavLink to="/inventory/low-stock" className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Low Stock
                    </span>
                    {lowStockBadge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-700 rounded-full">
                        {lowStockBadge}
                      </span>
                    )}
                  </NavLink>

                  <NavLink to="/inventory/out-of-stock" className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Out of Stock
                    </span>
                    {outOfStockBadge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-700 rounded-full">
                        {outOfStockBadge}
                      </span>
                    )}
                  </NavLink>

                  <NavLink to="/inventory/expiring-soon" className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Expiring Soon
                    </span>
                    {expiringBadge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-700 rounded-full">
                        {expiringBadge}
                      </span>
                    )}
                  </NavLink>

                  <NavLink to="/inventory/expired" className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <CalendarX className="w-3.5 h-3.5 text-rose-600" /> Expired Stock
                    </span>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* SALES MODULE */}
          {!isCustomer && (
            <div>
              <button
                onClick={() => setSalesOpen(!salesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-3.5 h-3.5 text-pharmacy-600" /> Sales & POS
                </span>
                {salesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {salesOpen && (
                <div className="mt-1 pl-3 space-y-1 border-l-2 border-slate-100 ml-3">
                  <NavLink to="/sales/pos" className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2 font-bold text-pharmacy-700">
                      <ShoppingCart className="w-3.5 h-3.5" /> New Sale (POS)
                    </span>
                  </NavLink>
                  <NavLink to="/sales/history" className={subLinkClass} onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5" /> Sales History
                    </span>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* OPERATIONAL MANAGEMENT */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operations & Health
            </div>

            {!isCustomer && (
              <>
                <NavLink to="/purchases" className={linkClass} onClick={onClose}>
                  <Truck className="w-4 h-4" />
                  <span>Purchases</span>
                </NavLink>

                <NavLink to="/suppliers" className={linkClass} onClick={onClose}>
                  <Users className="w-4 h-4" />
                  <span>Suppliers</span>
                </NavLink>

                <NavLink to="/categories" className={linkClass} onClick={onClose}>
                  <FileText className="w-4 h-4" />
                  <span>Categories</span>
                </NavLink>
              </>
            )}

            <NavLink to="/orders" className={linkClass} onClick={onClose}>
              <ShoppingCart className="w-4 h-4" />
              <span>Customer Orders</span>
            </NavLink>

            <NavLink to="/health-info" className={linkClass} onClick={onClose}>
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Health Guidance</span>
            </NavLink>
          </div>

          {/* ANALYTICS & AUDIT LOGS */}
          {!isCustomer && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Analytics & Logs
              </div>

              <NavLink to="/reports" className={linkClass} onClick={onClose}>
                <BarChart3 className="w-4 h-4 text-pharmacy-600" />
                <span>Reports & Analytics</span>
              </NavLink>

              <NavLink to="/notifications" className={linkClass} onClick={onClose}>
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </NavLink>

              <NavLink to="/audit-logs" className={linkClass} onClick={onClose}>
                <History className="w-4 h-4" />
                <span>Audit Logs</span>
              </NavLink>

              <NavLink to="/settings" className={linkClass} onClick={onClose}>
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Footer info badge */}
        <div className="p-3 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 text-center">
          <div className="font-bold text-slate-700">PharmaCare v2.4</div>
          <div>Responsive FEFO System</div>
        </div>
      </aside>
    </>
  );
};
