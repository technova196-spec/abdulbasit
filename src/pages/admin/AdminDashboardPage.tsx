import React, { useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';

export const AdminDashboardPage: React.FC = () => {
  const { products, categories, formatPrice } = useShop();
  const orders = StorageService.getOrders();

  // Metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  // Status breakdown
  const statusCounts = {
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Confirmed: orders.filter((o) => o.status === 'Confirmed').length,
    Processing: orders.filter((o) => o.status === 'Processing').length,
    Shipped: orders.filter((o) => o.status === 'Shipped').length,
    Delivered: orders.filter((o) => o.status === 'Delivered').length,
    Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Live statistics from your browser's demo store orders and inventory records.
        </p>
      </div>

      {/* METRIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              Rs
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatPrice(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            From {orders.filter((o) => o.status !== 'Cancelled').length} completed demo orders
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Demo Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
          <span className="text-[11px] text-slate-500 font-medium block">
            {pendingOrders} awaiting fulfillment
          </span>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Products</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Boxes size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{products.length}</div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Across {categories.length} toy categories
          </span>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Stock Alert</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {lowStockProducts.length}
          </div>
          <span className="text-[11px] text-rose-500 font-medium block">
            {outOfStockProducts.length} items completely sold out
          </span>
        </div>
      </div>

      {/* TWO COLUMN GRID: ORDERS STATUS & LOW STOCK LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table (Left 7 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900">Recent Demo Orders</h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
            >
              <span>Manage Orders ({orders.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No orders recorded yet. Place an order on the storefront to test order fulfillment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 font-bold">Order #</th>
                    <th className="py-2.5 font-bold">Customer</th>
                    <th className="py-2.5 font-bold">City</th>
                    <th className="py-2.5 font-bold">Total</th>
                    <th className="py-2.5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70">
                      <td className="py-3 font-mono font-bold text-slate-900">
                        <Link to={`/admin/orders?search=${ord.orderNumber}`} className="hover:text-amber-600">
                          #{ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 font-bold text-slate-800">{ord.customer.fullName}</td>
                      <td className="py-3 text-slate-600">{ord.customer.city}</td>
                      <td className="py-3 font-black text-slate-900">{formatPrice(ord.total)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            ord.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-700'
                              : ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Breakdown & Low Stock (Right 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
              Orders by Status
            </h3>
            <div className="space-y-2 text-xs">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between py-1">
                  <span className="font-semibold text-slate-700">{status}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-800 text-xs">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Inventory Alert</h3>
              <Link to="/admin/products" className="text-xs font-bold text-amber-600 hover:underline">
                View All
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-500">All inventory items are well-stocked.</p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {lowStockProducts.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 text-xs py-1">
                    <span className="font-semibold text-slate-800 truncate flex-1">{p.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                        p.stock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
