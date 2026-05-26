import { useSearchParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';

import { useStoreItems } from '../hooks/use-store-items';
import { StoreItemsGrid } from '../components/StoreItemsGrid';

export function ItemsPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q')?.trim() || '';

  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: items, isPending: isItemsPending } = useStoreItems({ keyword });

  if (isSessionPending || isItemsPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const mode = session?.user.role === 'customer' ? 'customer' : 'guest';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      {keyword && (
        <p className="text-sm text-muted-foreground">
          Showing results for <span className="font-medium text-foreground">"{keyword}"</span>
        </p>
      )}
      <StoreItemsGrid items={items || []} mode={mode} emptyState="No items are available yet." />
    </div>
  );
}
