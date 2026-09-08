import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { useAuth } from '../context/AuthContext';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
import {
  ShoppingCart,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  Receipt,
  CreditCard,
  User,
  Phone,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export const SalesPOSPage = () => {
  const { medicines, completeSale } = usePharmacy();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(5); // 5% default
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const [errorMsg, setErrorMsg] = useState('');
  const [completedSale, setCompletedSale] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Search filtered medicines
  const searchResults = searchTerm.trim()
    ? medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddItemToBill = (medicine) => {
    setErrorMsg('');
    if (medicine.currentStock === 0) {
      setErrorMsg(`Out of stock — ${medicine.name} cannot be sold.`);
      return;
    }
    if (medicine.status === 'Expired') {
      setErrorMsg(`This medicine has expired and cannot be sold.`);
      return;
    }

    setBillItems((prev) => {
      const existing = prev.find((item) => item.medicineId === medicine.id);
      if (existing) {
        if (existing.quantity + 1 > medicine.currentStock) {
          setErrorMsg(`Cannot sell more than available stock (${medicine.currentStock} units available).`);
          return prev;
        }
        return prev.map((item) =>
          item.medicineId === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          medicineId: medicine.id,
          medicineName: medicine.name,
          unitPrice: medicine.sellingPrice,
          quantity: 1,
          maxStock: medicine.currentStock,
          prescriptionRequired: medicine.prescriptionRequired,
        },
      ];
    });
    setSearchTerm('');
  };

  const handleUpdateQty = (medicineId, newQty) => {
    setErrorMsg('');
    const item = billItems.find((i) => i.medicineId === medicineId);
    if (!item) return;

    if (newQty > item.maxStock) {
      setErrorMsg(`Cannot sell more than available stock (${item.maxStock} units available).`);
      return;
    }
    if (newQty <= 0) {
      handleRemoveItem(medicineId);
      return;
    }

    setBillItems((prev) =>
      prev.map((i) => (i.medicineId === medicineId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveItem = (medicineId) => {
    setBillItems((prev) => prev.filter((i) => i.medicineId !== medicineId));
  };

  // Total Calculations
  const subtotal = billItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * Number(discountPercent)) / 100;
  const taxableTotal = subtotal - discountAmount;
  const taxAmount = (taxableTotal * Number(taxPercent)) / 100;
  const grandTotal = taxableTotal + taxAmount;

  const handleCheckoutSale = async () => {
    setErrorMsg('');
    if (billItems.length === 0) {
      setErrorMsg('Please add at least one medicine item to the bill.');
      return;
    }

    setSubmitting(true);
    try {
      const saleData = {
        customerName: customerName || 'Walk-in Customer',
        customerPhone: customerPhone || 'N/A',
        items: billItems.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        discountAmount,
        taxAmount,
        paymentMethod,
        soldBy: user.name || 'Pharmacist Staff',
      };

      const res = await completeSale(saleData);
      setCompletedSale(res.data);
      setBillItems([]);
      setCustomerName('Walk-in Customer');
      setCustomerPhone('');
      setDiscountPercent(0);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete POS sale.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-pharmacy-600" /> Point of Sale (POS) Billing Terminal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fast billing counter with automatic FEFO stock deduction, tax/discount calculation, and print invoices.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-3 border border-rose-200 shadow-xs text-xs font-bold animate-fadeIn">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Medicine Quick Search & Catalog Selection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Search Medicine Catalog
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Type medicine name, generic name, brand, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-pharmacy-500 focus:bg-white transition-all"
              />
            </div>

            {/* Quick search dropdown results */}
            {searchTerm.trim() && (
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto border border-slate-200 rounded-xl bg-white shadow-md">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No matching medicines found</div>
                ) : (
                  searchResults.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => handleAddItemToBill(med)}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          {med.name}
                          {med.prescriptionRequired && (
                            <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-extrabold">
                              Rx
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {med.genericName} • {med.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-pharmacy-700 font-mono">${med.sellingPrice.toFixed(2)}</div>
                        <div
                          className={`text-[10px] font-bold ${
                            med.currentStock === 0
                              ? 'text-rose-600'
                              : med.currentStock <= med.minStockLevel
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {med.currentStock} in stock
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick Select Grid (Popular Items) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Quick-Add Inventory
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {medicines.slice(0, 9).map((med) => (
                <button
                  key={med.id}
                  onClick={() => handleAddItemToBill(med)}
                  disabled={med.currentStock === 0}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                    med.currentStock === 0
                      ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                      : 'bg-slate-50/60 border-slate-200 hover:border-pharmacy-500 hover:bg-pharmacy-50/30'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-800 text-xs truncate">{med.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{med.genericName}</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-pharmacy-700 font-mono text-xs">${med.sellingPrice.toFixed(2)}</span>
                    <span className={`text-[10px] font-bold ${med.currentStock === 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                      {med.currentStock} left
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Current Sales Bill & Checkout */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-pharmacy-600" /> Current Bill Invoice ({billItems.length} items)
              </h3>
              {billItems.length > 0 && (
                <button
                  onClick={() => setBillItems([])}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Clear Bill
                </button>
              )}
            </div>

            {/* Bill Table */}
            {billItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShoppingCart className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Bill is empty</p>
                <p className="text-[11px]">Select medicines from the catalog to add to bill.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {billItems.map((item) => (
                  <div key={item.medicineId} className="py-2.5 flex items-center justify-between text-xs gap-2">
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        {item.medicineName}
                        {item.prescriptionRequired && (
                          <span className="text-[8px] bg-indigo-100 text-indigo-700 px-1 py-0.2 rounded font-bold">Rx</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">${item.unitPrice.toFixed(2)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={item.maxStock}
                        value={item.quantity}
                        onChange={(e) => handleUpdateQty(item.medicineId, Number(e.target.value))}
                        className="w-12 p-1 text-center bg-slate-50 border border-slate-300 rounded font-bold font-mono text-xs"
                      />
                      <span className="w-14 text-right font-bold text-slate-900 font-mono">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.medicineId)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Customer Details Form */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-semibold mb-0.5">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-0.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 555-0192"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 font-semibold mb-0.5">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-0.5">Tax %</label>
                  <input
                    type="number"
                    min="0"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-0.5">Payment</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI / Online">Digital</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Calculation Totals */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 font-mono text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({discountPercent}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax ({taxPercent}%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="text-pharmacy-700">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutSale}
              disabled={submitting || billItems.length === 0}
              className="w-full py-3 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              {submitting ? 'Completing Sale & Updating Stock...' : 'Complete POS Sale & Print Invoice'}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Printable Modal */}
      <InvoiceModal
        isOpen={!!completedSale}
        onClose={() => setCompletedSale(null)}
        sale={completedSale}
      />
    </div>
  );
};
