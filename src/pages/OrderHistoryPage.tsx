import React, { useState } from 'react';
import { ArrowRight, Clock, Eye, Package, Search, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { StorageService } from '../services/storage';
import { Order, OrderStatus } from '../types';

export const OrderHistoryPage: React.FC = () => {
  const { formatPrice } = useShop();
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== 'All' && order.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.fullName.toLowerCase().includes(q) ||
        order.customer.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Customer Order History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View demo orders recorded in your current browser session.
          </p>
        </div>

        <Link
          to="/track-order"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
        >
          <Truck size={14} />
          <span>Quick Track by ID</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by order ID or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 outline-hidden"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                selectedStatus === status
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {orders.length === 0
              ? 'You have not placed any toy orders yet in this browser session.'
              : 'No orders match your filter criteria.'}
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              <span>Explore Toy Store</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const isCancelled = ord.status === 'Cancelled';
            const isDelivered = ord.status === 'Delivered';

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:border-amber-200 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900">
                          #{ord.orderNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isCancelled
                              ? 'bg-rose-100 text-rose-700'
                              : isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(ord.date).toLocaleDateString()} at {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Total Due (COD)</span>
                      <span className="text-base font-black text-slate-900">
                        {formatPrice(ord.total)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/order-confirmation/${ord.id}`}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                        title="View invoice receipt"
                      >
                        <Eye size={13} />
                        <span className="hidden sm:inline">Receipt</span>
                      </Link>
                      <Link
                        to={`/track-order?id=${ord.orderNumber}`}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <Truck size={13} />
                        <span>Track</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Items preview snippet */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl shrink-0 border border-slate-100"
                    >
                      <img src={item.image} alt="" className="w-6 h-6 rounded object-cover" />
                      <span className="font-semibold text-slate-800 truncate max-w-48">
                        {item.productName}
                      </span>
                      <span className="text-slate-400 font-bold">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
