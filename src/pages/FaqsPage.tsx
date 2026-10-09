import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    category: 'Orders & Payments',
    q: 'How does Cash on Delivery (COD) work?',
    a: 'When you place an order with COD, you do not need to pay anything upfront. Your parcel is shipped via registered courier, and you hand over the exact cash total to the delivery rider once the package is delivered to your address.',
  },
  {
    category: 'Orders & Payments',
    q: 'Can I cancel or change an order after placing it?',
    a: 'Yes! As long as the order status is "Pending" or "Confirmed", you can cancel it directly through our Track Order page or contact us on WhatsApp with your Order ID.',
  },
  {
    category: 'Shipping & Delivery',
    q: 'How long will delivery take to my city?',
    a: 'Deliveries to Lahore, Islamabad, and Rawalpindi typically take 1 to 2 business days. For Karachi, Faisalabad, Multan, Peshawar, and other nationwide destinations, parcels arrive within 2 to 4 business days.',
  },
  {
    category: 'Shipping & Delivery',
    q: 'What is the shipping cost?',
    a: 'We offer FREE Standard Delivery across Pakistan on all orders over Rs. 3,500. For orders under Rs. 3,500, a flat shipping fee of Rs. 250 is applied at checkout.',
  },
  {
    category: 'Safety & Quality',
    q: 'Are your toys safe for toddlers and infants?',
    a: 'Absolutely. We curate toys manufactured from non-toxic, food-grade silicone, high-grade BPA-free ABS plastic, and splinter-free New Zealand pine wood. All items carry international child safety certifications (EN71, ASTM).',
  },
  {
    category: 'Returns & Replacement',
    q: 'What if an item arrives broken, defective, or missing pieces?',
    a: 'We provide an unconditional 7-Day Replacement Warranty. Simply take a quick photo or video of the issue and send it to our WhatsApp support team. We will dispatch a brand new replacement immediately at zero extra cost to you.',
  },
];

export const FaqsPage: React.FC = () => {
  const { settings } = useShop();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider">
          Help Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Quick answers regarding orders, Cash on Delivery in Pakistan, shipping transit, and our 7-day replacement warranty.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs divide-y divide-slate-100">
        {FAQS_DATA.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm text-slate-900 hover:text-amber-600 transition-colors cursor-pointer py-1"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pt-2 text-xs text-slate-600 leading-relaxed animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="p-8 rounded-3xl bg-amber-50/70 border border-amber-200/70 text-center space-y-3">
        <h3 className="text-base font-black text-slate-900">Still have a question?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Our customer service team is always happy to assist with toy recommendations or special order requirements.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
};
