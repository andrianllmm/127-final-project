import { Routes, Route } from 'react-router-dom';

import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';

import { NotFoundPage } from './pages/NotFoundPage';
import { HomePage } from './pages/HomePage';
import { HealthPage } from './pages/HealthPage';

import { SignInPage } from './features/auth/pages/SignInPage';
import { SignUpPage } from './features/auth/pages/SignUpPage';

import { UserProfilePage } from './features/user/pages/UserProfilePage';

import { StoreListPage } from './features/store/pages/StoreListPage';
import { StoreDetailPage } from './features/store/pages/StoreDetailPage';
import { StoreItemsPage } from './features/store/pages/StoreItemsPage';
import { StoreItemPage } from './features/store/pages/StoreItemPage';

import { CartPage } from './features/order/pages/CartPage';
import { OrderListPage } from './features/order/pages/OrderListPage';
import { OrderDetailPage } from './features/order/pages/OrderDetailPage';

import { DeliveriesJobsPage } from './features/deliveries/pages/DeliveriesJobsPage';
import { DeliveriesJobDetailPage } from './features/deliveries/pages/DeliveriesJobDetailPage';
import { DeliveriesActivePage } from './features/deliveries/pages/DeliveriesActivePage';
import { DeliveriesHistoryPage } from './features/deliveries/pages/DeliveriesHistoryPage';

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
        {/* DASHBOARD */}
        <Route path="/" element={<HomePage />} />

        {/* SHARED */}
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/health" element={<HealthPage />} />

        {/* STORES */}
        <Route path="/stores" element={<StoreListPage />} />

        <Route path="/stores/:id" element={<StoreDetailPage />} />

        <Route path="/stores/:id/items" element={<StoreItemsPage />} />

        <Route path="/stores/:id/items/:itemId" element={<StoreItemPage />} />

        {/* ORDERS */}
        <Route path="/cart" element={<CartPage />} />

        <Route path="/orders" element={<OrderListPage />} />

        <Route path="/orders/:id" element={<OrderDetailPage />} />

        {/* DELIVERIES */}
        <Route path="/deliveries/jobs" element={<DeliveriesJobsPage />} />

        <Route path="/deliveries/jobs/:id" element={<DeliveriesJobDetailPage />} />

        <Route path="/deliveries/active" element={<DeliveriesActivePage />} />

        <Route path="/deliveries/history" element={<DeliveriesHistoryPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
