import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { usePharmacy } from '../../context/PharmacyContext';
import { PackagePlus, AlertCircle } from 'lucide-react';

export const StockInModal = ({ isOpen, onClose, selectedMedicine = null }) => {
  const { medicines, suppliers, addStock } = usePharmacy();

  const [formData, setFormData] = useState({
    medicineId: selectedMedicine?.id || (medicines[0]?.id || ''),
    supplierId: selectedMedicine?.supplierId || (suppliers[0]?.id || ''),
    batchNumber: `BATCH-${Date.now().toString().slice(-4)}`,
    quantity: 50,
    purchasePrice: selectedMedicine?.purchasePrice || 2.50,
    mfgDate: new Date().toISOString().slice(0, 10),
    expiryDate: '2027-12-31',
    invoiceNumber: `INV-SUP-${Date.now().toString().slice(-4)}`,
    receivedBy: 'Pharmacist Staff'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (e) => {
    const medId = e.target.value;
    const med = medicines.find(m => m.id === medId);
    setFormData(prev => ({
      ...prev,
      medicineId: medId,
      supplierId: med?.supplierId || prev.supplierId,
      purchasePrice: med?.purchasePrice || prev.purchasePrice
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.medicineId || !formData.batchNumber || Number(formData.quantity) <= 0) {
      setErrorMsg('Please enter valid medicine, batch number, and positive quantity.');
      return;
    }

    setSubmitting(true);
    try {
      await addStock(formData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record stock in.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentMed = medicines.find(m => m.id === formData.medicineId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Incoming Stock (Stock In)" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-700 mb-1">Select Medicine *</label>
          <select
            name="medicineId"
            value={formData.medicineId}
            onChange={handleMedicineChange}
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-medium"
            required
          >
            {medicines.map(med => (
              <option key={med.id} value={med.id}>
                {med.name} (Current Stock: {med.currentStock} units)
              </option>
            ))}
          </select>
        </div>

        {currentMed && (
          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-teal-900 flex justify-between items-center">
            <div>
              <span className="font-bold">{currentMed.name}</span>
              <span className="text-slate-500 block">{currentMed.category} • {currentMed.medicineType}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Existing Stock:</span>
              <span className="text-lg font-black font-mono text-pharmacy-700">{currentMed.currentStock} units</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Supplier *</label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
            >
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.companyName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Batch Number *</label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-mono"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Quantity Received *</label>
            <input
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Unit Purchase Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Invoice / Ref No</label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Manufacturing Date</label>
            <input
              type="date"
              name="mfgDate"
              value={formData.mfgDate}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-bold"
              required
            />
          </div>
        </div>

        <div className="pt-2 text-right">
          <div className="text-xs text-slate-500">
            Total Purchase Value: <strong className="text-slate-900 font-mono text-sm">${(Number(formData.quantity) * Number(formData.purchasePrice)).toFixed(2)}</strong>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 text-xs font-bold bg-pharmacy-600 hover:bg-pharmacy-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <PackagePlus className="w-4 h-4" />
            {submitting ? 'Updating Inventory...' : 'Confirm Stock In'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
