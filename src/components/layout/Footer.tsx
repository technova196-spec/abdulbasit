import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Gift,
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';

export const Footer: React.FC = () => {
  const { settings, categories, addToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }

    const res = StorageService.subscribeNewsletter(newsletterEmail);
    if (res) {
      setSubscribed(true);
      addToast('Thank you for subscribing to Wonderland Toys club! 🎁', 'success');
      setNewsletterEmail('');
    } else {
      addToast('You are already subscribed with this email!', 'info');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t-4 border-amber-500">
      {/* HIGHLIGHT VALUES BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash On Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Pay safely at your doorstep in all cities & towns across Pakistan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Child-Safe Toys</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Certified non-toxic, BPA-free plastics, and smooth-edged safety guarantee.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast 2-4 Days Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Tracked shipping via leading courier partners with SMS notifications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Gift size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Hassle-free replacement for defective items within 7 working days.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Gift size={22} />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                {settings.storeName}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Pakistan’s favourite wonderland of educational STEM kits, creative building blocks, high-speed remote control cars, and plush cuddle buddies. Designed to spark wonder, curiosity, and boundless play in children of all ages.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <MapPin size={15} className="text-amber-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                <span>Customer Care: <strong className="text-slate-200">{settings.phone}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-sky-400 shrink-0" />
                <span>Email Support: <strong className="text-slate-200">{settings.email}</strong></span>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Toy Categories</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="text-amber-400 hover:underline font-semibold block pt-1">
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Customer Care */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/track-order" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-amber-400 transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-amber-400 transition-colors">
                  FAQs & Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-amber-400 transition-colors">
                  Shipping & COD Terms
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-amber-400 transition-colors">
                  Returns & Replacement
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  Our Story & Mission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">VIP Kids Club</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Subscribe to unlock exclusive discounts, birthday surprise coupon codes, and new toy drops!
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>You're subscribed! Use coupon <strong>TOY10</strong>.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg cursor-pointer transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send size={13} />
                  </button>
                </div>
                <span className="block text-[11px] text-slate-500">
                  No spam ever. Unsubscribe anytime.
                </span>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                We Gladly Accept
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-bold text-amber-300 border border-slate-700">
                  Cash On Delivery (COD)
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700">
                  Bank Transfer
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700">
                  EasyPaisa / JazzCash
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM LEGAL & DEMO NOTICE */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <span>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link to="/admin" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
              Admin Portal (Demo)
            </Link>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right max-w-md">
            <span>Crafted with</span> <Heart size={11} className="inline text-rose-500 mx-0.5 fill-rose-500" /> <span>for imaginative kids and happy parents nationwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
