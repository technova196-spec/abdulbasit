import React, { useState } from 'react';
import { Check, Heart, Minus, Plus, ShoppingBag, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
  } = useShop();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      setQuickViewProduct(null);
    }
  };

  const closeModal = () => {
    setQuickViewProduct(null);
    setQuantity(1);
    setActiveImageIdx(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Product Images (Left side) */}
        <div className="md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs">
            <ImageWithFallback
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails if multiple */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIdx === idx ? 'border-amber-500 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details (Right side) */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="font-bold text-amber-600 uppercase tracking-wider">{product.brand}</span>
              <span className="text-slate-300">•</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                {product.ageRecommendation}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug mb-2">
              {product.name}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-400">
                <Star size={16} className="fill-amber-400" />
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-mono text-slate-500">SKU: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4 p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {product.salePrice && (
                <span className="ml-auto text-xs font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                  Save {formatPrice(product.price - product.salePrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
              {product.description}
            </p>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold mb-6">
              {isOutOfStock ? (
                <span className="text-rose-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  Currently Out of Stock
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <Check size={16} />
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div>
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-800">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isFavorite
                      ? 'border-rose-200 bg-rose-50 text-rose-500'
                      : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={20} className={isFavorite ? 'fill-rose-500' : ''} />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag size={18} />
                Add to Cart ({formatPrice((product.salePrice ?? product.price) * quantity)})
              </button>
            </div>

            <div className="mt-3 text-center">
              <Link
                to={`/product/${product.slug}`}
                onClick={closeModal}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold hover:underline"
              >
                View Full Product Specifications & Customer Reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
