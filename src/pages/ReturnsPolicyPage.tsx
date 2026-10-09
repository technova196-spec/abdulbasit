import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ReturnsPolicyPage: React.FC = () => {
  const { settings } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 block mb-1">
          Hassle-Free Guarantee
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Returns & Replacement Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {settings.returnWindowDays}-Day Peace of Mind Warranty for Parents
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw size={16} className="text-rose-500" />
            <span>1. 7-Day Replacement Guarantee</span>
          </h2>
          <p>
            At WonderLand Toys, we want every child to be overjoyed with their new plaything. If any toy arrives damaged, missing accessories, or with a manufacturing defect, you are eligible for an immediate replacement within <strong>{settings.returnWindowDays} days</strong> of receipt.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. How to Request a Replacement</h2>
          <ol className="list-decimal list-inside space-y-1.5 pl-2">
            <li>Take a clear photo or short video highlighting the defect or damage.</li>
            <li>Send the media along with your Order Number (e.g. WLT-829140) to our official WhatsApp support number at <strong>{settings.whatsappNumber}</strong>.</li>
            <li>Our support team will verify the claim within 2 hours.</li>
            <li>A replacement parcel will be dispatched directly to your address, and our courier rider will exchange the item at your door.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Non-Returnable Conditions</h2>
          <p>
            Items damaged due to deliberate misuse, battery leakage from improper third-party cells, or toys without original retail boxes are not eligible for complimentary replacement.
          </p>
        </section>
      </div>
    </div>
  );
};
