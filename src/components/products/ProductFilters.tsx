import React from 'react';
import { RotateCcw, SlidersHorizontal, Star, X } from 'lucide-react';
import { Category } from '../../types';

export interface FilterState {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  brands: string[];
  ageGroups: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  minRating: number;
}

interface ProductFiltersProps {
  categories: Category[];
  availableBrands: string[];
  availableAgeGroups: string[];
  priceRange: { min: number; max: number };
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  availableBrands,
  availableAgeGroups,
  priceRange,
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
}) => {
  const handleCategorySelect = (slug: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === slug ? '' : slug,
      subcategory: '', // reset subcategory on category change
    });
  };

  const handleSubcategorySelect = (sub: string) => {
    onFilterChange({
      ...filters,
      subcategory: filters.subcategory === sub ? '' : sub,
    });
  };

  const handleBrandToggle = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: next });
  };

  const handleAgeToggle = (age: string) => {
    const next = filters.ageGroups.includes(age)
      ? filters.ageGroups.filter((a) => a !== age)
      : [...filters.ageGroups, age];
    onFilterChange({ ...filters, ageGroups: next });
  };

  // Get active subcategories if a category is selected
  const activeCategoryObj = categories.find((c) => c.slug === filters.category);

  const content = (
    <div className="space-y-6 text-sm">
      {/* Header and Reset button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <SlidersHorizontal size={17} className="text-amber-500" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} />
          Reset All
        </button>
      </div>

      {/* 1. TOY CATEGORIES */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Category</h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => handleCategorySelect('')}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
              !filters.category ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategorySelect(c.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                filters.category === c.slug
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1.1 SUBCATEGORIES (if category chosen) */}
      {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
        <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100/70">
          <h4 className="font-bold text-xs text-amber-900 mb-2">Subcategories:</h4>
          <div className="flex flex-wrap gap-1.5">
            {activeCategoryObj.subcategories.map((sub) => {
              const active = filters.subcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => handleSubcategorySelect(sub)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-amber-200/60 hover:bg-amber-100/50'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. PRICE RANGE */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Price Range (PKR)</h4>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-slate-400 block mb-0.5">Min</label>
            <input
              type="number"
              min={priceRange.min}
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  minPrice: Number(e.target.value) || 0,
                })
              }
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 outline-hidden"
            />
          </div>
          <span className="text-slate-400 mt-4">-</span>
          <div className="flex-1">
            <label className="text-[10px] text-slate-400 block mb-0.5">Max</label>
            <input
              type="number"
              min={filters.minPrice}
              max={priceRange.max}
              value={filters.maxPrice}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  maxPrice: Number(e.target.value) || priceRange.max,
                })
              }
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 3. AVAILABILITY & DISCOUNTS */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Discounts & Stock</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(e) => onFilterChange({ ...filters, onSaleOnly: e.target.checked })}
              className="rounded-md text-amber-500 focus:ring-amber-400 w-4 h-4"
            />
            <span>On Sale & Discounted Toys</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              className="rounded-md text-amber-500 focus:ring-amber-400 w-4 h-4"
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* 4. AGE GROUP */}
      {availableAgeGroups.length > 0 && (
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Age Recommendation</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableAgeGroups.map((age) => {
              const selected = filters.ageGroups.includes(age);
              return (
                <button
                  key={age}
                  onClick={() => handleAgeToggle(age)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selected
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. BRANDS */}
      {availableBrands.length > 0 && (
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Featured Brands</h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {availableBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded-md text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 6. MINIMUM RATING */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Customer Rating</h4>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  minRating: filters.minRating === stars ? 0 : stars,
                })
              }
              className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                filters.minRating === stars
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex text-amber-400">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Mobile Slide-over
  if (isOpenMobile) {
    return (
      <div className="fixed inset-0 z-50 flex lg:hidden">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onCloseMobile} />
        <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col z-10 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-black text-slate-900 text-base">Filters</h3>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          {content}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={onCloseMobile}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop inline filter sidebar
  return (
    <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-100 shadow-xs h-fit sticky top-28">
      {content}
    </div>
  );
};
