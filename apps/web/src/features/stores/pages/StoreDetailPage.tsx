import { Link, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { useStore } from '../hooks/use-store';
import { useStoreItems } from '../hooks/use-store-items';
import { StoreItemCard } from '../components/StoreItemCard';

export function StoreDetailPage() {
  const { id = '' } = useParams();
  const { data: session } = authClient.useSession();
  const { data: store, isPending: isStorePending } = useStore(id);
  const { data: items, isPending: isItemsPending } = useStoreItems(id);

  if (isStorePending || isItemsPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
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

  const previewItems = items?.slice(0, 6) ?? [];
  const hasMoreItems = (items?.length ?? 0) > 6;
  const canEdit = session?.user.id === store.user_id;
  const canManage = Boolean(
    session && session.user.role === 'vendor' && store.user_id === session.user.id,
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
            {store.store_name}
          </h1>

          <p className="text-muted-foreground">{store.store_address}</p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={`/stores/${id}/items`}>Manage items</Link>
            </Button>

            <Button asChild>
              <Link to={`/stores/${id}/edit`}>Edit</Link>
            </Button>
          </div>
        )}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold">Featured items</h2>

          {hasMoreItems && (
            <Button asChild variant="outline">
              <Link to={`/stores/${id}/items`}>Show more</Link>
            </Button>
          )}
        </div>

        {previewItems.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {previewItems.map((item) => (
              <StoreItemCard
                key={item.store_item_id}
                item={item}
                mode={
                  canManage
                    ? 'manager'
                    : session && session.user.role !== 'vendor'
                      ? 'customer'
                      : 'guest'
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No items yet.</div>
        )}
      </section>
    </div>
  );
}
