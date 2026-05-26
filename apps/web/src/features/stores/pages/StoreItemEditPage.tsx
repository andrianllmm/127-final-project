import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { useStore } from '../hooks/use-store';
import { useStoreItem } from '../hooks/use-store-item';
import { useUpdateStoreItem } from '../hooks/use-update-store-item';
import { useDeleteStoreItem } from '../hooks/use-delete-store-item';
import { StoreItemForm } from '../components/StoreItemForm';
import { DeleteStoreItemDialog } from '../components/DeleteStoreItemDialog';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft } from '@hugeicons/core-free-icons';

export function StoreItemEditPage() {
  const navigate = useNavigate();
  const { id: storeId = '', itemId = '' } = useParams();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: store, isPending: isStorePending } = useStore(storeId);

  const canManage = Boolean(
    session && session.user.role === 'vendor' && store?.user_id === session.user.id,
  );

  const { data: item, isPending: isItemPending } = useStoreItem(itemId, canManage);

  const defaultValues = item
    ? {
        name: item.name,
        description: item.description ?? undefined,
        price: item.price,
        is_available: item.is_available,
        image_url: item.image_url ?? undefined,
      }
    : undefined;
  const updateItemMutation = useUpdateStoreItem();
  const deleteItemMutation = useDeleteStoreItem();

  if (isSessionPending || isStorePending || (canManage && isItemPending)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session || session.user.role !== 'vendor') {
    return <Navigate to="/stores" replace />;
  }

  if (!store) {
    return <Navigate to="/stores" replace />;
  }

  if (!canManage) {
    return <Navigate to={`/stores/${store.store_id}`} replace />;
  }

  if (!item) {
    return <Navigate to={`/stores/${store.store_id}/items`} replace />;
  }

  if (item.store_id !== store.store_id) {
    return <Navigate to={`/stores/${item.store_id}/items/${item.store_item_id}/edit`} replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-row items-center gap-1">
        <Button asChild variant="ghost" size="icon">
          <Link to={`/stores/${store.store_id}/items`}>
            <HugeiconsIcon icon={ArrowLeft} />
          </Link>
        </Button>
        <h1 className="font-heading text-2xl font-semibold">Edit item</h1>
      </div>

      <div>
        <StoreItemForm
          submitLabel="Save changes"
          defaultValues={defaultValues}
          onSubmit={async (values) => {
            await updateItemMutation.mutateAsync({
              itemId: item.store_item_id,
              input: values,
            });

            navigate(`/stores/${store.store_id}/items/${item.store_item_id}`, { replace: true });
          }}
          actions={
            <DeleteStoreItemDialog
              itemName={item.name}
              triggerLabel="Delete item"
              onConfirm={async () => {
                await deleteItemMutation.mutateAsync(item.store_item_id);
                navigate(`/stores/${store.store_id}/items`, { replace: true });
              }}
            />
          }
        />
      </div>
    </div>
  );
}
