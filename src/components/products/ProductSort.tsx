import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating' | 'popularity';

interface ProductSortProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  totalResults: number;
}

export const ProductSort: React.FC<ProductSortProps> = ({ value, onChange, totalResults }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs text-xs mb-6">
      <div className="text-slate-500 font-medium">
        Showing <strong className="text-slate-800">{totalResults}</strong> toys
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown size={14} className="text-slate-400" />
        <span className="text-slate-500 font-semibold">Sort by:</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-amber-400 cursor-pointer"
        >
          <option value="featured">Featured Picks</option>
          <option value="newest">New Arrivals</option>
          <option value="popularity">Most Popular / Reviews</option>
          <option value="rating">Highest Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};
