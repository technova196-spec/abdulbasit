import React from 'react';
import { Shield } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
          Data Protection
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: March 2026 • {settings.storeName}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield size={16} className="text-emerald-500" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            When you browse WonderLand Toys, place an order, or subscribe to our newsletter, we only collect the minimum information necessary to process your delivery: your recipient name, Pakistani phone number, delivery address, and optional email.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Local Demo Environment & Data Privacy</h2>
          <p>
            In this browser application environment, your order data, wishlist, cart, and reviews are stored locally in your browser's Local Storage. We do not sell or monetize personal customer records to third-party ad networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Courier Sharing</h2>
          <p>
            In production fulfillment, contact numbers and delivery addresses are provided strictly to logistics riders (TCS, Leopards, Call Courier) for the express purpose of delivering your parcel.
          </p>
        </section>
      </div>
    </div>
  );
};
