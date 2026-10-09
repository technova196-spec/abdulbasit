import React from 'react';
import { useShop } from '../context/ShopContext';

export const TermsPage: React.FC = () => {
  const { settings } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
          Store Agreement
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: March 2026 • {settings.storeName}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing {settings.storeName} and placing orders through our website, you agree to abide by all purchasing policies, safety notices, and delivery conditions stated on our platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Pricing & Currency</h2>
          <p>
            All listed prices are denominated in Pakistani Rupees (PKR) and include standard local packaging. In the event of an inadvertent technical typographical error on price, we reserve the right to rectify pricing prior to order confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Age Appropriateness & Supervision</h2>
          <p>
            Each toy features suggested age recommendations for developmental guidance. Certain toys contain small marbles, magnets, or intricate pieces that require adult supervision for children under 3 years of age.
          </p>
        </section>
      </div>
    </div>
  );
};
