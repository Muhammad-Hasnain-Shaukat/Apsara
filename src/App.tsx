import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { FeatherCursor } from './components/common/FeatherCursor';
import { AdminLayout } from './components/layout/AdminLayout';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { StoryPage } from './pages/StoryPage';
import { InspirationPage } from './pages/InspirationPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';

import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';

// Scroll to top helper on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Global Secret Keyboard Shortcut Listener (Ctrl + Shift + A or Cmd + Shift + A)
const SecretShortcutListener: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
        addToast('Secret Atelier Admin Portal Activated (Hotkey)', 'info');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, addToast]);

  return null;
};

// Storefront Shell with Navbar & Footer
const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SecretShortcutListener />
      <ToastContainer />
      <FeatherCursor />
      <Routes>
        {/* Storefront Routes */}
        <Route
          path="/"
          element={
            <StorefrontLayout>
              <HomePage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/catalog"
          element={
            <StorefrontLayout>
              <CatalogPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <StorefrontLayout>
              <ProductDetailPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <StorefrontLayout>
              <CheckoutPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/order-success/:orderId"
          element={
            <StorefrontLayout>
              <OrderSuccessPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/account"
          element={
            <StorefrontLayout>
              <AccountPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/story"
          element={
            <StorefrontLayout>
              <StoryPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/about"
          element={
            <StorefrontLayout>
              <StoryPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/inspiration"
          element={
            <StorefrontLayout>
              <InspirationPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <StorefrontLayout>
              <ContactPage />
            </StorefrontLayout>
          }
        />
        <Route path="/login" element={<LoginPage />} />

        {/* Secret Admin Back-Office Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
        </Route>

        {/* Secret Alternative Aliases */}
        <Route path="/secret-portal" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
        </Route>
        <Route path="/atelier-portal" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
