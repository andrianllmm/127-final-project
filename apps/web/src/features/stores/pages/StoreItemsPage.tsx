import { Link, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { useStore } from '../hooks/use-store';
import { useStoreItems } from '../hooks/use-store-items';
import { useStoreFilters } from '../hooks/use-store-filters';

import { StoreItemsGrid } from '../components/StoreItemsGrid';
import { StoreItemsFilters } from '../components/StoreItemsFilters';

export function StoreItemsPage() {
  const { id: storeId = '' } = useParams();

  const {
    keyword,
    sortBy,
    sortOrder,
    priceRange,
    availableOnly,
    setSortBy,
    setSortOrder,
    setPriceRange,
    setAvailableOnly,
  } = useStoreFilters();

  const { data: session } = authClient.useSession();
  const { data: store, isPending: isStorePending } = useStore(storeId);

  const {
    data: items,
    isPending: isItemsPending,
    isError: isItemsError,
  } = useStoreItems({
    storeId,
    keyword,
    sortBy,
    sortOrder,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    available: availableOnly ? true : undefined,
  });

  const canManage = Boolean(
    session && session.user.role === 'vendor' && store?.user_id === session.user.id,
  );

  const isCustomer = Boolean(session && session.user.role !== 'vendor');

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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          {isStorePending ? (
            <>
              <Skeleton className="h-9 w-72" />
              <Skeleton className="h-5 w-96" />
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
                {store?.store_name}'s Menu
              </h1>

              <p className="max-w-2xl text-muted-foreground">{store?.store_address}</p>
            </>
          )}
        </div>

        {canManage && (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={`/stores/${store?.store_id}`}>View store</Link>
            </Button>

            <Button asChild>
              <Link to={`/stores/${store?.store_id}/items/new`}>Add item</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        {isItemsPending ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span>
            {items?.length || 0} item
            {items?.length === 1 ? '' : 's'}
          </span>
        )}

        {keyword && <span>Results for “{keyword}”</span>}
      </div>

      {/* Filters */}
      <StoreItemsFilters
        sortBy={sortBy}
        sortOrder={sortOrder}
        priceRange={priceRange}
        availableOnly={availableOnly}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onPriceRangeCommit={setPriceRange}
        onAvailabilityChange={setAvailableOnly}
      />

      <StoreItemsGrid
        items={items || []}
        mode={canManage ? 'manager' : isCustomer ? 'customer' : 'guest'}
        isLoading={isItemsPending}
        isError={isItemsError}
      />
    </div>
  );
}
