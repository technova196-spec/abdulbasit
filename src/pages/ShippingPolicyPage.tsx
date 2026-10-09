import React from 'react';
import { Clock, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ShippingPolicyPage: React.FC = () => {
  const { settings, formatPrice } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
          Delivery Guidelines
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Last updated: March 2026 • WonderLand Toys Pakistan
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Truck size={16} className="text-amber-500" />
            <span>1. Nationwide Coverage & Courier Partners</span>
          </h2>
          <p>
            WonderLand Toys proudly delivers to all major cities, secondary towns, and rural districts throughout Pakistan (including Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad Capital Territory, Gilgit-Baltistan, and Azad Jammu & Kashmir).
          </p>
          <p>
            We partner with reliable courier services including TCS, Leopards Express, Call Courier, and Trax to ensure timely dispatch and secure packaging.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <span>2. Delivery Transit Timelines</span>
          </h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Lahore & Islamabad/Rawalpindi:</strong> 1 to 2 working days.</li>
            <li><strong>Karachi, Faisalabad, Multan, Gujranwala, Sialkot:</strong> 2 to 3 working days.</li>
            <li><strong>Peshawar, Quetta, Sukkur, Hyderabad & Outlying Regions:</strong> 3 to 4 working days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-500" />
            <span>3. Shipping Charges & Free Delivery Threshold</span>
          </h2>
          <p>
            Orders exceeding <strong>{formatPrice(settings.freeShippingThreshold)}</strong> automatically qualify for <strong>FREE Standard Delivery</strong> across Pakistan.
          </p>
          <p>
            For orders totaling under {formatPrice(settings.freeShippingThreshold)}, a flat nominal delivery fee of <strong>{formatPrice(settings.standardShippingFee)}</strong> applies to cover courier handling and protective bubble-wrap packaging.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. Cash on Delivery (COD) Protocol</h2>
          <p>
            The courier delivery rider will contact the mobile number provided during checkout before arriving at your location. Please ensure the exact cash amount is available to avoid delivery delays.
          </p>
        </section>
      </div>
    </div>
  );
};
