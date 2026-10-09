import React, { useMemo, useState } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { FilterState, ProductFilters } from '../components/products/ProductFilters';
import { ProductSort, SortOption } from '../components/products/ProductSort';
import { useShop } from '../context/ShopContext';

export const ShopPage: React.FC = () => {
  const { products, categories } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract initial filters from search parameters if provided
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const filterParam = searchParams.get('filter') || '';

  // Min and max bounds from inventory
  const minPossiblePrice = useMemo(() => {
    return products.length > 0 ? Math.min(...products.map((p) => p.salePrice ?? p.price)) : 0;
  }, [products]);

  const maxPossiblePrice = useMemo(() => {
    return products.length > 0 ? Math.max(...products.map((p) => p.salePrice ?? p.price)) : 15000;
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam,
    subcategory: '',
    minPrice: 0,
    maxPrice: maxPossiblePrice || 15000,
    brands: brandParam ? [brandParam] : [],
    ageGroups: [],
    inStockOnly: false,
    onSaleOnly: filterParam === 'sale',
    minRating: 0,
  });

  const [sortBy, setSortBy] = useState<SortOption>(
    filterParam === 'new' ? 'newest' : filterParam === 'bestsellers' ? 'popularity' : 'featured'
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Available brands and age groups from current products
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).filter(Boolean).sort();
  }, [products]);

  const availableAgeGroups = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.ageRecommendation))).filter(Boolean).sort();
  }, [products]);

  // Filter application
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const currentPrice = p.salePrice ?? p.price;

      // Category
      if (filters.category && p.category !== filters.category) return false;

      // Subcategory
      if (filters.subcategory && p.subcategory !== filters.subcategory) return false;

      // Price
      if (currentPrice < filters.minPrice) return false;
      if (filters.maxPrice && currentPrice > filters.maxPrice) return false;

      // Brands
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;

      // Age groups
      if (filters.ageGroups.length > 0 && !filters.ageGroups.includes(p.ageRecommendation)) return false;

      // Stock
      if (filters.inStockOnly && p.stock <= 0) return false;

      // On sale
      if (filters.onSaleOnly && (!p.salePrice || p.salePrice >= p.price)) return false;

      // Rating
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;

      return true;
    });
  }, [products, filters]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (sortBy === 'popularity') {
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'price-low') {
      return list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    }
    // Default: featured
    return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [filteredProducts, sortBy]);

  const paginatedProducts = sortedProducts.slice(0, visibleCount);

  const resetFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      minPrice: 0,
      maxPrice: maxPossiblePrice,
      brands: [],
      ageGroups: [],
      inStockOnly: false,
      onSaleOnly: false,
      minRating: 0,
    });
    setSearchParams({});
  };

  // Active filter count
  const activeFiltersCount =
    (filters.category ? 1 : 0) +
    (filters.subcategory ? 1 : 0) +
    filters.brands.length +
    filters.ageGroups.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minPrice > 0 || (filters.maxPrice && filters.maxPrice < maxPossiblePrice) ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Explore All Toys & Games
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore our complete collection of {products.length} handpicked toys for imaginative development.
        </p>
      </div>

      {/* ACTIVE FILTER CHIPS */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
          <span className="text-xs font-bold text-amber-900">Active Filters:</span>
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-amber-200 text-xs font-medium text-slate-700">
              Category: {categories.find((c) => c.slug === filters.category)?.name || filters.category}
              <button onClick={() => setFilters({ ...filters, category: '', subcategory: '' })}>
                <X size={12} className="hover:text-rose-500 cursor-pointer" />
              </button>
            </span>
          )}
          {filters.subcategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-amber-200 text-xs font-medium text-slate-700">
              Sub: {filters.subcategory}
              <button onClick={() => setFilters({ ...filters, subcategory: '' })}>
                <X size={12} className="hover:text-rose-500 cursor-pointer" />
              </button>
            </span>
          )}
          {filters.brands.map((b) => (
            <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-amber-200 text-xs font-medium text-slate-700">
              Brand: {b}
              <button onClick={() => setFilters({ ...filters, brands: filters.brands.filter((item) => item !== b) })}>
                <X size={12} className="hover:text-rose-500 cursor-pointer" />
              </button>
            </span>
          ))}
          {filters.ageGroups.map((a) => (
            <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-amber-200 text-xs font-medium text-slate-700">
              Age: {a}
              <button onClick={() => setFilters({ ...filters, ageGroups: filters.ageGroups.filter((item) => item !== a) })}>
                <X size={12} className="hover:text-rose-500 cursor-pointer" />
              </button>
            </span>
          ))}
          {filters.onSaleOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-amber-200 text-xs font-medium text-slate-700">
              On Sale Only
              <button onClick={() => setFilters({ ...filters, onSaleOnly: false })}>
                <X size={12} className="hover:text-rose-500 cursor-pointer" />
              </button>
            </span>
          )}
          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-amber-200 text-xs font-medium text-slate-700">
              In Stock Only
              <button onClick={() => setFilters({ ...filters, inStockOnly: false })}>
                <X size={12} className="hover:text-rose-500 cursor-pointer" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-auto cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* MOBILE FILTER TOGGLE BAR */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-800 shadow-xs cursor-pointer"
        >
          <Filter size={15} className="text-amber-500" />
          <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          {sortedProducts.length} toys found
        </span>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            availableBrands={availableBrands}
            availableAgeGroups={availableAgeGroups}
            priceRange={{ min: minPossiblePrice, max: maxPossiblePrice }}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={resetFilters}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />
        </div>

        {/* Product Grid & Controls */}
        <div className="lg:col-span-3">
          <ProductSort
            value={sortBy}
            onChange={setSortBy}
            totalResults={sortedProducts.length}
          />

          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                <SlidersHorizontal size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No toys matched your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your price limits, deselecting specific brands or categories to view more items.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < sortedProducts.length && (
                <div className="text-center pt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-6 py-3 bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-slate-800 font-bold text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
                  >
                    Load More Toys (Showing {paginatedProducts.length} of {sortedProducts.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
