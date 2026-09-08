import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { Bell, CheckCircle2, AlertTriangle, Pill, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePharmacy();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-pharmacy-600" /> System Notification Alerts ({notifications.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time warnings for low stock levels, expired batch alerts, and pending customer order verifications.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
        >
          <Check className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              markNotificationRead(n.id);
              if (n.link) navigate(n.link);
            }}
            className={`p-4 hover:bg-slate-50 cursor-pointer flex items-start gap-4 transition-colors ${
              !n.read ? 'bg-slate-50/80' : ''
            }`}
          >
            <div className="p-2.5 rounded-xl border bg-white shadow-xs">
              {n.type === 'danger' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              ) : n.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              ) : (
                <Pill className="w-5 h-5 text-pharmacy-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(n.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{n.message}</p>
            </div>

            {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-pharmacy-600 shrink-0 mt-2"></span>}
          </div>
        ))}
      </div>
    </div>
  );
};
