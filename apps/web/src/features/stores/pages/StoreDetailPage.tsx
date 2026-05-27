import { Link, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { useStore } from '../hooks/use-store';
import { useStoreItems } from '../hooks/use-store-items';
import { StoreItemsGrid } from '../components/StoreItemsGrid';

export function StoreDetailPage() {
  const { id = '' } = useParams();
  const { data: session } = authClient.useSession();

  const { data: store, isPending: isStorePending } = useStore(id);

  const {
    data: items,
    isPending: isItemsPending,
    isError: isItemsError,
  } = useStoreItems({ storeId: id });

  if (!store && !isStorePending) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
          Store not found :(
        </h1>

        <Button asChild className="w-fit">
          <Link to="/stores">Browse stores</Link>
        </Button>
      </div>
    );
  }

  const canManage =
    Boolean(session) && session?.user.role === 'vendor' && session.user.id === store?.user_id;

  const mode = canManage
    ? 'manager'
    : session && session.user.role !== 'vendor'
      ? 'customer'
      : 'guest';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {isStorePending ? (
            <>
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-5 w-40" />
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
                {store?.store_name}
              </h1>

              <p className="text-muted-foreground">{store?.store_address}</p>
            </>
          )}
        </div>

        {canManage ? (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={`/stores/${id}/items`}>Manage items</Link>
            </Button>

            <Button asChild>
              <Link to={`/stores/${id}/edit`}>Edit</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to={`/stores/${id}/items`}>Menu</Link>
            </Button>
          </div>
        )}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold">Featured items</h2>

          {(items?.length ?? 0) > 6 && (
            <Button asChild variant="outline">
              <Link to={`/stores/${id}/items`}>Show more</Link>
            </Button>
          )}
        </div>

        <StoreItemsGrid
          items={items || []}
          mode={mode}
          limit={6}
          isLoading={isItemsPending}
          isError={isItemsError}
        />
      </section>
    </div>
  );
}
