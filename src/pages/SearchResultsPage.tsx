import React, { useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { ProductSort, SortOption } from '../components/products/ProductSort';
import { useShop } from '../context/ShopContext';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useShop();

  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const matchingProducts = useMemo(() => {
    if (!query.trim()) return [];
    const clean = query.toLowerCase().trim();
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(clean) ||
        p.category.toLowerCase().includes(clean) ||
        p.subcategory.toLowerCase().includes(clean) ||
        p.brand.toLowerCase().includes(clean) ||
        p.description.toLowerCase().includes(clean) ||
        p.tags.some((t) => t.toLowerCase().includes(clean))
      );
    });
  }, [products, query]);

  const sortedProducts = useMemo(() => {
    const list = [...matchingProducts];
    if (sortBy === 'newest') return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === 'popularity') return list.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price-low') return list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    if (sortBy === 'price-high') return list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [matchingProducts, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" className="hover:text-amber-600">Shop</Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-slate-900">Search: "{query}"</span>
      </nav>

      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Search Results for "<span className="text-amber-600">{query}</span>"
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Found {matchingProducts.length} toy{matchingProducts.length === 1 ? '' : 's'} matching your keywords.
          </p>
        </div>
      </div>

      {matchingProducts.length > 0 && (
        <ProductSort
          value={sortBy}
          onChange={setSortBy}
          totalResults={sortedProducts.length}
        />
      )}

      {/* Grid or Empty Results */}
      {matchingProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No toys found matching "{query}"
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please check your spelling, try fewer keywords, or browse popular searches below.
          </p>

          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Popular Searches:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Magnetic Tiles', 'RC Cars', 'Dollhouse', 'Teddy Bear', 'STEM Robot', 'Play Dough', 'Microscope'].map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-xs font-semibold transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/shop"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs inline-block transition-colors"
            >
              Browse All Toys
            </Link>
          </div>
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
