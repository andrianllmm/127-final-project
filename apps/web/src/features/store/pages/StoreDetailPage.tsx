import { Link, Navigate, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { useStore } from '../hooks/use-store';

export function StoreDetailPage() {
  const { id = '' } = useParams();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: store, isPending: isStorePending } = useStore(id);

  if (isSessionPending || isStorePending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!store) {
    return (
      <div className="mx-auto flex w-full h-full flex-col gap-6 px-4 py-8 justify-center items-center">
        <h1 className="font-heading font-semibold text-2xl text-center">Store not found :(</h1>
        <Button asChild className="w-fit">
          <Link to="/stores">Browse stores</Link>
        </Button>
      </div>
    );
  }

  const canEdit = session.user.id === store.user_id;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
          {store.store_name}
        </h1>

        {canEdit && (
          <Button asChild>
            <Link to={`/stores/${id}/edit`}>Edit</Link>
          </Button>
        )}
      </div>

      <p>{store.store_address}</p>
    </div>
  );
}
