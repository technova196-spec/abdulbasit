import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  Gift,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Package,
  RotateCcw,
  Settings,
  ShoppingBag,
  Tag,
  X,
} from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';

export const AdminLayout: React.FC = () => {
  const { settings, refreshData, addToast } = useShop();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleResetData = () => {
    StorageService.resetAllData();
    refreshData();
    setShowResetModal(false);
    addToast('Demo data reset back to factory defaults!', 'info');
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: <LayoutDashboard size={18} />, end: true },
    { name: 'Products Catalog', path: '/admin/products', icon: <Boxes size={18} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Package size={18} /> },
    { name: 'Customer Orders', path: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { name: 'Promo Coupons', path: '/admin/coupons', icon: <Tag size={18} /> },
    { name: 'Product Reviews', path: '/admin/reviews', icon: <MessageSquare size={18} /> },
    { name: 'Store Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* TOP NOTIFICATION FOR DEMO ADMIN */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-slate-300">
            <strong>Admin Demo Portal:</strong> Running locally with persistent browser LocalStorage. Changes affect your current preview.
          </span>
          <Link
            to="/"
            className="ml-auto text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0"
          >
            <ArrowLeft size={12} />
            <span>Customer Storefront</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-1">
        {/* SIDEBAR FOR DESKTOP */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 shrink-0">
          <div className="pb-6 pt-2 px-2 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Gift size={20} />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  {settings.storeName}
                </span>
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
                  Store Management
                </span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Demo Data</span>
            </button>

            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              <span>View Live Store</span>
              <ArrowLeft size={13} className="rotate-180" />
            </Link>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 bg-slate-900 text-slate-300 p-4 h-full flex flex-col z-10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Gift size={20} className="text-amber-500" />
                  <span className="font-bold text-white text-sm">Admin Control</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setShowResetModal(true);
                  }}
                  className="w-full py-2 bg-slate-800 text-xs font-bold rounded-xl text-rose-400 cursor-pointer"
                >
                  Reset Demo Data
                </button>
                <Link
                  to="/"
                  className="w-full block text-center py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Storefront
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MAIN ADMIN WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Admin Header Bar */}
          <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                aria-label="Toggle navigation"
              >
                <Menu size={22} />
              </button>
              <h2 className="text-base font-extrabold text-slate-800">
                WonderLand Toys Administration
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Demo</span>
              </button>
              <Link
                to="/"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-2xs"
              >
                View Store
              </Link>
            </div>
          </header>

          {/* Child Page Content */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setShowResetModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-black text-slate-900 text-center">Reset All Demo Data?</h3>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              This will restore all default 24 toy products, stock counts, original categories, and clear local demo orders.
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
