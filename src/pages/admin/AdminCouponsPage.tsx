import React, { useState } from 'react';
import { PlusCircle, Tag, Trash2, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';
import { Coupon } from '../../types';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, formatPrice, refreshData, addToast } = useShop();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 2000,
    expiresAt: '2026-12-31',
    usageLimit: 500,
    description: '',
    isActive: true,
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code?.trim()) {
      addToast('Please specify a coupon code.', 'error');
      return;
    }

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType as any,
      discountValue: Number(formData.discountValue) || 10,
      minOrderAmount: Number(formData.minOrderAmount) || 0,
      expiresAt: new Date(formData.expiresAt || '2026-12-31').toISOString(),
      usageLimit: Number(formData.usageLimit) || 100,
      timesUsed: 0,
      isActive: true,
      description:
        formData.description?.trim() ||
        `${formData.discountValue}${formData.discountType === 'percentage' ? '%' : ' Rs.'} discount on orders over Rs. ${formData.minOrderAmount}`,
    };

    StorageService.saveCoupon(newCoupon);
    refreshData();
    setShowCreateModal(false);
    addToast(`Coupon "${newCoupon.code}" created successfully!`, 'success');
  };

  const handleToggleActive = (coup: Coupon) => {
    const updated = { ...coup, isActive: !coup.isActive };
    StorageService.saveCoupon(updated);
    refreshData();
    addToast(`Coupon "${coup.code}" is now ${updated.isActive ? 'Active' : 'Disabled'}.`, 'info');
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    StorageService.deleteCoupon(id);
    refreshData();
    addToast(`Coupon "${code}" deleted.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Promotions & Coupons ({coupons.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure percentage and fixed discounts, minimum cart values, and usage limits.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Promo Code</th>
                <th className="py-3 px-4 font-bold">Discount</th>
                <th className="py-3 px-4 font-bold">Min Order</th>
                <th className="py-3 px-4 font-bold">Times Used / Limit</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-black text-sm text-slate-900 flex items-center gap-2">
                      <Tag size={14} className="text-amber-500" />
                      <span>{c.code}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{c.description}</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-800">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `Rs. ${c.discountValue} Off`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {formatPrice(c.minOrderAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-bold text-slate-800">{c.timesUsed}</span> / {c.usageLimit}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                        c.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteCoupon(c.id, c.code)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete coupon"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE COUPON MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Create New Coupon</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TOY25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR (Rs.)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Order Amount (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Banner Text</label>
                <input
                  type="text"
                  placeholder="e.g. 10% discount on all family orders"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
