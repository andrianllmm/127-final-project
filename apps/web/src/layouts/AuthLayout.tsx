import { Logo } from '@/shared/components/brand/Logo';
import { Link, Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="w-full">
        <div className="mx-auto flex h-24 max-w-6xl items-center justify-center px-4">
          <Link to="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex items-center justify-center px-4">
        <Outlet />
      </main>
    </div>
  );
}
