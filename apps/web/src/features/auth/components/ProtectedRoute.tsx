import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';

export default function ProtectedRoute() {
  const location = useLocation();

  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
