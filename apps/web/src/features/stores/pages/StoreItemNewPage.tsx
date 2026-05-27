import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { useStore } from '../hooks/use-store';
import { useCreateStoreItem } from '../hooks/use-create-store-item';
import { StoreItemForm } from '../components/StoreItemForm';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft } from '@hugeicons/core-free-icons';

export function StoreItemNewPage() {
  const navigate = useNavigate();
  const { id: storeId = '' } = useParams();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: store, isPending: isStorePending } = useStore(storeId);
  const createItemMutation = useCreateStoreItem();

  const canManage = Boolean(
    session && session.user.role === 'vendor' && store?.user_id === session.user.id,
  );

  if (isSessionPending || isStorePending) {
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
    return <Navigate to="/stores" replace />;
  }

  if (!canManage) {
    return <Navigate to={`/stores/${store.store_id}`} replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-row items-center gap-1">
        <Button asChild variant="ghost" size="icon">
          <Link to={`/stores/${store.store_id}/items`}>
            <HugeiconsIcon icon={ArrowLeft} />
          </Link>
        </Button>
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">Add item</h1>
      </div>

      <div>
        <StoreItemForm
          submitLabel="Create item"
          resetOnSuccess
          onSubmit={async (values) => {
            await createItemMutation.mutateAsync(values);
            navigate(`/stores/${store.store_id}/items`, { replace: true });
          }}
        />
      </div>
    </div>
  );
}
