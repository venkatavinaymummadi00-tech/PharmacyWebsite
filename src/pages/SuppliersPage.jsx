import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Users, PlusCircle, Phone, Mail, MapPin, FileText, Trash2, Edit } from 'lucide-react';

export const SuppliersPage = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = usePharmacy();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSup, setEditingSup] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstTaxId: '',
  });

  const handleOpenAdd = () => {
    setEditingSup(null);
    setFormData({ companyName: '', contactPerson: '', phone: '', email: '', address: '', gstTaxId: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setEditingSup(sup);
    setFormData({
      companyName: sup.companyName,
      contactPerson: sup.contactPerson,
      phone: sup.phone,
      email: sup.email,
      address: sup.address,
      gstTaxId: sup.gstTaxId || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingSup) {
      await updateSupplier(editingSup.id, formData);
    } else {
      await addSupplier(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteSupplier(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-pharmacy-600" /> Supplier Directory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage pharmaceutical wholesalers, contact details, GST/Tax information, and purchase histories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Add New Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-slate-400 font-bold">{sup.id}</span>
                <h3 className="font-bold text-slate-900 text-base">{sup.companyName}</h3>
                <p className="text-xs text-slate-500 font-medium">Contact: {sup.contactPerson}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenEdit(sup)}
                  className="p-1.5 text-slate-400 hover:text-pharmacy-600 hover:bg-slate-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(sup.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs space-y-1.5 pt-2">
              <div className="pt-1 flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-pharmacy-600 shrink-0" />
                <span>{sup.phone}</span>
              </div>
              <div className="pt-1 flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-pharmacy-600 shrink-0" />
                <span>{sup.email}</span>
              </div>
              <div className="pt-1 flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-pharmacy-600 shrink-0" />
                <span>{sup.address}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Purchases</span>
                <span className="font-mono font-bold text-slate-900">₹{sup.totalPurchases?.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Last Purchase</span>
                <span className="font-mono font-semibold text-slate-700">{sup.lastPurchaseDate || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSup ? 'Edit Supplier' : 'Add New Supplier'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">GST / Tax ID</label>
              <input
                type="text"
                value={formData.gstTaxId}
                onChange={(e) => setFormData({ ...formData, gstTaxId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message="Are you sure you want to remove this supplier entry?"
      />
    </div>
  );
};
