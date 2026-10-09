import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { StorageService } from '../services/storage';
import { CustomerDetails, Order } from '../types';

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

const POPULAR_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Other City',
];

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    couponDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    settings,
    formatPrice,
    addToast,
    refreshData,
  } = useShop();

  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    province: 'Punjab',
    city: 'Lahore',
    area: '',
    streetAddress: '',
    postalCode: '',
    deliveryInstructions: '',
  });

  const [paymentMethod] = useState<'Cash on Delivery'>('Cash on Delivery');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Add toys to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Pakistani phone validation: 03XXXXXXXXX or +923XXXXXXXXX
  const validatePhone = (phoneStr: string): boolean => {
    const clean = phoneStr.replace(/[\s-]/g, '');
    const regex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;
    return regex.test(clean);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full recipient name (min 3 characters).';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for delivery courier SMS & call.';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Pakistani phone number (e.g. 0300 1234567).';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please select your delivery city.';
    }

    if (!formData.area.trim() || formData.area.trim().length < 3) {
      newErrors.area = 'Please specify your area, neighborhood, or sector (e.g. DHA Phase 5).';
    }

    if (!formData.streetAddress.trim() || formData.streetAddress.trim().length < 6) {
      newErrors.streetAddress = 'Please provide complete house number, street, or building.';
    }

    if (!agreedTerms) {
      newErrors.terms = 'Please accept the terms and conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please complete all required shipping fields properly.', 'error');
      return;
    }

    setSubmitting(true);

    // Calculate delivery date (today + 3 days)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const estDateFormatted = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const uniqueOrderNumber = `WLT-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: uniqueOrderNumber,
      date: new Date().toISOString(),
      customer: { ...formData },
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        productSalePrice: item.product.salePrice,
        image: item.product.images[0],
        quantity: item.quantity,
        lineTotal: (item.product.salePrice ?? item.product.price) * item.quantity,
      })),
      subtotal: cartSubtotal,
      discount: couponDiscount,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      shippingFee: cartShippingFee,
      total: cartTotal,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer with Cash on Delivery (COD).',
        },
      ],
      estimatedDeliveryDate: estDateFormatted,
    };

    try {
      StorageService.createOrder(orderPayload);
      if (appliedCoupon) {
        StorageService.incrementCouponUsage(appliedCoupon.code);
      }
      clearCart();
      refreshData();
      addToast(`Order #${orderPayload.orderNumber} placed successfully! 🎉`, 'success');
      navigate(`/order-confirmation/${orderPayload.id}`);
    } catch (err) {
      console.error(err);
      addToast('Failed to create order. Please try again.', 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Delivery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            100% Cash On Delivery • Pay comfortably when your parcel arrives.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock size={14} />
          <span>Local Demo Checkout</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Fields (Left Column) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. SHIPPING ADDRESS CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Truck size={18} className="text-amber-500" />
              <span>1. Shipping Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ayesha Malik"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-hidden ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400'
                  }`}
                />
                {errors.fullName && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{errors.fullName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone Number (COD SMS & Rider Calls) *
                </label>
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-hidden ${
                    errors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400'
                  }`}
                />
                {errors.phone && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{errors.phone}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional for e-receipt)
                </label>
                <input
                  type="email"
                  placeholder="e.g. ayesha@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Province *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden cursor-pointer"
                >
                  {PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden cursor-pointer"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{errors.city}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area / Neighborhood / Sector *
                </label>
                <input
                  type="text"
                  placeholder="e.g. DHA Phase 5 / Gulberg III"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-hidden ${
                    errors.area ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400'
                  }`}
                />
                {errors.area && (
                  <span className="text-[11px] text-rose-500 mt-1 block">{errors.area}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complete Street Address (House No, Street, Building) *
              </label>
              <textarea
                rows={2}
                placeholder="e.g. House #42, Street 8, Sector Y, DHA"
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                className={`w-full p-3 rounded-xl border text-xs text-slate-900 focus:outline-hidden resize-none ${
                  errors.streetAddress ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400'
                }`}
              />
              {errors.streetAddress && (
                <span className="text-[11px] text-rose-500 mt-1 block">{errors.streetAddress}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Please call before arrival or leave with neighbor"
                value={formData.deliveryInstructions}
                onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden"
              />
            </div>
          </div>

          {/* 2. PAYMENT METHOD CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>2. Payment Option</span>
            </h3>

            <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-500 flex items-start gap-3">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Cash on Delivery'}
                readOnly
                className="mt-1 text-amber-500 focus:ring-amber-400"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Pay the exact order amount in cash to the courier delivery rider upon receiving your parcel. No advance card payments or bank transfers required.
                </p>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                />
                <span>
                  I confirm my address details are accurate and I agree to pay the delivery rider upon delivery.
                </span>
              </label>
              {errors.terms && (
                <span className="text-[11px] text-rose-500 mt-1 block">{errors.terms}</span>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary & Place Order Action (Right Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6 sticky top-28">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Review Your Order ({cart.length} item{cart.length === 1 ? '' : 's'})
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-50 shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h5>
                    <span className="text-[11px] text-slate-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-bold text-slate-900">
                  {cartShippingFee === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    formatPrice(cartShippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount Due</span>
                <span className="text-xl text-orange-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {submitting ? (
                <span>Generating Demo Order...</span>
              ) : (
                <>
                  <span>Place Order (Cash On Delivery)</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Local demo explanation notice */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Client-Side Demo:</strong> This order is stored securely in your browser's LocalStorage and will appear in your Order History and Admin portal.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
