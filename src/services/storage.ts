import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import {
  CartItem,
  Category,
  Coupon,
  Order,
  OrderStatus,
  Product,
  Review,
  StoreSettings,
  WishlistItem,
} from '../types';

const STORAGE_KEYS = {
  VERSION: 'toy_store_schema_version',
  PRODUCTS: 'toy_store_products',
  CATEGORIES: 'toy_store_categories',
  CART: 'toy_store_cart',
  WISHLIST: 'toy_store_wishlist',
  ORDERS: 'toy_store_orders',
  COUPONS: 'toy_store_coupons',
  REVIEWS: 'toy_store_reviews',
  RECENTLY_VIEWED: 'toy_store_recently_viewed',
  SETTINGS: 'toy_store_settings',
  NEWSLETTER: 'toy_store_newsletter',
};

const CURRENT_SCHEMA_VERSION = '1.0.0';

// Safe LocalStorage helpers
function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[LocalStorage] Failed to parse key "${key}", falling back.`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[LocalStorage] Failed to save key "${key}". Quota exceeded?`, err);
    return false;
  }
}

export const StorageService = {
  /**
   * Initializes default data in localStorage only if not already present or corrupted
   */
  init(): void {
    if (typeof window === 'undefined') return;

    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    const existingProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);

    if (!version || !existingProducts) {
      this.resetAllData();
      return;
    }

    // Verify products integrity
    try {
      const parsed = JSON.parse(existingProducts);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.resetAllData();
      }
    } catch {
      this.resetAllData();
    }
  },

  resetAllData(): void {
    safeSetItem(STORAGE_KEYS.VERSION, CURRENT_SCHEMA_VERSION);
    safeSetItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    safeSetItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    safeSetItem(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    safeSetItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    safeSetItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    // Keep or reset orders/cart
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      safeSetItem(STORAGE_KEYS.ORDERS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      safeSetItem(STORAGE_KEYS.CART, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      safeSetItem(STORAGE_KEYS.WISHLIST, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED)) {
      safeSetItem(STORAGE_KEYS.RECENTLY_VIEWED, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NEWSLETTER)) {
      safeSetItem(STORAGE_KEYS.NEWSLETTER, []);
    }
  },

  // --- PRODUCTS ---
  getProducts(): Product[] {
    return safeGetItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug);
  },

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      products[existingIndex] = { ...product, updatedAt: now };
    } else {
      products.unshift({
        ...product,
        createdAt: product.createdAt || now,
        updatedAt: now,
      });
    }

    safeSetItem(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length !== products.length) {
      safeSetItem(STORAGE_KEYS.PRODUCTS, filtered);
      // Also clean up from cart & wishlist
      const cart = this.getCart().filter((item) => item.product.id !== id);
      this.saveCart(cart);
      const wishlist = this.getWishlist().filter((w) => w.productId !== id);
      this.saveWishlist(wishlist);
      return true;
    }
    return false;
  },

  updateProductStock(productId: string, quantityChange: number): boolean {
    const products = this.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    const newStock = Math.max(0, product.stock + quantityChange);
    product.stock = newStock;
    product.updatedAt = new Date().toISOString();
    safeSetItem(STORAGE_KEYS.PRODUCTS, products);
    return true;
  },

  // --- CATEGORIES ---
  getCategories(): Category[] {
    return safeGetItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  saveCategory(category: Category): Category {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    safeSetItem(STORAGE_KEYS.CATEGORIES, categories);
    return category;
  },

  deleteCategory(id: string): { success: boolean; error?: string } {
    const categories = this.getCategories();
    const target = categories.find((c) => c.id === id);
    if (!target) return { success: false, error: 'Category not found' };

    // Check if any product is assigned to this category slug
    const products = this.getProducts();
    const count = products.filter((p) => p.category === target.slug).length;
    if (count > 0) {
      return {
        success: false,
        error: `Cannot delete "${target.name}" because ${count} product(s) belong to it. Please reassign them first.`,
      };
    }

    const filtered = categories.filter((c) => c.id !== id);
    safeSetItem(STORAGE_KEYS.CATEGORIES, filtered);
    return { success: true };
  },

  // --- CART ---
  getCart(): CartItem[] {
    const items = safeGetItem<CartItem[]>(STORAGE_KEYS.CART, []);
    const products = this.getProducts();

    // Verify products exist and stock is current
    const validated: CartItem[] = [];
    for (const item of items) {
      const freshProduct = products.find((p) => p.id === item.product.id);
      if (freshProduct && freshProduct.stock > 0) {
        validated.push({
          product: freshProduct,
          quantity: Math.min(item.quantity, freshProduct.stock),
        });
      }
    }
    return validated;
  },

  saveCart(cart: CartItem[]): void {
    safeSetItem(STORAGE_KEYS.CART, cart);
  },

  // --- WISHLIST ---
  getWishlist(): WishlistItem[] {
    const items = safeGetItem<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
    const products = this.getProducts();

    // Reconcile with latest product info
    return items
      .map((item) => {
        const fresh = products.find((p) => p.id === item.productId);
        return fresh ? { ...item, product: fresh } : null;
      })
      .filter((item): item is WishlistItem => item !== null);
  },

  saveWishlist(wishlist: WishlistItem[]): void {
    safeSetItem(STORAGE_KEYS.WISHLIST, wishlist);
  },

  // --- ORDERS ---
  getOrders(): Order[] {
    return safeGetItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
  },

  createOrder(order: Order): Order {
    const orders = this.getOrders();
    orders.unshift(order);
    safeSetItem(STORAGE_KEYS.ORDERS, orders);

    // Deduct stock for each purchased item
    order.items.forEach((item) => {
      this.updateProductStock(item.productId, -item.quantity);
    });

    return order;
  },

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): boolean {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    const previousStatus = order.status;
    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status changed from ${previousStatus} to ${newStatus}`,
    });

    if (newStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    // If order was cancelled, restore product stock
    if (newStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
      order.items.forEach((item) => {
        this.updateProductStock(item.productId, item.quantity);
      });
    }

    safeSetItem(STORAGE_KEYS.ORDERS, orders);
    return true;
  },

  // --- COUPONS ---
  getCoupons(): Coupon[] {
    return safeGetItem<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  saveCoupon(coupon: Coupon): Coupon {
    const coupons = this.getCoupons();
    const idx = coupons.findIndex((c) => c.id === coupon.id || c.code === coupon.code);
    if (idx >= 0) {
      coupons[idx] = coupon;
    } else {
      coupons.push(coupon);
    }
    safeSetItem(STORAGE_KEYS.COUPONS, coupons);
    return coupon;
  },

  deleteCoupon(id: string): boolean {
    const coupons = this.getCoupons();
    const filtered = coupons.filter((c) => c.id !== id);
    safeSetItem(STORAGE_KEYS.COUPONS, filtered);
    return filtered.length !== coupons.length;
  },

  incrementCouponUsage(code: string): void {
    const coupons = this.getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      coupon.timesUsed += 1;
      safeSetItem(STORAGE_KEYS.COUPONS, coupons);
    }
  },

  // --- REVIEWS ---
  getReviews(): Review[] {
    return safeGetItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  getProductReviews(productId: string): Review[] {
    return this.getReviews().filter((r) => r.productId === productId && r.isApproved);
  },

  saveReview(review: Review): Review {
    const reviews = this.getReviews();
    const idx = reviews.findIndex((r) => r.id === review.id);
    if (idx >= 0) {
      reviews[idx] = review;
    } else {
      reviews.unshift(review);
    }
    safeSetItem(STORAGE_KEYS.REVIEWS, reviews);

    // Recalculate product rating
    this.recalculateProductRating(review.productId);
    return review;
  },

  deleteReview(id: string): boolean {
    const reviews = this.getReviews();
    const target = reviews.find((r) => r.id === id);
    if (!target) return false;

    const filtered = reviews.filter((r) => r.id !== id);
    safeSetItem(STORAGE_KEYS.REVIEWS, filtered);
    this.recalculateProductRating(target.productId);
    return true;
  },

  toggleReviewApproval(id: string): boolean {
    const reviews = this.getReviews();
    const review = reviews.find((r) => r.id === id);
    if (!review) return false;

    review.isApproved = !review.isApproved;
    safeSetItem(STORAGE_KEYS.REVIEWS, reviews);
    this.recalculateProductRating(review.productId);
    return true;
  },

  recalculateProductRating(productId: string): void {
    const approvedReviews = this.getProductReviews(productId);
    const products = this.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (approvedReviews.length === 0) {
      // Keep baseline rating
      return;
    }

    const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / approvedReviews.length).toFixed(1));
    product.rating = avg;
    product.reviewCount = approvedReviews.length;
    safeSetItem(STORAGE_KEYS.PRODUCTS, products);
  },

  // --- RECENTLY VIEWED ---
  getRecentlyViewed(): Product[] {
    const ids = safeGetItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
    const products = this.getProducts();
    return ids
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
  },

  addRecentlyViewed(productId: string): void {
    let ids = safeGetItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
    ids = ids.filter((id) => id !== productId);
    ids.unshift(productId);
    // Keep max 12 items
    safeSetItem(STORAGE_KEYS.RECENTLY_VIEWED, ids.slice(0, 12));
  },

  // --- SETTINGS ---
  getSettings(): StoreSettings {
    return safeGetItem<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  saveSettings(settings: StoreSettings): StoreSettings {
    safeSetItem(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // --- NEWSLETTER ---
  getNewsletterSubscribers(): string[] {
    return safeGetItem<string[]>(STORAGE_KEYS.NEWSLETTER, []);
  },

  subscribeNewsletter(email: string): boolean {
    const list = this.getNewsletterSubscribers();
    if (list.includes(email.toLowerCase().trim())) {
      return false; // already subscribed
    }
    list.unshift(email.toLowerCase().trim());
    safeSetItem(STORAGE_KEYS.NEWSLETTER, list);
    return true;
  },
};
