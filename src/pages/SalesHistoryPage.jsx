import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
import { Receipt, Eye, Printer, Search } from 'lucide-react';

export const SalesHistoryPage = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSales = async () => {
    try {
      const res = await api.getSales();
      setSales(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filteredSales = sales.filter(
    (s) =>
      s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.soldBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-pharmacy-600" /> Sales Transaction History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete archive of billing invoices, customer purchases, discount logs, and cashier details.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice #, customer name, cashier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Cashier</th>
                <th className="py-3 px-4 text-center">Items Count</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-pharmacy-700">{s.invoiceNumber}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {new Date(s.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{s.customerName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.soldBy || 'Pharmacist'}</td>
                  <td className="py-3.5 px-4 text-center font-bold font-mono">{s.items.length} items</td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                    ₹{s.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedSale(s)}
                      className="p-1.5 text-pharmacy-600 hover:text-pharmacy-800 hover:bg-pharmacy-50 rounded-lg transition-colors font-bold flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-4 h-4" /> View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        sale={selectedSale}
      />
    </div>
  );
};
