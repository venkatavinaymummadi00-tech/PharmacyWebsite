import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CalendarX, ShieldAlert } from 'lucide-react';

export const ExpiredPage = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.getBatches();
      setBatches(res.data || []);
    };
    load();
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const expiredBatches = batches.filter(b => b.expiryDate < todayStr);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-rose-600 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <span className="px-3 py-1 bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-wider">
            Safety Guard
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            <CalendarX className="w-7 h-7" /> Expired Stock Quarantined ({expiredBatches.length} batches)
          </h1>
          <p className="text-xs text-rose-100 mt-1">
            System automatically prevents expired stock from being sold or billed in POS.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">Medicine Item</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-center">Expired Quantity</th>
                <th className="py-3 px-4 text-center">Expiry Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expiredBatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No expired stock currently logged.
                  </td>
                </tr>
              ) : (
                expiredBatches.map(b => (
                  <tr key={b.id} className="hover:bg-rose-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-700">{b.batchNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.medicineName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.supplierName}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-700">{b.quantity} units</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600">{b.expiryDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold bg-rose-100 text-rose-700 rounded-full">
                        BLOCKED / EXPIRED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
