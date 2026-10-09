import React from 'react';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    formatPrice,
  } = useShop();

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const discountPercent =
    product.salePrice && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100/90 shadow-xs hover:shadow-xl hover:border-amber-200/80 transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* BADGES CONTAINER */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {discountPercent > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-[11px] shadow-sm tracking-wide">
            -{discountPercent}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px] shadow-xs uppercase tracking-wider">
            ★ Best Seller
          </span>
        )}
        {product.isNewArrival && !product.isBestSeller && (
          <span className="px-2.5 py-1 rounded-full bg-sky-500 text-white font-bold text-[10px] shadow-xs uppercase tracking-wider">
            New
          </span>
        )}
      </div>

      {/* WISHLIST TOGGLE BUTTON */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
          isFavorite
            ? 'bg-rose-50 text-rose-500 shadow-sm'
            : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs'
        }`}
        aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={18} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
      </button>

      {/* PRODUCT IMAGE & HOVER ACTIONS */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 group">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* QUICK VIEW HOVER BAR */}
        <div className="absolute bottom-3 inset-x-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickView}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 text-slate-800 text-xs font-bold shadow-md hover:bg-amber-500 hover:text-white transition-colors cursor-pointer w-full justify-center backdrop-blur-xs"
          >
            <Eye size={15} />
            Quick View
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Brand & Age tags */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5 gap-2">
          <span className="truncate uppercase font-bold tracking-wider text-amber-600">
            {product.brand}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold shrink-0">
            {product.ageRecommendation}
          </span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.slug}`}
          className="text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-2 flex-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            <Star size={14} className="fill-amber-400" />
          </div>
          <span className="text-xs font-extrabold text-slate-700">{product.rating}</span>
          <span className="text-[11px] text-slate-400">({product.reviewCount})</span>

          {isLowStock && (
            <span className="ml-auto text-[10px] font-bold text-rose-600">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              In Stock & Ready to Ship
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 sm:px-3 sm:py-2.5 rounded-2xl flex items-center gap-1.5 font-bold text-xs transition-all duration-200 cursor-pointer shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-orange-500 active:scale-95 text-white'
            }`}
            title="Add to Shopping Cart"
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
