import { Navigate, Link, useNavigate, useParams } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { useStore } from '../hooks/use-store';
import { useUpdateStore } from '../hooks/use-update-store';
import { StoreProfileForm } from '../components/StoreProfileForm';

export function StoreEditPage() {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: store, isPending: isStorePending } = useStore(id);
  const updateStoreMutation = useUpdateStore();

  if (isSessionPending || isStorePending) {
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
    return <Navigate to="/stores/me" replace />;
  }

  if (store.user_id !== session.user.id) {
    return <Navigate to={`/stores/${store.store_id}`} replace />;
  }

  const defaultValues = {
    store_name: store.store_name ?? '',
    store_address: store.store_address ?? '',
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold text-primary-foreground">Edit store</h1>

      <StoreProfileForm
        submitLabel="Save changes"
        defaultValues={defaultValues}
        onSubmit={async (values) => {
          await updateStoreMutation.mutateAsync({
            id: store.store_id,
            input: values,
          });

          navigate(`/stores/${store.store_id}`, { replace: true });
        }}
        actions={
          <Button asChild variant="outline">
            <Link to={`/stores/${store.store_id}`}>Cancel</Link>
          </Button>
        }
      />
    </div>
  );
}
