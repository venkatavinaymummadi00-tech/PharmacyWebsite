import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { StockInModal } from '../components/stock/StockInModal';
import { api } from '../services/api';
import { PackagePlus, Layers, Calendar, PlusCircle, ArrowRight } from 'lucide-react';

export const StockInPage = () => {
  const [batches, setBatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await api.getBatches();
      setBatches(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-teal-600" /> Stock In & Batch Receiving Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record incoming stock shipments from suppliers, set manufacturing & expiry dates, and assign batch IDs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Record New Stock In
        </button>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700 flex items-center gap-2">
          <Layers className="w-4 h-4 text-pharmacy-600" /> Received Inventory Batches ({batches.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">Medicine Item</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-center">Qty Received</th>
                <th className="py-3 px-4">Mfg Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-right">Invoice Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((batch) => {
                const todayStr = new Date().toISOString().slice(0, 10);
                const isExpired = batch.expiryDate < todayStr;
                return (
                  <tr key={batch.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-pharmacy-700">{batch.batchNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{batch.medicineName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{batch.supplierName}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{batch.quantity} units</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{batch.mfgDate || 'N/A'}</td>
                    <td className={`py-3.5 px-4 font-mono font-bold ${isExpired ? 'text-rose-600' : 'text-slate-800'}`}>
                      {batch.expiryDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">{batch.invoiceNumber || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <StockInModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchBatches();
        }}
      />
    </div>
  );
};
