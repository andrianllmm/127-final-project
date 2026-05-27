import { useStores } from '../hooks/use-stores';
import { StoreCard } from '../components/StoreCard';

import { Spinner } from '@/shared/components/ui/spinner';

export function StoreListPage() {
  const { data: stores, isPending } = useStores();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const storeList = Array.isArray(stores) ? stores : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
          Browse stores
        </h1>
      </div>

      {storeList.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {storeList.map((store) => (
            <StoreCard key={store.store_id} store={store} />
          ))}
        </div>
      ) : (
        <div className="text-center">No stores yet</div>
      )}
    </div>
  );
}
