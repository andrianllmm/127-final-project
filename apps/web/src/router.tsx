import { Routes, Route } from 'react-router-dom';

import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';

import { NotFoundPage } from './pages/NotFoundPage';
import { HomePage } from './pages/HomePage';
import { HealthPage } from './pages/HealthPage';

import { SignInPage } from './features/auth/pages/SignInPage';
import { SignUpPage } from './features/auth/pages/SignUpPage';

import { UserProfilePage } from './features/users/pages/UserProfilePage';

import { StoreListPage } from './features/stores/pages/StoreListPage';
import { StoreDetailPage } from './features/stores/pages/StoreDetailPage';
import { StoreNewPage } from './features/stores/pages/StoreNewPage';
import { StoreMePage } from './features/stores/pages/StoreMePage';
import { StoreEditPage } from './features/stores/pages/StoreEditPage';
import { StoreItemsPage } from './features/stores/pages/StoreItemsPage';
import { StoreItemPage } from './features/stores/pages/StoreItemPage';
import { CartPage } from './features/orders/pages/CartPage';
import { OrderListPage } from './features/orders/pages/OrderListPage';
import { OffersPage } from './features/deliveries/pages/OffersPage';
import { DeliveriesPage } from './features/deliveries/pages/DeliveriesPage';
import { DeliveriesHistoryPage } from './features/deliveries/pages/DeliveriesHistoryPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import { StoreAnalyticsPage } from './features/stores/pages/StoreAnalyticsPage';

export function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>

      {/* APP */}
      <Route element={<RootLayout />}>
        <Route element={<ProtectedRoute />}>
          {/* DASHBOARD */}
          <Route path="/" element={<HomePage />} />

          {/* SHARED */}
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/health" element={<HealthPage />} />

          {/* STORES */}
          <Route path="/stores" element={<StoreListPage />} />

          <Route path="/stores/me" element={<StoreMePage />} />

          <Route path="/stores/:id" element={<StoreDetailPage />} />

          <Route path="/stores/new" element={<StoreNewPage />} />

          <Route path="/stores/:id/edit" element={<StoreEditPage />} />

          <Route path="/stores/:id/items" element={<StoreItemsPage />} />

          <Route path="/stores/:id/items/:itemId" element={<StoreItemPage />} />

          <Route path="/store-analytics" element={<StoreAnalyticsPage />} />

          {/* ORDERS */}
          <Route path="/cart" element={<CartPage />} />

          <Route path="/orders" element={<OrderListPage />} />

          {/* DELIVERIES */}
          <Route path="/offers" element={<OffersPage />} />

          <Route path="/deliveries" element={<DeliveriesPage />} />

          <Route path="/deliveries/history" element={<DeliveriesHistoryPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
