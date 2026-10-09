import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp';
import { ProductCard } from '../components/products/ProductCard';
import { ReviewSection } from '../components/products/ReviewSection';
import { useShop } from '../context/ShopContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    products,
    categories,
    settings,
    addToCart,
    toggleWishlist,
    isInWishlist,
    trackProductView,
    recentlyViewed,
    formatPrice,
    addToast,
  } = useShop();

  const product = products.find((p) => p.slug === slug);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Track product view on load
  useEffect(() => {
    if (product) {
      trackProductView(product.id);
      setSelectedImageIdx(0);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug, product?.id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Toy Not Found</h2>
        <p className="text-xs text-slate-500">
          The product you are looking for may have been removed or discontinued.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Return to Toy Catalog
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const categoryObj = categories.find((c) => c.slug === product.category);

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      const res = addToCart(product, quantity);
      if (res.success) {
        navigate('/checkout');
      }
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard! 📋', 'success');
    } else {
      addToast('Share URL: ' + window.location.href, 'info');
    }
  };

  const discountPercent =
    product.salePrice && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" className="hover:text-amber-600">All Toys</Link>
        <ChevronRight size={13} />
        {categoryObj && (
          <>
            <Link to={`/category/${categoryObj.slug}`} className="hover:text-amber-600">
              {categoryObj.name}
            </Link>
            <ChevronRight size={13} />
          </>
        )}
        <span className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. PRODUCT MAIN OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Photo */}
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xs relative">
            <ImageWithFallback
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Discount badge */}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIdx === idx
                      ? 'border-amber-500 ring-2 ring-amber-400/20 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Top metadata tags */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs">
                  Age: {product.ageRecommendation}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Share product link"
                  aria-label="Share"
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-500'
                      : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                  }`}
                  title="Save to wishlist"
                  aria-label="Wishlist"
                >
                  <Heart size={20} className={isFavorite ? 'fill-rose-500' : ''} />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
              {product.name}
            </h1>

            {/* Ratings & SKU */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'}
                  />
                ))}
              </div>
              <span className="font-extrabold text-slate-800 text-sm">{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-mono">SKU: {product.sku}</span>
            </div>

            {/* Price Card */}
            <div className="p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/60 rounded-2xl border border-amber-200/60 flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {formatPrice(product.salePrice ?? product.price)}
                  </span>
                  {product.salePrice && (
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">
                  Includes all standard taxes • Cash On Delivery Available
                </span>
              </div>

              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-xs">
                  Save {formatPrice(product.price - (product.salePrice ?? product.price))} ({discountPercent}%)
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="pt-2">
              {isOutOfStock ? (
                <div className="text-xs font-bold text-rose-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  Currently Out of Stock. Back in stock soon!
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    In Stock ({product.stock} units ready for immediate shipping)
                  </span>
                  {isLowStock && (
                    <span className="text-rose-600 animate-pulse font-extrabold">
                      Hurry, only {product.stock} left in stock!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            {!isOutOfStock && (
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-2.5 hover:bg-slate-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-slate-900">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="p-2.5 hover:bg-slate-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Max: {product.stock} units
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Zap size={18} className="text-amber-400" />
                    <span>Buy Now (COD)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Warranty Information Grid */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <Truck size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-bold">Standard Delivery</strong>
                <span>{settings.estimatedDeliveryDays} nationwide</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RotateCcw size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-bold">{settings.returnWindowDays}-Day Returns</strong>
                <span>Hassle-free replacement for damages</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-bold">100% Child-Safe</strong>
                <span>Certified non-toxic materials</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT SPECIFICATIONS TABLE */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">
            Product Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 divide-y md:divide-y-0 divide-slate-100">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="flex justify-between py-2 text-xs border-b border-slate-50">
                <span className="font-bold text-slate-500">{spec.key}</span>
                <span className="font-semibold text-slate-800 text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CUSTOMER REVIEWS */}
      <ReviewSection productId={product.id} />

      {/* 5. RELATED PRODUCTS IN SAME CATEGORY */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Related Toys You May Also Love
            </h3>
            {categoryObj && (
              <Link
                to={`/category/${categoryObj.slug}`}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                View all {categoryObj.name} →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 6. RECENTLY VIEWED PRODUCTS */}
      {recentlyViewed.length > 1 && (
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Recently Viewed
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentlyViewed
              .filter((p) => p.id !== product.id)
              .slice(0, 6)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      )}

      {/* Floating WhatsApp pre-filled for this product */}
      <FloatingWhatsApp productContext={{ name: product.name, sku: product.sku }} />
    </div>
  );
};
