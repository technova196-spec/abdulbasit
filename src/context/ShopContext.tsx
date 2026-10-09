import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StorageService } from '../services/storage';
import {
  CartItem,
  Category,
  Coupon,
  Product,
  StoreSettings,
  ToastMessage,
  ToastType,
  WishlistItem,
} from '../types';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  settings: StoreSettings;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  recentlyViewed: Product[];
  toasts: ToastMessage[];
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Wishlist operations
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  // Coupon operations
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Calculation summaries
  cartItemCount: number;
  wishlistItemCount: number;
  cartSubtotal: number;
  couponDiscount: number;
  cartShippingFee: number;
  cartTotal: number;
  freeShippingRemaining: number;
  isFreeShipping: boolean;

  // Navigation / recently viewed
  trackProductView: (productId: string) => void;

  // Feedback notifications
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;

  // Administrative / Data sync
  refreshData: () => void;
  updateSettingsState: (newSettings: StoreSettings) => void;
  formatPrice: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize storage once on mount
  const [initialized, setInitialized] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(StorageService.getSettings());
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync state from storage
  const refreshData = () => {
    StorageService.init();
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setCart(StorageService.getCart());
    setWishlist(StorageService.getWishlist());
    setSettings(StorageService.getSettings());
    setCoupons(StorageService.getCoupons());
    setRecentlyViewed(StorageService.getRecentlyViewed());
  };

  useEffect(() => {
    refreshData();
    setInitialized(true);
  }, []);

  // Sync Cart to LocalStorage on updates
  useEffect(() => {
    if (initialized) {
      StorageService.saveCart(cart);
    }
  }, [cart, initialized]);

  // Sync Wishlist to LocalStorage on updates
  useEffect(() => {
    if (initialized) {
      StorageService.saveWishlist(wishlist);
    }
  }, [wishlist, initialized]);

  // Toast helper
  const addToast = (message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart logic
  const addToCart = (product: Product, quantity = 1): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      addToast(`Sorry, ${product.name} is currently out of stock.`, 'error');
      return { success: false, message: 'Product is out of stock' };
    }

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    const proposedQty = currentQtyInCart + quantity;

    if (proposedQty > product.stock) {
      const allowedAdd = Math.max(0, product.stock - currentQtyInCart);
      if (allowedAdd <= 0) {
        addToast(`You already have all ${product.stock} available units of ${product.name} in your cart.`, 'warning');
        return { success: false, message: 'Stock limit reached in cart' };
      }
      // Add up to remaining stock
      const updated = [...cart];
      updated[existingIndex] = { ...updated[existingIndex], quantity: product.stock };
      setCart(updated);
      addToast(`Added remaining ${allowedAdd} available units of ${product.name} to your cart.`, 'warning');
      return { success: true, message: `Added ${allowedAdd} items (max available stock)` };
    }

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex] = { ...updated[existingIndex], quantity: proposedQty };
      setCart(updated);
      addToast(`Updated ${product.name} quantity to ${proposedQty}.`, 'success');
    } else {
      setCart((prev) => [...prev, { product, quantity: proposedQty }]);
      addToast(`Added "${product.name}" to cart! 🛍️`, 'success');
    }

    return { success: true, message: 'Added to cart successfully' };
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const validatedQty = Math.min(quantity, prod.stock);
    if (quantity > prod.stock) {
      addToast(`Only ${prod.stock} items in stock for ${prod.name}`, 'warning');
    }

    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: validatedQty } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      addToast(`Removed "${item.product.name}" from cart.`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    StorageService.saveCart([]);
    addToast('Shopping cart cleared.', 'info');
  };

  // Wishlist logic
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.productId === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      addToast(`Removed "${product.name}" from wishlist.`, 'info');
    } else {
      setWishlist((prev) => [...prev, { productId: product.id, product, addedAt: new Date().toISOString() }]);
      addToast(`Saved "${product.name}" to your wishlist! ❤️`, 'success');
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.productId === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Recently viewed
  const trackProductView = (productId: string) => {
    StorageService.addRecentlyViewed(productId);
    setRecentlyViewed(StorageService.getRecentlyViewed());
  };

  // Financial Calculations
  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const wishlistItemCount = wishlist.length;

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  // Coupon validation & recalculation
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    const allCoupons = StorageService.getCoupons();
    const coupon = allCoupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { success: false, message: `Coupon code "${cleanCode}" is invalid.` };
    }

    if (!coupon.isActive) {
      return { success: false, message: `Coupon "${coupon.code}" is no longer active.` };
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return { success: false, message: `Coupon "${coupon.code}" has expired.` };
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return { success: false, message: `Coupon "${coupon.code}" usage limit reached.` };
    }

    if (cartSubtotal < coupon.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount.toLocaleString()} required for this coupon.`,
      };
    }

    setAppliedCoupon(coupon);
    addToast(`Coupon "${coupon.code}" applied successfully! 🎉`, 'success');
    return { success: true, message: `Coupon applied: ${coupon.description}` };
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      const name = appliedCoupon.code;
      setAppliedCoupon(null);
      addToast(`Coupon "${name}" removed.`, 'info');
    }
  };

  // Re-verify applied coupon if cart subtotal dropped below min requirement
  useEffect(() => {
    if (appliedCoupon && cartSubtotal < appliedCoupon.minOrderAmount) {
      addToast(
        `Coupon ${appliedCoupon.code} removed because cart dropped below Rs. ${appliedCoupon.minOrderAmount.toLocaleString()}.`,
        'warning'
      );
      setAppliedCoupon(null);
    }
  }, [cartSubtotal, appliedCoupon]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal <= 0) return 0;

    let discount = 0;
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }

    // Never allow discount to exceed cart subtotal
    return Math.min(discount, cartSubtotal);
  }, [appliedCoupon, cartSubtotal]);

  const isFreeShipping = useMemo(() => {
    if (cartSubtotal <= 0) return false;
    return cartSubtotal >= settings.freeShippingThreshold;
  }, [cartSubtotal, settings.freeShippingThreshold]);

  const freeShippingRemaining = useMemo(() => {
    if (cartSubtotal >= settings.freeShippingThreshold) return 0;
    return Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  }, [cartSubtotal, settings.freeShippingThreshold]);

  const cartShippingFee = useMemo(() => {
    if (cartSubtotal <= 0) return 0;
    return isFreeShipping ? 0 : settings.standardShippingFee;
  }, [cartSubtotal, isFreeShipping, settings.standardShippingFee]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal <= 0) return 0;
    const finalAmount = cartSubtotal - couponDiscount + cartShippingFee;
    return Math.max(0, finalAmount);
  }, [cartSubtotal, couponDiscount, cartShippingFee]);

  const updateSettingsState = (newSettings: StoreSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
    addToast('Store settings updated successfully.', 'success');
  };

  const formatPrice = (amount: number): string => {
    return `${settings.currencySymbol} ${amount.toLocaleString()}`;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        settings,
        coupons,
        appliedCoupon,
        recentlyViewed,
        toasts,
        quickViewProduct,
        setQuickViewProduct,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        applyCoupon,
        removeCoupon,
        cartItemCount,
        wishlistItemCount,
        cartSubtotal,
        couponDiscount,
        cartShippingFee,
        cartTotal,
        freeShippingRemaining,
        isFreeShipping,
        trackProductView,
        addToast,
        removeToast,
        refreshData,
        updateSettingsState,
        formatPrice,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
