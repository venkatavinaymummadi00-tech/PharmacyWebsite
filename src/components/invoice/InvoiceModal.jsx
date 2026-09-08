import React from 'react';
import { Modal } from '../ui/Modal';
import { Printer, Download, Pill, CheckCircle, ShieldCheck } from 'lucide-react';

export const InvoiceModal = ({ isOpen, onClose, sale }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pharmacy Sales Invoice" maxWidth="max-w-3xl">
      <div id="printable-invoice" className="bg-white p-6 rounded-xl space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pharmacy-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">PharmaCare Pharmacy Ltd.</h2>
              <p className="text-xs text-slate-500">100 Healthcare Way, Suite 400 • Phone: +91 (800) 555-PHARMA</p>
              <p className="text-[11px] text-slate-400">License #: PH-98241-IND • GST ID: 37AAAAA0000A1Z5</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full uppercase tracking-wider mb-1">
              PAID & VERIFIED
            </span>
            <div className="text-lg font-bold text-slate-900">{sale.invoiceNumber}</div>
            <div className="text-xs text-slate-500">{new Date(sale.date).toLocaleString()}</div>
          </div>
        </div>

        {/* Billed To & Staff Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Billed To Customer</span>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{sale.customerName}</div>
            <div className="text-slate-500">Phone: {sale.customerPhone || 'N/A'}</div>
            <div className="text-slate-500">Payment: <span className="font-bold text-slate-700">{sale.paymentMethod}</span></div>
          </div>
          <div className="text-left sm:text-right">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Dispensed By</span>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{sale.soldBy || 'Staff Pharmacist'}</div>
            <div className="text-slate-500">Status: <span className="font-bold text-emerald-600">{sale.status}</span></div>
            <div className="text-slate-500">Batch Control: FEFO Verified</div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Medicine Item</th>
                <th className="py-2.5 px-3">Batch No</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-800">{item.medicineName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">ID: {item.medicineId}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                      {item.batchNumber}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                    ₹{item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Calculation Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{sale.subtotal.toFixed(2)}</span>
            </div>
            {sale.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-mono font-semibold">-₹{sale.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST Tax (5%):</span>
              <span className="font-mono font-semibold">₹{sale.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-pharmacy-700 font-mono">₹{sale.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-lg text-[11px] text-teal-800 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <strong>Important Safety Notice:</strong> Please check all medicines before leaving. Keep medications out of reach of children. Store according to individual package instructions.
          </div>
        </div>

        {/* Actions bar (Print & Close) */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-pharmacy-600 hover:bg-pharmacy-700 text-white rounded-xl shadow-md transition-all"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>
    </Modal>
  );
};
