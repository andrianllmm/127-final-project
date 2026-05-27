import { Navigate } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';

import { useStoreByUser } from '../hooks/use-store-by-user';

export function StoreMeItemsPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  const { data: store, isPending: isStoresPending } = useStoreByUser(userId);

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

  if (!store) {
    return <Navigate to="/stores/new" replace />;
  }

  return <Navigate to={`/stores/${store.store_id}/items`} replace />;
}
