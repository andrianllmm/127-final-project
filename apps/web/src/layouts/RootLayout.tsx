import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { AppSidebar } from '@/shared/components/nav/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shared/components/ui/sidebar';
import { SearchBar } from '@/shared/components/SearchBar';

export function RootLayout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const searchBarKey =
    location.pathname === '/items'
      ? `items:${searchParams.toString()}`
      : `route:${location.pathname}`;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>

          <SearchBar key={searchBarKey} />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
