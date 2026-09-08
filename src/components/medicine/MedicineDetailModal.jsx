import React from 'react';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';
import { Pill, AlertTriangle, ShieldCheck, FileText, Layers, Info, CheckCircle2, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MedicineDetailModal = ({ isOpen, onClose, medicine }) => {
  const { addToCart } = useCart();

  if (!medicine) return null;

  const isOutOfStock = medicine.currentStock === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Medicine Information & Safety Specifications" maxWidth="max-w-3xl">
      <div className="space-y-6 text-xs text-slate-700">
        {/* Header Card */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-pharmacy-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-pharmacy-500/30 text-teal-200 border border-teal-400/30 rounded font-semibold text-[11px]">
                {medicine.category}
              </span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[11px]">
                {medicine.medicineType}
              </span>
              {medicine.prescriptionRequired && (
                <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded font-extrabold text-[11px]">
                  Rx Required
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">{medicine.name}</h2>
            <p className="text-xs text-slate-300">
              Generic: <strong className="text-teal-300">{medicine.genericName}</strong> • Brand: <strong>{medicine.brandName}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="text-2xl font-black text-emerald-400 font-mono">${medicine.sellingPrice?.toFixed(2)}</div>
            <div className="mt-1">
              <StatusBadge status={medicine.status} />
            </div>
          </div>
        </div>

        {/* Prescription Alert Banner */}
        {medicine.prescriptionRequired && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3 text-indigo-900 font-medium">
            <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <strong>Prescription Required:</strong> This item requires a valid doctor prescription for online fulfillment or checkout.
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-pharmacy-700 flex items-center gap-1.5">
              <Info className="w-4 h-4" /> General Specifications
            </h4>
            <div className="divide-y divide-slate-200/60">
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Medicine ID:</span>
                <span className="font-mono font-bold text-slate-800">{medicine.id}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Manufacturer:</span>
                <span className="font-bold text-slate-800">{medicine.manufacturer || 'N/A'}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Primary Supplier:</span>
                <span className="font-bold text-slate-800">{medicine.supplierName || 'Apex Health'}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Total Stock Available:</span>
                <span className="font-bold text-slate-800 font-mono">{medicine.currentStock} units</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Min/Max Threshold:</span>
                <span className="font-mono text-slate-700">{medicine.minStockLevel} / {medicine.maxStockLevel} units</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-pharmacy-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Medical & Storage Notes
            </h4>
            <div>
              <span className="font-bold text-slate-700 block">General Uses:</span>
              <p className="text-slate-600 mt-0.5">{medicine.generalUses || medicine.description || 'No specific description recorded.'}</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60">
              <span className="font-bold text-slate-700 block">Storage Instructions:</span>
              <p className="text-slate-600 mt-0.5">{medicine.storageInstructions || 'Store below 25°C in a dry place.'}</p>
            </div>
          </div>
        </div>

        {/* Precautions & Warnings */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-2 text-amber-950">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Precautions & Side Effects
          </h4>
          <p><strong>Precautions:</strong> {medicine.generalPrecautions || 'Use strictly according to labeled instructions or healthcare provider advise.'}</p>
          <p><strong>Common Side Effects:</strong> {medicine.sideEffects || 'Mild stomach discomfort or headache in rare cases.'}</p>
          {medicine.warnings && (
            <p className="text-rose-700 font-semibold">
              <strong>Warning:</strong> {medicine.warnings}
            </p>
          )}
        </div>

        {/* Batch Breakdown (FEFO View) */}
        {medicine.batches && medicine.batches.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-pharmacy-600" /> Active Inventory Batches (FEFO Logic)
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2 px-3">Batch Number</th>
                    <th className="py-2 px-3">Mfg Date</th>
                    <th className="py-2 px-3">Expiry Date</th>
                    <th className="py-2 px-3 text-right">Quantity</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medicine.batches.map((batch) => {
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const isExpired = batch.expiryDate < todayStr;
                    return (
                      <tr key={batch.id} className={isExpired ? 'bg-rose-50/60' : 'hover:bg-slate-50'}>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">{batch.batchNumber}</td>
                        <td className="py-2 px-3 text-slate-500">{batch.mfgDate || 'N/A'}</td>
                        <td className={`py-2 px-3 font-mono font-bold ${isExpired ? 'text-rose-600' : 'text-slate-800'}`}>
                          {batch.expiryDate}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-800">{batch.quantity}</td>
                        <td className="py-2 px-3 text-center">
                          {isExpired ? (
                            <span className="px-2 py-0.5 text-[10px] bg-rose-100 text-rose-700 font-bold rounded">EXPIRED</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 font-bold rounded">ACTIVE</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* General Disclaimer */}
        <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center italic border border-slate-200">
          "This information is for educational purposes only and is not a substitute for professional medical advice. Always consult a pharmacist or doctor before using any medication."
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {!isOutOfStock && (
            <button
              onClick={() => {
                addToCart(medicine, 1);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-pharmacy-600 hover:bg-pharmacy-700 text-white rounded-xl shadow-md transition-all"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Store Order
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
