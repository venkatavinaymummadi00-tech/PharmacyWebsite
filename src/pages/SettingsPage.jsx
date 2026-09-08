import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Building, Lock } from 'lucide-react';

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    pharmacyName: 'PharmaCare Pharmacy Ltd.',
    address: '100 Healthcare Way, Suite 400, Metro City',
    phone: '+1 (800) 555-PHARMA',
    email: 'info@pharmacare.com',
    licenseNo: 'PH-98241-USA',
    taxId: '88-3921049',
    currencySymbol: '₹',
    enableOnlineOrders: true,
    requireRxVerification: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-pharmacy-600" /> System Settings & Pharmacy Branding
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure pharmacy business details, tax rates, e-commerce storefront switches, and prescription rules.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 text-xs">
        {/* Pharmacy Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building className="w-4 h-4 text-pharmacy-600" /> Pharmacy Business Profile & Invoice Headers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pharmacy Name</label>
              <input
                type="text"
                value={settings.pharmacyName}
                onChange={(e) => setSettings({ ...settings, pharmacyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">License Number</label>
              <input
                type="text"
                value={settings.licenseNo}
                onChange={(e) => setSettings({ ...settings, licenseNo: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tax ID / GST</label>
              <input
                type="text"
                value={settings.taxId}
                onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pharmacy Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        {/* Operational Toggles */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Lock className="w-4 h-4 text-pharmacy-600" /> Safety & Storefront Workflow Rules
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-800 block">Enable Online Customer Storefront</span>
                <span className="text-slate-500 text-[11px]">Allow customers to browse catalog and place orders</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableOnlineOrders}
                onChange={(e) => setSettings({ ...settings, enableOnlineOrders: e.target.checked })}
                className="w-5 h-5 text-pharmacy-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-800 block">Mandatory Doctor Prescription Verification</span>
                <span className="text-slate-500 text-[11px]">Require pharmacist approval before dispensing Rx medicines</span>
              </div>
              <input
                type="checkbox"
                checked={settings.requireRxVerification}
                onChange={(e) => setSettings({ ...settings, requireRxVerification: e.target.checked })}
                className="w-5 h-5 text-pharmacy-600 rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};
