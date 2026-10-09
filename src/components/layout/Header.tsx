import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Gift,
  Heart,
  Menu,
  Phone,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

export const Header: React.FC = () => {
  const {
    settings,
    categories,
    products,
    cartItemCount,
    wishlistItemCount,
    formatPrice,
  } = useShop();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Search suggestions
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const query = searchQuery.toLowerCase().trim();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      )
      .slice(0, 6);
  }, [searchQuery, products]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const selectSearchResult = (product: Product) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(`/product/${product.slug}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      {settings.announcementEnabled && announcementVisible && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white text-xs sm:text-sm font-medium py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto text-center font-medium tracking-wide">
              <Sparkles size={14} className="animate-spin text-amber-200 hidden sm:inline" />
              <span>{settings.announcementText}</span>
            </div>
            <button
              onClick={() => setAnnouncementVisible(false)}
              className="text-white/80 hover:text-white p-0.5 rounded cursor-pointer"
              aria-label="Close banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. SECONDARY UTILITY BAR (DESKTOP) */}
      <div className="hidden lg:block bg-slate-50/80 border-b border-slate-100/80 text-xs text-slate-500 py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Truck size={13} className="text-amber-500" />
              Cash On Delivery Across Pakistan • Fast 2-4 Days Shipping
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-emerald-500" />
              Helpline: <strong className="text-slate-700">{settings.phone}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/track-order" className="hover:text-amber-600 transition-colors flex items-center gap-1">
              <Truck size={13} />
              Track Order
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/orders" className="hover:text-amber-600 transition-colors">
              Order History
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px] hover:bg-amber-200 transition-colors"
            >
              <Settings size={11} />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-amber-600 rounded-lg focus:outline-hidden cursor-pointer"
            aria-label="Open mobile navigation menu"
          >
            <Menu size={24} />
          </button>

          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-pink-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Gift size={22} className="group-hover:rotate-6 transition-transform" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-amber-800 to-orange-600 bg-clip-text text-transparent">
                {settings.logoText || 'WonderLand'}
              </span>
              <span className="block text-[10px] tracking-wider uppercase font-bold text-amber-500 -mt-1">
                Toys Pakistan
              </span>
            </div>
          </Link>

          {/* SEARCH BAR WITH LIVE AUTOCOMPLETE */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search educational toys, RC cars, Lego blocks, dolls..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-11 pr-24 py-2.5 rounded-full bg-slate-100/90 border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-400 focus:ring-3 focus:ring-amber-400/20 transition-all outline-hidden"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs rounded-full shadow-xs transition-all cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* LIVE AUTOCOMPLETE DROPDOWN */}
            {showSearchDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>Matching Toys ({searchResults.length})</span>
                      <span>Press enter to view all</span>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => selectSearchResult(item)}
                          className="flex items-center gap-3 p-3 hover:bg-amber-50/60 cursor-pointer transition-colors"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-orange-600">
                                {formatPrice(item.salePrice ?? item.price)}
                              </span>
                              {item.salePrice && (
                                <span className="text-[11px] text-slate-400 line-through">
                                  {formatPrice(item.price)}
                                </span>
                              )}
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {item.ageRecommendation}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold text-center block transition-colors cursor-pointer border-t border-amber-100"
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No toys found matching "<span className="font-semibold text-slate-700">{searchQuery}</span>". Try
                    another keyword or category.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS (WISHLIST, CART, TRACK) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-700 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={22} className={wishlistItemCount > 0 ? 'text-rose-500 fill-rose-500' : ''} />
              {wishlistItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-scale">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart Link / Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2.5 px-3 py-2 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/70 rounded-2xl transition-all shadow-xs cursor-pointer group"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag size={21} className="text-amber-600 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-amber-950">Cart</span>
            </Link>
          </div>
        </div>

        {/* 4. HORIZONTAL CATEGORIES BAR (DESKTOP) */}
        <div className="hidden lg:flex items-center justify-between border-t border-slate-100 mt-3 pt-2 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1">
            {/* Categories Dropdown Button */}
            <div ref={categoryMenuRef} className="relative">
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl hover:bg-amber-600 transition-colors cursor-pointer shadow-xs"
              >
                <span>All Toy Categories</span>
                <ChevronDown size={14} className={`transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 divide-y divide-slate-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setCategoryMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-amber-50 hover:text-amber-700 transition-colors text-slate-700 text-xs font-medium"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {products.filter((p) => p.category === cat.slug).length} items
                      </span>
                    </Link>
                  ))}
                  <Link
                    to="/shop"
                    onClick={() => setCategoryMenuOpen(false)}
                    className="block text-center py-2 text-xs font-bold text-amber-600 hover:bg-amber-50"
                  >
                    View All 12 Categories →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <Link to="/" className="px-3 py-1.5 hover:text-amber-600 rounded-lg transition-colors">
              Home
            </Link>
            <Link to="/shop" className="px-3 py-1.5 hover:text-amber-600 rounded-lg transition-colors">
              Shop All Toys
            </Link>
            <Link
              to="/shop?filter=featured"
              className="px-3 py-1.5 hover:text-amber-600 rounded-lg transition-colors flex items-center gap-1 text-orange-600 font-bold"
            >
              <Sparkles size={13} />
              Hot Picks & Offers
            </Link>
            <Link to="/category/educational-toys" className="px-3 py-1.5 hover:text-amber-600 rounded-lg transition-colors">
              Educational Toys
            </Link>
            <Link to="/category/building-blocks" className="px-3 py-1.5 hover:text-amber-600 rounded-lg transition-colors">
              Building Blocks
            </Link>
            <Link to="/category/remote-control-cars" className="px-3 py-1.5 hover:text-amber-600 rounded-lg transition-colors">
              RC Cars
            </Link>
            <Link to="/about" className="px-3 py-1.5 hover:text-amber-600 rounded-lg transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="px-3 py-1.5 hover:text-amber-600 rounded-lg transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-medium text-xs">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Free shipping over {formatPrice(settings.freeShippingThreshold)}
            </span>
          </div>
        </div>
      </div>

      {/* 5. MOBILE SEARCH BAR (VISIBLE ON SMALL SCREENS) */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search all toys, brands, age..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-500 text-white font-bold text-[11px] rounded-lg"
          >
            Go
          </button>
        </form>
      </div>

      {/* 6. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Mobile Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift size={20} />
                <span className="font-extrabold text-base">{settings.storeName}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="p-4 space-y-4">
              <div>
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</h5>
                <div className="space-y-1">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 rounded-xl"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 rounded-xl"
                  >
                    Shop All Toys ({products.length})
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 rounded-xl"
                  >
                    <span>My Wishlist</span>
                    {wishlistItemCount > 0 && (
                      <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {wishlistItemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 rounded-xl"
                  >
                    <span>Shopping Cart</span>
                    {cartItemCount > 0 && (
                      <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 rounded-xl"
                  >
                    Track Order Status
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 rounded-xl"
                  >
                    Customer Order History
                  </Link>
                </div>
              </div>

              <div>
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Toy Categories</h5>
                <div className="grid grid-cols-1 gap-1">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/category/${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-amber-700 hover:bg-amber-50/50 rounded-lg flex items-center justify-between"
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {products.filter((p) => p.category === c.slug).length}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Information</h5>
                <div className="space-y-1">
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    About Wonderland Toys
                  </Link>
                  <Link
                    to="/faqs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Frequently Asked Questions
                  </Link>
                  <Link
                    to="/shipping-policy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Shipping & Delivery Policy
                  </Link>
                  <Link
                    to="/returns-policy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Returns & Refunds
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  <Settings size={14} />
                  Admin Control Panel (Demo)
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
