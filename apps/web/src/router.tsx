import { Routes, Route } from 'react-router-dom';

import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';

import { HomePage } from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { SignInPage } from './features/auth/pages/SignInPage';
import { SignUpPage } from './features/auth/pages/SignUpPage';
import { UserProfilePage } from './features/users/pages/UserProfilePage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:id" element={<UserProfilePage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
