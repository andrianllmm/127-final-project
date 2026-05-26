import { useSearchParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';

import { useStoreItems } from '../hooks/use-store-items';
import { StoreItemsGrid } from '../components/StoreItemsGrid';

export function ItemsPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q')?.trim() || '';

  const { data: session } = authClient.useSession();

  const {
    data: items,
    isPending: isItemsPending,
    isError: isItemsError,
  } = useStoreItems({ keyword });

  const mode = session?.user.role === 'customer' ? 'customer' : 'guest';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      {keyword && (
        <p className="text-sm text-muted-foreground">
          Showing results for <span className="font-medium text-foreground">"{keyword}"</span>
        </p>
      )}

      <StoreItemsGrid
        items={items || []}
        mode={mode}
        isLoading={isItemsPending}
        isError={isItemsError}
      />
    </div>
  );
}
