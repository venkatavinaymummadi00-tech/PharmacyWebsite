import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { useCart } from '../context/CartContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MedicineDetailModal } from '../components/medicine/MedicineDetailModal';
import { CartDrawer } from '../components/cart/CartDrawer';
import {
  Store,
  Search,
  Filter,
  ShoppingCart,
  Eye,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CustomerStorePage = () => {
  const { medicines, categories } = usePharmacy();
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [detailMed, setDetailMed] = useState(null);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch =
        !searchTerm.trim() ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.brandName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = !selectedCategory || m.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchType = !selectedType || m.medicineType.toLowerCase() === selectedType.toLowerCase();

      return matchSearch && matchCat && matchType;
    });
  }, [medicines, searchTerm, selectedCategory, selectedType]);

  return (
    <div className="space-y-6">
      {/* Store Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-pharmacy-800 to-emerald-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 bg-white/20 text-teal-200 rounded-full font-bold text-xs uppercase tracking-wider">
            Verified Pharmacy Storefront
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Browse Quality Medications & Healthcare Products
          </h1>
          <p className="text-xs text-teal-100/90 leading-relaxed">
            Order prescription and over-the-counter medicines online with certified pharmacist verification and safe home delivery.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/20 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4" /> 100% Genuine Certified Stock
          </div>
          <div className="text-slate-200">Express Local Pharmacy Delivery</div>
          <div className="text-slate-200 font-mono text-[11px]">Pharmacist Support Available</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by medicine name, generic name, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-pharmacy-500 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-pharmacy-500"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-pharmacy-500"
            >
              <option value="">All Medicine Types</option>
              {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Powder', 'Inhaler', 'Medical Device'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMedicines.map((med) => {
          const isOut = med.currentStock === 0;
          return (
            <div
              key={med.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold text-[10px]">
                    {med.category}
                  </span>
                  <StatusBadge status={med.status} />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center justify-between gap-1">
                    {med.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{med.genericName}</p>
                </div>

                {med.prescriptionRequired && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold">
                    <FileText className="w-3 h-3" /> Rx Prescription Required
                  </div>
                )}

                <p className="text-xs text-slate-600 line-clamp-2">{med.generalUses || med.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Price</span>
                  <span className="text-lg font-black text-pharmacy-700 font-mono">₹{med.sellingPrice.toFixed(2)}</span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setDetailMed(med)}
                    className="p-2 text-slate-500 hover:text-pharmacy-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    title="View Details & Safety Info"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addToCart(med, 1)}
                    disabled={isOut}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
                      isOut
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-pharmacy-600 hover:bg-pharmacy-700 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MedicineDetailModal isOpen={!!detailMed} onClose={() => setDetailMed(null)} medicine={detailMed} />
      <CartDrawer />
    </div>
  );
};
