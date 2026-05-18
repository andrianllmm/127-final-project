import { Navigate } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';

import { useStoresByUser } from '../hooks/use-store-by-user';

export function StoreMeItemsPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  const { data: stores, isPending: isStoresPending } = useStoresByUser(userId);

  if (isSessionPending || isStoresPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session || session.user.role !== 'vendor') {
    return <Navigate to="/stores" replace />;
  }

  const store = stores?.[0];

  if (!store) {
    return <Navigate to="/stores/new" replace />;
  }

  return <Navigate to={`/stores/${store.store_id}/items`} replace />;
}
