import { Link, Navigate, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';

import { useStore } from '../hooks/use-store';
import { useStoreItem } from '../hooks/use-store-item';
import { useAddCartItem } from '../../orders/hooks/use-add-cart-item';

import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { ArrowLeft } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function StoreItemDetailPage() {
  const { id: storeId = '', itemId = '' } = useParams();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: store, isPending: isStorePending } = useStore(storeId);
  const { data: item, isPending: isItemPending } = useStoreItem(itemId, true);

  const canManage = Boolean(
    session && session.user.role === 'vendor' && store?.user_id === session.user.id,
  );

  const addCartItem = useAddCartItem();

  const canAddToCart = Boolean(
    session && session.user.role === 'customer' && item?.is_available,
  );

  if (isSessionPending || isStorePending || isItemPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!store) {
    return <Navigate to="/stores" replace />;
  }

  if (!item) {
    return <Navigate to={`/stores/${store.store_id}/items`} replace />;
  }

  if (item.store_id !== store.store_id) {
    return <Navigate to={`/stores/${item.store_id}/items/${item.store_item_id}`} replace />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/stores/${store.store_id}/items`}>
            <HugeiconsIcon icon={ArrowLeft} />
            Back
          </Link>
        </Button>

        <div className="flex gap-2">
          {canManage && (
            <Button asChild size="sm">
              <Link to={`/stores/${store.store_id}/items/${item.store_item_id}/edit`}>Edit</Link>
            </Button>
          )}
        </div>
      </div>

      {item.image_url && (
        <div className="mb-4 overflow-hidden rounded-xl">
          <img src={item.image_url} alt={item.name} className="aspect-video w-full object-cover" />
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <h1 className="text-primary-foreground font-heading text-4xl font-semibold leading-tight">
          {item.name}
        </h1>

        {!item.is_available && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            Unavailable
          </span>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xl font-bold text-foreground">
          {new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
          }).format(item.price)}
        </p>
      </div>

      <div className="mb-4">
        <p className="leading-relaxed text-muted-foreground">
          {item.description || 'No description available for this item.'}
        </p>
      </div>
      
      {canAddToCart && (
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => addCartItem.mutate({store_item_id: item.store_item_id, quantity: 1,})}
            disabled={addCartItem.isPending}
          >
            {addCartItem.isPending ? 'Adding...' : 'Add to Cart'}
          </Button>

          <Button asChild variant="outline">
            <Link to="/cart">View Cart</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
