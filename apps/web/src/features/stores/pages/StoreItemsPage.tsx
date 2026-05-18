import { Link, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { useStore } from '../hooks/use-store';
import { useStoreItems } from '../hooks/use-store-items';
import { StoreItemCard } from '../components/StoreItemCard';

export function StoreItemsPage() {
  const { id: storeId = '' } = useParams();
  const { data: session } = authClient.useSession();
  const { data: store, isPending: isStorePending } = useStore(storeId);

  const canManage = Boolean(
    session && session.user.role === 'vendor' && store?.user_id === session.user.id,
  );

  const isCustomer = Boolean(session && session.user.role !== 'vendor');

  const { data: items, isPending: isItemsPending } = useStoreItems(storeId);

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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="space-y-2">
          <h1 className="font-heading text-primary-foreground text-3xl font-semibold">
            {store.store_name}'s Menu
          </h1>
          <p className="max-w-2xl text-muted-foreground">{store.store_address}</p>
        </div>

        {canManage && (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={`/stores/${store.store_id}`}>View store</Link>
            </Button>

            <Button asChild>
              <Link to={`/stores/${store.store_id}/items/new`}>Add item</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {items?.length || 0} item{items?.length === 1 ? '' : 's'}
        </span>
      </div>

      {items?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <StoreItemCard
              key={item.store_item_id}
              item={item}
              mode={canManage ? 'manager' : isCustomer ? 'customer' : 'guest'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center font-medium">
          <br />
          This store might be new ^~^
        </div>
      )}
    </div>
  );
}
