import React from 'react';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
    formatPrice,
  } = useShop();

  const handleMoveToCart = (item: any) => {
    const res = addToCart(item.product, 1);
    if (res.success) {
      removeFromWishlist(item.productId);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart size={48} className="fill-rose-100" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Tap the heart icon on any toy while browsing to save your children’s dream toys here for later!
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Explore All Toys</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Wishlist ({wishlist.length} Saved)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Toys saved for upcoming birthdays, rewards, and holiday surprises.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const product = item.product;
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={item.productId}
              className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-lg transition-all p-4 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 flex items-center justify-center shadow-xs cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="text-[11px] font-bold text-amber-600 uppercase mb-1">
                  {product.brand}
                </div>

                <Link
                  to={`/product/${product.slug}`}
                  className="text-xs font-bold text-slate-800 hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-2"
                >
                  {product.name}
                </Link>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatPrice(product.salePrice ?? product.price)}
                  </span>
                  {product.salePrice && (
                    <span className="text-[11px] text-slate-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50">
                <button
                  onClick={() => handleMoveToCart(item)}
                  disabled={isOutOfStock}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
