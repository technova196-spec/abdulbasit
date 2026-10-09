export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  images: string[];
  price: number;
  salePrice?: number;
  currency: string;
  stock: number;
  sku: string;
  ageRecommendation: string;
  brand: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  tags: string[];
  specifications: ProductSpecification[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  image: string;
  subcategories: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  expiresAt: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  description: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  province: string;
  city: string;
  area: string;
  streetAddress: string;
  postalCode?: string;
  deliveryInstructions?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  productSalePrice?: number;
  image: string;
  quantity: number;
  lineTotal: number;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer (Demo)';
  paymentStatus: 'Pending' | 'Paid';
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  estimatedDeliveryDate: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  isApproved: boolean;
  isDemo: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoText: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  returnWindowDays: number;
  announcementText: string;
  announcementEnabled: boolean;
  address: string;
  estimatedDeliveryDays: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
