import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { StockInModal } from '../components/stock/StockInModal';
import { AlertTriangle, PackagePlus, ArrowRight } from 'lucide-react';

export const LowStockPage = () => {
  const { medicines } = usePharmacy();
  const [stockInMed, setStockInMed] = useState(null);

  const lowStockList = medicines.filter(m => m.status === 'Low Stock');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-amber-500 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <span className="px-3 py-1 bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-wider">
            Inventory Warning
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            <AlertTriangle className="w-7 h-7" /> Low Stock Medicines Monitor ({lowStockList.length})
          </h1>
          <p className="text-xs text-amber-100 mt-1">
            Medicines whose total inventory has dropped below their minimum safe stock threshold. Restock promptly.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Remaining Stock</th>
                <th className="py-3 px-4 text-center">Min Threshold</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStockList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No low stock alerts at this time. All inventory levels are healthy!
                  </td>
                </tr>
              ) : (
                lowStockList.map(med => (
                  <tr key={med.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{med.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{med.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{med.category}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-600 text-sm">
                      {med.currentStock} units
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">{med.minStockLevel} units</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setStockInMed(med)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-bold text-xs rounded-lg transition-colors ml-auto"
                      >
                        <PackagePlus className="w-4 h-4" /> Add Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StockInModal isOpen={!!stockInMed} onClose={() => setStockInMed(null)} selectedMedicine={stockInMed} />
    </div>
  );
};
