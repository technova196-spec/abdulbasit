import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Star, Trash2, XCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';
import { Review } from '../../types';

export const AdminReviewsPage: React.FC = () => {
  const { products, refreshData, addToast } = useShop();
  const [reviews, setReviews] = useState<Review[]>(() => StorageService.getReviews());

  const reload = () => {
    setReviews(StorageService.getReviews());
    refreshData();
  };

  const handleToggleApproval = (id: string) => {
    StorageService.toggleReviewApproval(id);
    reload();
    addToast('Review moderation status updated.', 'info');
  };

  const handleDeleteReview = (id: string) => {
    StorageService.deleteReview(id);
    reload();
    addToast('Review deleted.', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Product Reviews Moderation ({reviews.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Approve, review, and moderate customer testimonials recorded in local storage.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No customer reviews submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Rating</th>
                  <th className="py-3 px-4 font-bold">Comment</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Approval</th>
                  <th className="py-3 px-4 font-bold text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reviews.map((rev) => {
                  const product = products.find((p) => p.id === rev.productId);

                  return (
                    <tr key={rev.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 truncate max-w-48">
                          {product ? product.name : 'Deleted Toy'}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {rev.productId}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {rev.customerName}
                        {rev.isDemo && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Demo User
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        <p className="line-clamp-2">{rev.reviewText}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleApproval(rev.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                            rev.isApproved
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {rev.isApproved ? 'Approved' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
