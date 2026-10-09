import React, { useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { ProductSort, SortOption } from '../components/products/ProductSort';
import { useShop } from '../context/ShopContext';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories, products } = useShop();

  const category = categories.find((c) => c.slug === slug);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Filter products by category slug
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === slug);
  }, [products, slug]);

  const filteredProducts = useMemo(() => {
    if (!selectedSubcategory) return categoryProducts;
    return categoryProducts.filter((p) => p.subcategory === selectedSubcategory);
  }, [categoryProducts, selectedSubcategory]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'newest') return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === 'popularity') return list.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price-low') return list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    if (sortBy === 'price-high') return list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [filteredProducts, sortBy]);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Category Not Found</h2>
        <p className="text-xs text-slate-500">The toy category you are looking for might have moved or been updated.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>Browse All Categories</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" className="hover:text-amber-600">Categories</Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-slate-900">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400 text-white shadow-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider">
            {categoryProducts.length} Toys Available
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{category.name}</h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            {category.description}
          </p>
        </div>

        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white/40 shadow-2xl shrink-0 bg-white">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Subcategory Filter Pills */}
      {category.subcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSubcategory('')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              !selectedSubcategory
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
            }`}
          >
            All {category.name} ({categoryProducts.length})
          </button>
          {category.subcategories.map((sub) => {
            const subCount = categoryProducts.filter((p) => p.subcategory === sub).length;
            const active = selectedSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(active ? '' : sub)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
                }`}
              >
                {sub} {subCount > 0 && `(${subCount})`}
              </button>
            );
          })}
        </div>
      )}

      {/* Sorting bar */}
      <ProductSort
        value={sortBy}
        onChange={setSortBy}
        totalResults={sortedProducts.length}
      />

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-4">
          <SlidersHorizontal size={32} className="mx-auto text-amber-500" />
          <h3 className="text-lg font-bold text-slate-800">No toys found in this subcategory</h3>
          <button
            onClick={() => setSelectedSubcategory('')}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold"
          >
            Show All {category.name}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
