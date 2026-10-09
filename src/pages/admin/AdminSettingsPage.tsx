import React, { useState } from 'react';
import { RotateCcw, Save, Settings } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';
import { StoreSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettingsState, refreshData, addToast } = useShop();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsState(formData);
  };

  const handleResetData = () => {
    StorageService.resetAllData();
    refreshData();
    setFormData(StorageService.getSettings());
    setShowResetModal(false);
    addToast('Demo data and settings reset to factory defaults!', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Store Configuration & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Update store branding, shipping charges, free delivery minimums, and WhatsApp support.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-xs">
        {/* Brand Information */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Logo Text Brand</label>
              <input
                type="text"
                value={formData.logoText}
                onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
            />
          </div>
        </div>

        {/* Contact & Support */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Contact & WhatsApp Support
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official WhatsApp (Intl Format)</label>
              <input
                type="text"
                placeholder="+923001234567"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Store Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
            />
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Shipping & Free Delivery Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Shipping Fee (PKR)</label>
              <input
                type="number"
                min={0}
                value={formData.standardShippingFee}
                onChange={(e) => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Free Shipping Threshold (PKR)</label>
              <input
                type="number"
                min={0}
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Delivery Days</label>
              <input
                type="text"
                value={formData.estimatedDeliveryDays}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryDays: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Top Announcement Bar
          </h3>

          <div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 mb-2">
              <input
                type="checkbox"
                checked={formData.announcementEnabled}
                onChange={(e) => setFormData({ ...formData, announcementEnabled: e.target.checked })}
                className="rounded text-amber-500"
              />
              <span>Display Promotion Banner at Top of Store</span>
            </label>

            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold cursor-pointer"
          >
            Reset All Store Demo Data
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save size={15} />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setShowResetModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-black text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will restore the original 24 products, default categories, default coupons, and reset the store settings.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
