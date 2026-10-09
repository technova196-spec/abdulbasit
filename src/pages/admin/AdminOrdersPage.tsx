import React, { useState } from 'react';
import {
  Eye,
  Filter,
  MapPin,
  Package,
  Phone,
  Printer,
  Search,
  Truck,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';
import { Order, OrderStatus } from '../../types';

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminOrdersPage: React.FC = () => {
  const { formatPrice, refreshData, addToast } = useShop();
  const orders = StorageService.getOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const success = StorageService.updateOrderStatus(
      orderId,
      newStatus,
      `Status changed by admin to ${newStatus}`
    );
    if (success) {
      addToast(`Order status updated to "${newStatus}"!`, 'success');
      refreshData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(StorageService.getOrderById(orderId) || null);
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'All' && o.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Customer Orders Management ({orders.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Process, fulfill, and update shipment statuses for all local demo orders.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by order #, phone, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 outline-hidden font-medium"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', ...ORDER_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No orders match the current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer Details</th>
                  <th className="py-3 px-4 font-bold">Destination</th>
                  <th className="py-3 px-4 font-bold">Items</th>
                  <th className="py-3 px-4 font-bold">Total (COD)</th>
                  <th className="py-3 px-4 font-bold">Status Action</th>
                  <th className="py-3 px-4 font-bold text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{ord.orderNumber}
                      <span className="text-[10px] text-slate-400 block font-sans font-normal">
                        {new Date(ord.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ord.customer.fullName}</div>
                      <div className="text-[11px] text-slate-500">{ord.customer.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-semibold text-slate-800">{ord.customer.city}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-40">
                        {ord.customer.area}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} toys
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className={`font-extrabold text-[11px] rounded-xl px-2.5 py-1 border transition-colors cursor-pointer outline-hidden ${
                          ord.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                        title="View Full Order Invoice"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL ORDER INSPECTION MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 font-mono">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Placed on {new Date(selectedOrder.date).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Customer
                </span>
                <div className="font-bold text-slate-800">{selectedOrder.customer.fullName}</div>
                <div className="text-slate-600">{selectedOrder.customer.phone}</div>
                {selectedOrder.customer.email && <div className="text-slate-500">{selectedOrder.customer.email}</div>}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Delivery Address
                </span>
                <div className="text-slate-700 leading-relaxed">
                  {selectedOrder.customer.streetAddress}, {selectedOrder.customer.area}, {selectedOrder.customer.city}, {selectedOrder.customer.province}
                </div>
                {selectedOrder.customer.deliveryInstructions && (
                  <div className="text-slate-500 italic mt-1">
                    "{selectedOrder.customer.deliveryInstructions}"
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Items in Order
              </span>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50" />
                      <div>
                        <h5 className="font-bold text-slate-800">{item.productName}</h5>
                        <span className="text-[11px] text-slate-400">
                          {formatPrice(item.productSalePrice ?? item.productPrice)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({selectedOrder.couponCode}):</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span className="font-bold">
                  {selectedOrder.shippingFee === 0 ? 'FREE' : formatPrice(selectedOrder.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-amber-200">
                <span>Grand Total (Cash on Delivery):</span>
                <span className="text-base text-orange-600">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status updates */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-700">Update Status:</span>
              <div className="flex gap-2">
                {ORDER_STATUSES.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedOrder.status === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
