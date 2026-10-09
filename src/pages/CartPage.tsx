import React, { useState } from 'react';
import {
  ArrowRight,
  Gift,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    couponDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingRemaining,
    isFreeShipping,
    settings,
    formatPrice,
  } = useShop();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Looks like you haven't added any wonderful toys yet. Explore our bestsellers, educational kits, and new arrivals!
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Start Shopping Toys</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Free shipping percentage progress
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeShippingThreshold) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({cart.reduce((t, i) => t + i.quantity, 0)} Items)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your selected toys and proceed to Cash on Delivery checkout.
          </p>
        </div>

        <button
          onClick={() => setShowClearModal(true)}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 size={14} />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* FREE SHIPPING PROGRESS BAR */}
      <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold text-amber-950">
          <span className="flex items-center gap-2">
            <Truck size={16} className="text-amber-600" />
            {isFreeShipping ? (
              <span className="text-emerald-700 font-extrabold">
                🎉 Congratulations! You unlocked FREE Standard Shipping across Pakistan!
              </span>
            ) : (
              <span>
                Add <strong className="text-orange-600">{formatPrice(freeShippingRemaining)}</strong> more to get FREE Delivery!
              </span>
            )}
          </span>
          <span className="text-[11px] text-amber-800">{freeShippingProgress}%</span>
        </div>
        <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* MAIN TWO-COLUMN CART LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item List (Left Column) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => {
              const unitPrice = item.product.salePrice ?? item.product.price;
              const lineTotal = unitPrice * item.quantity;
              const maxStock = item.product.stock;

              return (
                <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Title and details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                      <span className="font-bold text-amber-600 uppercase">{item.product.brand}</span>
                      <span>•</span>
                      <span>{item.product.ageRecommendation}</span>
                    </div>

                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-bold text-slate-900">
                        {formatPrice(unitPrice)}
                      </span>
                      {item.product.salePrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatPrice(item.product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center font-bold text-xs text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right min-w-20">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {formatPrice(lineTotal)}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
            >
              ← Continue Shopping Toys
            </Link>
          </div>
        </div>

        {/* Order Summary Box (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Promo Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Have a Promo Coupon?</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="e.g. TOY10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 outline-hidden font-mono"
                  />
                  <Tag size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
              )}

              {appliedCoupon && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Gift size={14} className="text-emerald-600" />
                    <span>
                      Coupon <strong className="font-mono">{appliedCoupon.code}</strong> applied!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 text-emerald-600 hover:text-emerald-900 cursor-pointer"
                    title="Remove coupon"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </form>

            {/* Demo Coupon helper hints */}
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
              <span className="font-bold block">Available Demo Coupons:</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <button
                  onClick={() => applyCoupon('TOY10')}
                  className="px-2 py-0.5 rounded bg-white font-mono font-bold text-amber-800 border border-amber-300 shadow-2xs hover:bg-amber-100 cursor-pointer"
                >
                  TOY10 (10% off)
                </button>
                <button
                  onClick={() => applyCoupon('WELCOME200')}
                  className="px-2 py-0.5 rounded bg-white font-mono font-bold text-amber-800 border border-amber-300 shadow-2xs hover:bg-amber-100 cursor-pointer"
                >
                  WELCOME200 (Rs. 200 off)
                </button>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Standard Shipping</span>
                <span className="font-bold text-slate-900">
                  {cartShippingFee === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    formatPrice(cartShippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-lg text-orange-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Proceed to Checkout button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Proceed to Checkout (COD)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CLEAR CART CONFIRMATION MODAL */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowClearModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Clear Shopping Cart?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove all {cart.length} items from your shopping cart? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Keep Items
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearModal(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-bold text-white cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
