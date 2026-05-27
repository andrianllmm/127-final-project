import { authClient } from '@/shared/lib/authClient';

import { useStoreItems } from '../hooks/use-store-items';
import { StoreItemsGrid } from '../components/StoreItemsGrid';
import { StoreItemsFilters } from '../components/StoreItemsFilters';

import { useStoreFilters } from '../hooks/use-store-filters';

export function ItemsPage() {
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

  const mode = session?.user.role === 'customer' ? 'customer' : 'guest';

  const {
    data: items,
    isPending,
    isError,
  } = useStoreItems({
    keyword,
    sortBy,
    sortOrder,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    available: availableOnly ? true : undefined,
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
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

      <StoreItemsGrid items={items ?? []} isLoading={isPending} isError={isError} mode={mode} />
    </div>
  );
}
