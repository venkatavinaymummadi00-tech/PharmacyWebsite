import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { Modal } from '../components/ui/Modal';
import { FileText, PlusCircle, Pill } from 'lucide-react';

export const CategoriesPage = () => {
  const { categories, addCategory, medicines } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await addCategory(formData);
    setFormData({ name: '', description: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-pharmacy-600" /> Medicine Categories Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic category configuration for therapy areas, OTC classifications, and medical supply types.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = medicines.filter((m) => m.category.toLowerCase() === cat.name.toLowerCase()).length;
          return (
            <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex justify-between items-start">
                <span className="p-2 rounded-xl bg-pharmacy-50 text-pharmacy-600 font-bold">
                  <Pill className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 text-[11px] font-extrabold bg-slate-100 text-slate-700 rounded-full">
                  {count} SKUs
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{cat.description || 'No description added.'}</p>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Medicine Category">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Pain Relief, Dermatological"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Therapy area details, common indications..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 font-bold bg-pharmacy-600 text-white rounded-xl shadow-md">
              Create Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
