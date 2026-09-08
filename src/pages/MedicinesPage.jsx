import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MedicineDetailModal } from '../components/medicine/MedicineDetailModal';
import { MedicineFormModal } from '../components/medicine/MedicineFormModal';
import { StockInModal } from '../components/stock/StockInModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  Pill,
  Search,
  Filter,
  PlusCircle,
  PackagePlus,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const MedicinesPage = () => {
  const { medicines, categories, deleteMedicine, loading } = usePharmacy();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [detailMedicine, setDetailMedicine] = useState(null);
  const [editMedicine, setEditMedicine] = useState(null);
  const [stockInMed, setStockInMed] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch =
        !searchTerm.trim() ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = !selectedCategory || m.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchType = !selectedType || m.medicineType.toLowerCase() === selectedType.toLowerCase();

      let matchStatus = true;
      if (selectedStatus === 'Low Stock') matchStatus = m.status === 'Low Stock';
      else if (selectedStatus === 'Out of Stock') matchStatus = m.status === 'Out of Stock';
      else if (selectedStatus === 'Available') matchStatus = m.status === 'Available';
      else if (selectedStatus === 'Rx Only') matchStatus = m.prescriptionRequired;

      return matchSearch && matchCat && matchType && matchStatus;
    });
  }, [medicines, searchTerm, selectedCategory, selectedType, selectedStatus]);

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteMedicine(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-pharmacy-600" /> Medicine Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete database of active pharmaceutical catalog, stock levels, pricing in Indian Rupees (₹), and batch controls.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add New Medicine
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, generic, brand, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-pharmacy-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-pharmacy-500 font-medium"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Medicine Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-pharmacy-500 font-medium"
            >
              <option value="">All Medicine Types</option>
              {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Powder', 'Inhaler', 'Medical Device'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-pharmacy-500 font-medium"
            >
              <option value="">All Stock Statuses</option>
              <option value="Available">In Stock Only</option>
              <option value="Low Stock">Low Stock Alert</option>
              <option value="Out of Stock">Out of Stock (0 units)</option>
              <option value="Rx Only">Prescription (Rx) Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>Showing <strong>{filteredMedicines.length}</strong> of {medicines.length} total medicines</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Medicine Details</th>
                <th className="py-3 px-4">Category & Type</th>
                <th className="py-3 px-4 text-right">Price (₹)</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                    <Pill className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="font-bold text-sm">No matching medicines found</p>
                    <p className="text-xs">Try clearing search filters or add a new medicine.</p>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500 text-[11px]">{med.id}</td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {med.name}
                        {med.prescriptionRequired && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-indigo-100 text-indigo-700 font-extrabold rounded flex items-center gap-0.5">
                            <FileText className="w-3 h-3" /> Rx
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{med.genericName} • <span className="text-slate-400">{med.brandName}</span></div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{med.category}</div>
                      <div className="text-[11px] text-slate-400">{med.medicineType}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-slate-900 font-mono">₹{med.sellingPrice.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Cost: ₹{med.purchasePrice.toFixed(2)}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono font-bold text-sm ${med.currentStock === 0 ? 'text-rose-600' : (med.currentStock <= med.minStockLevel ? 'text-amber-600' : 'text-emerald-700')}`}>
                        {med.currentStock}
                      </span>
                      <div className="text-[10px] text-slate-400">Min: {med.minStockLevel}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={med.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailMedicine(med)}
                          title="View Specifications"
                          className="p-1.5 text-slate-500 hover:text-pharmacy-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStockInMed(med)}
                          title="Record Stock In"
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <PackagePlus className="w-4 h-4 text-teal-600" />
                        </button>
                        <button
                          onClick={() => setEditMedicine(med)}
                          title="Edit Medicine"
                          className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(med.id)}
                          title="Delete Medicine"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <MedicineDetailModal isOpen={!!detailMedicine} onClose={() => setDetailMedicine(null)} medicine={detailMedicine} />
      <MedicineFormModal isOpen={isAddOpen || !!editMedicine} onClose={() => { setIsAddOpen(false); setEditMedicine(null); }} medicineToEdit={editMedicine} />
      <StockInModal isOpen={!!stockInMed} onClose={() => setStockInMed(null)} selectedMedicine={stockInMed} />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Medicine Record"
        message="Are you sure you want to delete this medicine? All associated batch logs will be removed."
      />
    </div>
  );
};
