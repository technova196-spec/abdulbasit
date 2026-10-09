import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Printer,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { StorageService } from '../services/storage';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { formatPrice } = useShop();

  const order = StorageService.getOrderById(orderId || '');

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500">The requested order could not be located in your local storage.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. SUCCESS CELEBRATION CARD */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl text-center space-y-4 no-print">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white">
          <CheckCircle2 size={36} />
        </div>

        <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider">
          Demo Order Confirmed!
        </span>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Thank You, {order.customer.fullName}!
        </h1>

        <p className="text-xs sm:text-sm text-white/90 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded. Our warehouse team is preparing your toy parcel for dispatch via standard courier.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Receipt</span>
          </button>

          <Link
            to={`/track-order?id=${order.orderNumber}`}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Truck size={15} />
            <span>Track Delivery</span>
          </Link>
        </div>
      </div>

      {/* 2. ORDER DETAILS & INVOICE */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-8 print:shadow-none print:border-none">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Number</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              #{order.orderNumber}
            </div>
            <span className="text-xs text-slate-500">
              Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Payment Status</span>
            <div className="text-sm font-extrabold text-amber-600 mt-0.5">
              Cash on Delivery (Pending Delivery)
            </div>
            <span className="text-xs text-slate-500">
              Estimated Arrival: <strong className="text-slate-800">{order.estimatedDeliveryDate}</strong>
            </span>
          </div>
        </div>

        {/* Shipping Address Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="space-y-1.5 text-xs">
            <span className="font-extrabold text-slate-900 uppercase tracking-wider block text-[11px]">
              Delivery Recipient
            </span>
            <div className="font-bold text-slate-800">{order.customer.fullName}</div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Phone size={13} className="text-slate-400" />
              <span>{order.customer.phone}</span>
            </div>
            {order.customer.email && (
              <div className="text-slate-500">{order.customer.email}</div>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-extrabold text-slate-900 uppercase tracking-wider block text-[11px]">
              Shipping Address
            </span>
            <div className="flex items-start gap-1.5 text-slate-700">
              <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                {order.customer.streetAddress}, {order.customer.area}, {order.customer.city}, {order.customer.province}
              </span>
            </div>
            {order.customer.deliveryInstructions && (
              <div className="text-slate-500 italic">
                Note: "{order.customer.deliveryInstructions}"
              </div>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Purchased Toys
          </h4>
          <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-50 shrink-0 border border-slate-100"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">{item.productName}</h5>
                    <span className="text-[11px] text-slate-400">
                      {formatPrice(item.productSalePrice ?? item.productPrice)} × {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary Totals */}
        <div className="space-y-2 text-xs max-w-xs ml-auto">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Coupon Discount ({order.couponCode}):</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600">
            <span>Shipping Charges:</span>
            <span className="font-bold text-slate-900">
              {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
            </span>
          </div>

          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Amount Due on Delivery:</span>
            <span className="text-base text-orange-600 font-mono">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center no-print">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
        >
          <span>Continue Shopping Toys</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
