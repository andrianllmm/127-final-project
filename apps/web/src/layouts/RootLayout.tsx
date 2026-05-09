import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
