import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ShoppingCart, UserCheck, Menu, X, Pill, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { currentRole, user, switchRole, ROLES } = useAuth();
  const { medicines, notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead } = usePharmacy();
  const { cart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const roleRef = useRef(null);

  // Auto-search filtering
  const filteredMedicines = searchQuery.trim()
    ? medicines.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setShowRoleMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pharmacy-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-pharmacy-500/20 group-hover:scale-105 transition-transform">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-pharmacy-900 to-teal-700 bg-clip-text text-transparent">
                PharmaCare
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-pharmacy-600">
                Pharmacy System
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Autocomplete Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicine by name, generic name, brand, ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent focus:border-pharmacy-500 focus:bg-white focus:ring-2 focus:ring-pharmacy-500/20 rounded-xl text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && filteredMedicines.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
              <div className="p-2 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Medicine Autocomplete Results
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {filteredMedicines.map((med) => (
                  <div
                    key={med.id}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                      navigate(`/inventory?search=${encodeURIComponent(med.name)}`);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {med.name}
                        {med.prescriptionRequired && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">Rx</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{med.genericName} • {med.brandName}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-pharmacy-700">₹{med.sellingPrice.toFixed(2)}</span>
                      <div className={`text-[11px] font-semibold ${med.currentStock === 0 ? 'text-rose-600' : (med.currentStock <= med.minStockLevel ? 'text-amber-600' : 'text-emerald-600')}`}>
                        {med.currentStock} in stock
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Role Selector, Cart, Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher */}
          <div ref={roleRef} className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-pharmacy-600" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-pharmacy-700 font-bold">{currentRole}</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Switch Active User Role
                </div>
                {Object.values(ROLES).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setShowRoleMenu(false);
                      if (role === ROLES.CUSTOMER) {
                        navigate('/store');
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      currentRole === role ? 'bg-pharmacy-50 text-pharmacy-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && <UserCheck className="w-4 h-4 text-pharmacy-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Icon (Customer storefront or general view) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-600 hover:text-pharmacy-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pharmacy-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-pharmacy-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-pharmacy-600" />
                    <span className="text-xs font-bold text-slate-800">Notifications ({notifications.length})</span>
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-pharmacy-600 hover:text-pharmacy-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.link) navigate(n.link);
                          setShowNotifications(false);
                        }}
                        className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-slate-50/80 font-medium' : ''}`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.type === 'danger' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          ) : n.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <Pill className="w-4 h-4 text-pharmacy-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                              {n.title}
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-pharmacy-500/20"
            />
            <div className="text-left leading-tight hidden md:block">
              <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user.name}</div>
              <div className="text-[10px] text-pharmacy-600 font-semibold">{user.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
