import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Truck, PackageCheck, Layers } from 'lucide-react';

export const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.getPurchases();
      setPurchases(res.data || []);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-pharmacy-600" /> Supplier Purchase Orders & Inbound Stock Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit history of purchase invoices, supplier stock orders, and total expenditures.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Purchase ID</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-center">Items Received</th>
                <th className="py-3 px-4 text-right">Total Purchase Cost</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{p.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-pharmacy-700">{p.invoiceNumber}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{p.date}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{p.supplierName}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">{p.items.length} item types</td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                    ${p.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
