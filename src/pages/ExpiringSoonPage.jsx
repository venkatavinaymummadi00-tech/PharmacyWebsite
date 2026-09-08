import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Clock, CalendarX, AlertTriangle } from 'lucide-react';

export const ExpiringSoonPage = () => {
  const [batches, setBatches] = useState([]);
  const [filterDays, setFilterDays] = useState(60);

  useEffect(() => {
    const load = async () => {
      const res = await api.getBatches();
      setBatches(res.data || []);
    };
    load();
  }, []);

  const today = new Date();
  const targetDate = new Date(today.getTime() + filterDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  const expiringBatches = batches.filter(
    b => b.expiryDate >= todayStr && b.expiryDate <= targetDate
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-amber-600 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <span className="px-3 py-1 bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-wider">
            Expiry Prevention
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            <Clock className="w-7 h-7" /> Medicines Expiring Soon ({expiringBatches.length} batches)
          </h1>
          <p className="text-xs text-amber-100 mt-1">
            Track batches nearing their expiration window to prioritize FEFO sales or return to suppliers.
          </p>
        </div>

        <div className="flex gap-2 bg-white/10 p-1.5 rounded-xl backdrop-blur-xs">
          {[30, 60, 90].map(days => (
            <button
              key={days}
              onClick={() => setFilterDays(days)}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-colors ${
                filterDays === days ? 'bg-white text-amber-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              {days} Days
            </button>
          ))}
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
                <th className="py-3 px-4 text-center">Batch Stock</th>
                <th className="py-3 px-4 text-center">Expiry Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expiringBatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No batches expiring within the selected {filterDays}-day window.
                  </td>
                </tr>
              ) : (
                expiringBatches.map(b => (
                  <tr key={b.id} className="hover:bg-amber-50/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-800">{b.batchNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.medicineName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.supplierName}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{b.quantity} units</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700">{b.expiryDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-full">
                        EXPIRING SOON
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
