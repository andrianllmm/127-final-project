import { Footer } from '@/shared/components/layout/Footer';
import { Navbar } from '@/shared/components/layout/NavBar';
import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
