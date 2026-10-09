import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { StorageService } from '../services/storage';
import { Order, OrderStatus } from '../types';

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';
  const { formatPrice, addToast, refreshData } = useShop();

  const [searchId, setSearchId] = useState(queryId);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const performSearch = (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setSearched(true);
    const found = StorageService.getOrderById(idToSearch.trim());
    setOrder(found || null);
  };

  useEffect(() => {
    if (queryId) {
      performSearch(queryId);
    }
  }, [queryId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchId);
  };

  const handleCancelOrder = () => {
    if (!order) return;
    const success = StorageService.updateOrderStatus(
      order.id,
      'Cancelled',
      'Cancelled by customer from tracking portal'
    );
    if (success) {
      addToast(`Order #${order.orderNumber} has been cancelled and stock restored.`, 'info');
      refreshData();
      const updated = StorageService.getOrderById(order.id);
      setOrder(updated || null);
      setShowCancelModal(false);
    }
  };

  const currentStepIdx = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const isCancelled = order?.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
          Live Tracking
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Track Your Toy Order
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Enter your 6-digit Order ID (e.g. WLT-829140) to check real-time courier shipping progress.
        </p>

        <form onSubmit={handleSearchSubmit} className="pt-2 flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. WLT-829140"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-9 pr-3 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-amber-500 shadow-xs uppercase"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {/* TRACKING RESULTS */}
      {searched && !order && (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-xs max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Order Not Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We could not find an order matching "<strong className="text-slate-700">{searchId}</strong>" in this browser's records. Check your Order History to find your reference number.
          </p>
          <div className="pt-2">
            <Link
              to="/orders"
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              View My Order History →
            </Link>
          </div>
        </div>
      )}

      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-8 animate-in fade-in">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Status</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  #{order.orderNumber}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    isCancelled
                      ? 'bg-rose-100 text-rose-700'
                      : order.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-slate-400 block">Recipient:</span>
              <strong className="text-slate-800">{order.customer.fullName} ({order.customer.city})</strong>
              <span className="text-slate-500 block mt-0.5">
                Estimated Delivery: <strong>{order.estimatedDeliveryDate}</strong>
              </span>
            </div>
          </div>

          {/* VISUAL STATUS TIMELINE */}
          {isCancelled ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
              <XCircle size={24} className="shrink-0" />
              <div>
                <strong className="block text-sm">Order Cancelled</strong>
                <span>This demo order was cancelled and inventory stock has been restored to the catalog.</span>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100)}%`,
                  }}
                />

                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          isDone
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-amber-400/20' : ''}`}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 text-center hidden sm:block ${
                          isDone ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Status Label */}
              <div className="sm:hidden text-center mt-4">
                <span className="text-xs font-bold text-slate-700">
                  Current Status: <strong className="text-amber-600">{order.status}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Activity Log / Status History */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Shipment Activity Log
            </h4>
            <div className="space-y-3">
              {order.statusHistory.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-800">{hist.status}</span>
                    {hist.note && <p className="text-slate-500 mt-0.5">{hist.note}</p>}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Order Contents ({order.items.length} items)
            </h4>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50" />
                    <span className="font-bold text-slate-800">{item.productName} × {item.quantity}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 text-right text-xs">
              <span className="text-slate-500">Total COD Amount: </span>
              <strong className="text-sm text-orange-600 font-black">{formatPrice(order.total)}</strong>
            </div>
          </div>

          {/* Cancellation Option for Eligible Orders */}
          {(order.status === 'Pending' || order.status === 'Confirmed') && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Need to make changes or cancel?</span>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel Demo Order
              </button>
            </div>
          )}
        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-black text-slate-900">Cancel Demo Order?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to cancel order #{order?.orderNumber}? The items will be returned to store stock.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
