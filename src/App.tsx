import React, { useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from './components/common/ToastContainer';
import { BackToTop } from './components/layout/BackToTop';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { QuickViewModal } from './components/products/QuickViewModal';
import { ShopProvider } from './context/ShopContext';

// Customer Pages
import { AboutPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { CategoryPage } from './pages/CategoryPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqsPage } from './pages/FaqsPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ReturnsPolicyPage } from './pages/ReturnsPolicyPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { ShopPage } from './pages/ShopPage';
import { TermsPage } from './pages/TermsPage';
import { WishlistPage } from './pages/WishlistPage';

// Admin Pages
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top helper on navigation
const ScrollToTopOnRoute: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
};

// Customer Layout containing Header, Footer, and Floating helpers
const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <ScrollToTopOnRoute />
        <ToastContainer />
        <QuickViewModal />

        <Routes>
          {/* Customer Facing Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Management Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShopProvider>
  );
}
