import React from 'react';
import { Award, Gift, Heart, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { settings, products } = useShop();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider">
          Our Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Inspiring Play, Learning & Wonder Across Pakistan
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Founded with a passion for creative childhood development, {settings.storeName} brings high-grade educational toys, STEM robotics, magnetic sets, and cuddly buddies right to families’ doorsteps.
        </p>
      </div>

      {/* Core values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <ShieldCheck size={26} />
          </div>
          <h3 className="text-base font-black text-slate-900">Safety First Always</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every toy in our inventory passes strict non-toxic, lead-free, BPA-free compliance tests. We only stock items we would proudly give our own children.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold">
            <Sparkles size={26} />
          </div>
          <h3 className="text-base font-black text-slate-900">Learning Through Joy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From Montessori wooden boards to solar-powered robotics, our toys foster curiosity, logical deduction, and spatial problem-solving naturally.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
            <Heart size={26} />
          </div>
          <h3 className="text-base font-black text-slate-900">Family-Centric Service</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            With 100% Cash On Delivery in all Pakistani towns, fast 2-4 day dispatch, and 7-day hassle-free replacement, shopping for kids is stress-free.
          </p>
        </div>
      </div>

      {/* Stats counter */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <span className="block text-3xl sm:text-4xl font-black">24+</span>
          <span className="text-xs text-white/90 font-medium mt-1 block">Curated Toy Categories</span>
        </div>
        <div>
          <span className="block text-3xl sm:text-4xl font-black">10,000+</span>
          <span className="text-xs text-white/90 font-medium mt-1 block">Happy Children</span>
        </div>
        <div>
          <span className="block text-3xl sm:text-4xl font-black">100+</span>
          <span className="text-xs text-white/90 font-medium mt-1 block">Cities Covered</span>
        </div>
        <div>
          <span className="block text-3xl sm:text-4xl font-black">4.9/5</span>
          <span className="text-xs text-white/90 font-medium mt-1 block">Customer Satisfaction</span>
        </div>
      </div>

      <div className="text-center pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all"
        >
          <span>Explore Our Toy Catalog</span>
          <Sparkles size={16} className="text-amber-400" />
        </Link>
      </div>
    </div>
  );
};
