import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { usePharmacy } from '../../context/PharmacyContext';
import { Save, AlertCircle } from 'lucide-react';

const MEDICINE_TYPES = [
  'Tablet', 'Capsule', 'Syrup', 'Tonic', 'Injection', 'Cream', 'Ointment',
  'Gel', 'Drops', 'Powder', 'Inhaler', 'Spray', 'Sachet', 'Supplement',
  'Medical Device', 'Other'
];

export const MedicineFormModal = ({ isOpen, onClose, medicineToEdit = null }) => {
  const { categories, suppliers, addMedicine, updateMedicine } = usePharmacy();
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brandName: '',
    category: categories[0]?.name || 'Pain Relief',
    medicineType: 'Tablet',
    description: '',
    manufacturer: '',
    supplierId: suppliers[0]?.id || '',
    supplierName: suppliers[0]?.companyName || '',
    purchasePrice: 15.00,
    sellingPrice: 45.00,
    currentStock: 50,
    minStockLevel: 15,
    maxStockLevel: 200,
    batchNumber: '',
    expiryDate: '',
    prescriptionRequired: false,
    storageInstructions: 'Store in a cool, dry place below 25°C away from direct sunlight.',
    generalUses: '',
    generalPrecautions: '',
    sideEffects: '',
    warnings: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (medicineToEdit) {
      setFormData({
        name: medicineToEdit.name || '',
        genericName: medicineToEdit.genericName || '',
        brandName: medicineToEdit.brandName || '',
        category: medicineToEdit.category || categories[0]?.name || 'Pain Relief',
        medicineType: medicineToEdit.medicineType || 'Tablet',
        description: medicineToEdit.description || '',
        manufacturer: medicineToEdit.manufacturer || '',
        supplierId: medicineToEdit.supplierId || suppliers[0]?.id || '',
        supplierName: medicineToEdit.supplierName || suppliers[0]?.companyName || '',
        purchasePrice: medicineToEdit.purchasePrice || 0,
        sellingPrice: medicineToEdit.sellingPrice || 0,
        currentStock: medicineToEdit.currentStock || 0,
        minStockLevel: medicineToEdit.minStockLevel || 10,
        maxStockLevel: medicineToEdit.maxStockLevel || 200,
        batchNumber: '',
        expiryDate: '',
        prescriptionRequired: medicineToEdit.prescriptionRequired || false,
        storageInstructions: medicineToEdit.storageInstructions || 'Store in a cool, dry place below 25°C.',
        generalUses: medicineToEdit.generalUses || '',
        generalPrecautions: medicineToEdit.generalPrecautions || '',
        sideEffects: medicineToEdit.sideEffects || '',
        warnings: medicineToEdit.warnings || ''
      });
    } else {
      setFormData({
        name: '',
        genericName: '',
        brandName: '',
        category: categories[0]?.name || 'Pain Relief',
        medicineType: 'Tablet',
        description: '',
        manufacturer: '',
        supplierId: suppliers[0]?.id || '',
        supplierName: suppliers[0]?.companyName || '',
        purchasePrice: 15.00,
        sellingPrice: 45.00,
        currentStock: 50,
        minStockLevel: 15,
        maxStockLevel: 200,
        batchNumber: `BATCH-${Date.now().toString().slice(-4)}`,
        expiryDate: '2027-12-31',
        prescriptionRequired: false,
        storageInstructions: 'Store in a cool, dry place below 25°C away from direct sunlight.',
        generalUses: '',
        generalPrecautions: '',
        sideEffects: '',
        warnings: ''
      });
    }
  }, [medicineToEdit, isOpen, categories, suppliers]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSupplierChange = (e) => {
    const supId = e.target.value;
    const supObj = suppliers.find(s => s.id === supId);
    setFormData(prev => ({
      ...prev,
      supplierId: supId,
      supplierName: supObj ? supObj.companyName : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name.trim() || !formData.genericName.trim()) {
      setErrorMsg('Medicine Name and Generic Name are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (medicineToEdit) {
        await updateMedicine(medicineToEdit.id, formData);
      } else {
        await addMedicine(formData);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save medicine');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={medicineToEdit ? `Edit Medicine (${medicineToEdit.id})` : 'Add New Medicine to Inventory'}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
            1. Basic Medicine Identification
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Medicine Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol 500mg"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Generic Name *</label>
              <input
                type="text"
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                placeholder="e.g. Acetaminophen"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="e.g. Crocin / Panadol"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Medicine Form / Type *</label>
              <select
                name="medicineType"
                value={formData.medicineType}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
              >
                {MEDICINE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g. Apex Pharma Labs"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing, Stock & Supplier */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
            2. Stock Levels, Batch & Pricing
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Purchase Price (₹)</label>
              <input
                type="number"
                step="0.01"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                step="0.01"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Stock Units</label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleChange}
                disabled={!!medicineToEdit}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 disabled:bg-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Min Stock Alert Level</label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-mono"
              />
            </div>
          </div>

          {!medicineToEdit && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  placeholder="e.g. BATCH-2026A"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Supplier</label>
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleSupplierChange}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
                >
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>{sup.companyName}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="prescriptionRequired"
              name="prescriptionRequired"
              checked={formData.prescriptionRequired}
              onChange={handleChange}
              className="w-4 h-4 text-pharmacy-600 rounded focus:ring-pharmacy-500"
            />
            <label htmlFor="prescriptionRequired" className="font-bold text-indigo-900 cursor-pointer">
              Prescription Required (Rx Only Medicine)
            </label>
          </div>
        </div>

        {/* Section 3: Safety & Health Guidance Information */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
            3. Uses, Precautions & Medical Warnings
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">General Uses</label>
              <textarea
                name="generalUses"
                value={formData.generalUses}
                onChange={handleChange}
                rows={2}
                placeholder="What symptoms or conditions is this medicine used for?"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">General Precautions</label>
              <textarea
                name="generalPrecautions"
                value={formData.generalPrecautions}
                onChange={handleChange}
                rows={2}
                placeholder="Safety instructions, food/alcohol warnings, dosage limits..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Common Side Effects</label>
              <textarea
                name="sideEffects"
                value={formData.sideEffects}
                onChange={handleChange}
                rows={2}
                placeholder="Mild side effects like nausea, dry mouth, drowsiness..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Important Safety Warnings</label>
              <textarea
                name="warnings"
                value={formData.warnings}
                onChange={handleChange}
                rows={2}
                placeholder="Red-flag symptoms, severe allergy alerts, pregnancy cautions..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-pharmacy-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-pharmacy-600 hover:bg-pharmacy-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving...' : (medicineToEdit ? 'Update Medicine' : 'Save Medicine')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
