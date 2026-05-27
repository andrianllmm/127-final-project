import { Navigate, Routes, Route, useParams } from 'react-router-dom';

import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';

import { NotFoundPage } from './pages/NotFoundPage';
import { HomePage } from './pages/HomePage';
import { HealthPage } from './pages/HealthPage';

import { SignInPage } from './features/auth/pages/SignInPage';
import { SignUpPage } from './features/auth/pages/SignUpPage';

import { StoreListPage } from './features/stores/pages/StoreListPage';
import { StoreDetailPage } from './features/stores/pages/StoreDetailPage';
import { StoreNewPage } from './features/stores/pages/StoreNewPage';
import { StoreMePage } from './features/stores/pages/StoreMePage';
import { StoreMeItemsPage } from './features/stores/pages/StoreMeItemsPage';
import { StoreEditPage } from './features/stores/pages/StoreEditPage';
import { StoreItemsPage } from './features/stores/pages/StoreItemsPage';
import { StoreItemNewPage } from './features/stores/pages/StoreItemNewPage';
import { StoreItemEditPage } from './features/stores/pages/StoreItemEditPage';
import { CartPage } from './features/orders/pages/CartPage';
import { OrderListPage } from './features/orders/pages/OrderListPage';
import { OrderDetailPage } from './features/orders/pages/OrderDetailPage';
import { OffersPage } from './features/deliveries/pages/OffersPage';
import { DeliveriesPage } from './features/deliveries/pages/DeliveriesPage';
import { DeliveriesHistoryPage } from './features/deliveries/pages/DeliveriesHistoryPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import { StoreAnalyticsPage } from './features/stores/pages/StoreAnalyticsPage';
import { StoreItemDetailPage } from './features/stores/pages/StoreItemDetailPage';
import { ItemsPage } from './features/stores/pages/ItemsPage';
import { AccountPage } from './pages/AccountPage';

function LegacyStoreItemDetailRedirect() {
  const { itemId = '' } = useParams();

  return <Navigate to={`/items/${itemId}`} replace />;
}

function LegacyStoreItemEditRedirect() {
  const { itemId = '' } = useParams();

  return <Navigate to={`/items/${itemId}/edit`} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>

      <Route element={<RootLayout />}>
        {/* PUBLIC */}
        <Route path="/health" element={<HealthPage />} />

        <Route path="/" element={<HomePage />} />

        <Route path="/items" element={<ItemsPage />} />

        <Route path="/stores" element={<StoreListPage />} />

        <Route path="/stores/:id" element={<StoreDetailPage />} />

        <Route path="/stores/:id/items" element={<StoreItemsPage />} />

        <Route path="/items/:id" element={<StoreItemDetailPage />} />

        <Route path="/stores/:id/items/:itemId" element={<LegacyStoreItemDetailRedirect />} />

        {/* PRIVATE */}
        <Route element={<ProtectedRoute />}>
          <Route path="/stores/me" element={<StoreMePage />} />

          <Route path="/stores/me/items" element={<StoreMeItemsPage />} />

          <Route path="/stores/new" element={<StoreNewPage />} />

          <Route path="/stores/:id/edit" element={<StoreEditPage />} />

          <Route path="/items/new" element={<StoreItemNewPage />} />

          <Route path="/stores/:id/items/new" element={<Navigate to="/items/new" replace />} />

          <Route path="/items/:id/edit" element={<StoreItemEditPage />} />

          <Route path="/stores/:id/items/:itemId/edit" element={<LegacyStoreItemEditRedirect />} />

          <Route path="/store-analytics" element={<StoreAnalyticsPage />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/orders" element={<OrderListPage />} />

          <Route path="/orders/:id" element={<OrderDetailPage />} />

          <Route path="/offers" element={<OffersPage />} />

          <Route path="/deliveries" element={<DeliveriesPage />} />

          <Route path="/deliveries/history" element={<DeliveriesHistoryPage />} />

          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
