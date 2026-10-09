import React, { useState } from 'react';
import { MessageSquarePlus, Star, ThumbsUp } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';
import { Review } from '../../types';

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { addToast, refreshData } = useShop();
  const [reviews, setReviews] = useState<Review[]>(() =>
    StorageService.getProductReviews(productId)
  );

  const [sortOrder, setSortOrder] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reloadReviews = () => {
    const list = StorageService.getProductReviews(productId);
    setReviews(list);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      addToast('Please enter your full name.', 'warning');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      addToast('Please write at least a few words describing your experience.', 'warning');
      return;
    }

    setSubmitting(true);
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      customerName: name.trim(),
      rating,
      reviewText: comment.trim(),
      createdAt: new Date().toISOString(),
      isApproved: true,
      isDemo: true,
    };

    StorageService.saveReview(newRev);
    reloadReviews();
    refreshData();
    setSubmitting(false);
    setShowForm(false);
    setName('');
    setComment('');
    setRating(5);
    addToast('Thank you! Your product review was posted successfully.', 'success');
  };

  // Calculations
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === 'highest') return b.rating - a.rating;
    if (sortOrder === 'lowest') return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs mt-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ratings & Customer Feedback
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real experiences from families across Pakistan who purchased this toy.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <MessageSquarePlus size={16} />
          {showForm ? 'Close Review Form' : 'Write a Product Review'}
        </button>
      </div>

      {/* RATING SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-slate-100 items-center">
        {/* Big Score */}
        <div className="text-center md:border-r border-slate-100 pr-4">
          <div className="text-5xl font-black text-slate-900">{avgRating}</div>
          <div className="flex items-center justify-center text-amber-400 gap-1 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-slate-200'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">Based on {totalReviews} reviews</span>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-1.5 md:col-span-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star as keyof typeof ratingCounts];
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-slate-500 font-semibold">{star} Stars</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-400 font-mono text-[11px]">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* REVIEW SUBMISSION FORM MODAL / PANEL */}
      {showForm && (
        <form
          onSubmit={handleReviewSubmit}
          className="my-8 p-6 rounded-3xl bg-amber-50/70 border border-amber-200/70 space-y-4 animate-in fade-in"
        >
          <h4 className="font-extrabold text-slate-900 text-sm">Share your experience with this toy</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sana Mir"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating *</label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star size={24} className={s <= rating ? 'fill-amber-400' : 'text-slate-300'} />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">{rating} out of 5</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review *</label>
            <textarea
              required
              rows={3}
              placeholder="What did your child love about this toy? How was the build quality, materials, and packaging?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              * Stored locally in your browser demo session.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-white text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Submit Review
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SORT CONTROLS & REVIEWS LIST */}
      <div className="pt-6">
        <div className="flex items-center justify-between pb-4">
          <span className="text-xs font-bold text-slate-700">{totalReviews} Reviews</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {sortedReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No customer reviews yet. Be the first to review this toy!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedReviews.map((rev) => (
              <div key={rev.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center uppercase">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{rev.customerName}</span>
                      {rev.isDemo && (
                        <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                          Demo Review
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rev.reviewText}</p>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                  <ThumbsUp size={12} />
                  <span>Helpful review</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
