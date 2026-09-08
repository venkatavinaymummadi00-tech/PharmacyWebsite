import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ShoppingCart, FileText, CheckCircle2, AlertCircle, Clock, Truck, Eye } from 'lucide-react';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus, rxVerified) => {
    await api.updateOrderStatus(orderId, newStatus, rxVerified);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-pharmacy-600" /> Customer Online Orders & Prescription Verifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review online storefront orders, verify doctor prescription attachments, and update fulfillment workflow.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-sm text-pharmacy-700">{ord.id}</span>
                  <StatusBadge status={ord.status} />
                  {ord.prescriptionUploaded && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 ${ord.prescriptionVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      <FileText className="w-3 h-3" />
                      {ord.prescriptionVerified ? 'Rx Verified' : 'Rx Verification Needed'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Ordered on {new Date(ord.date).toLocaleString()} by <strong className="text-slate-800">{ord.customerName}</strong>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
                <span className="text-lg font-black text-slate-900 font-mono">₹{ord.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Customer Info */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <div className="font-bold text-slate-700">Customer Delivery Info</div>
                <div className="text-slate-600">Email: {ord.email} • Phone: {ord.phone}</div>
                <div className="text-slate-600">Address: {ord.deliveryAddress}</div>
                <div className="text-slate-500 font-mono">Payment: {ord.paymentMethod}</div>
              </div>

              {/* Prescription Attachment Preview */}
              {ord.prescriptionUploaded && (
                <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-2">
                  <div className="font-bold text-indigo-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" /> Uploaded Doctor Prescription
                    </span>
                    {ord.prescriptionVerified ? (
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'Confirmed', true)}
                        className="px-2.5 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-lg shadow-xs hover:bg-indigo-700"
                      >
                        Approve Rx
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-indigo-700">
                    Attached Rx Image: <a href={ord.prescriptionFileUrl || '#'} target="_blank" rel="noreferrer" className="underline font-bold">View Prescription Image</a>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Table */}
            <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
              <div className="p-2 bg-slate-50 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                Order Items ({ord.items.length})
              </div>
              <div className="divide-y divide-slate-100">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800">{item.name}</span>
                      {item.prescriptionRequired && (
                        <span className="ml-2 px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[9px] font-bold rounded">Rx</span>
                      )}
                    </div>
                    <div className="font-mono text-slate-700">
                      {item.quantity} x ₹{item.price?.toFixed(2)} = <strong className="text-slate-900">₹{(item.quantity * item.price).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Update Workflow Status:</span>
              <div className="flex flex-wrap gap-1.5">
                {['Pending', 'Prescription Verification', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(ord.id, st, ord.prescriptionVerified)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      ord.status === st
                        ? 'bg-pharmacy-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
