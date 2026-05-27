import { Link, Navigate, useNavigate } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { useStoreByUser } from '../hooks/use-store-by-user';
import { useCreateStore } from '../hooks/use-create-store';
import { StoreProfileForm } from '../components/StoreProfileForm';

export function StoreNewPage() {
  const navigate = useNavigate();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userId = session?.user?.id ?? '';
  const { data: store, isPending: isStoresPending } = useStoreByUser(userId);
  const createStoreMutation = useCreateStore();

  if (isSessionPending || isStoresPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session || session.user.role !== 'vendor') {
    return <Navigate to="/stores" replace />;
  }

  if (store) {
    return <Navigate to="/stores/me" replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold text-primary-foreground">Create store</h1>
      <StoreProfileForm
        submitLabel="Create store"
        onSubmit={async (values) => {
          await createStoreMutation.mutateAsync(values);
          navigate('/stores/me', { replace: true });
        }}
        actions={
          <Button asChild variant="outline">
            <Link to="/stores/me">Cancel</Link>
          </Button>
        }
      />
    </div>
  );
}
