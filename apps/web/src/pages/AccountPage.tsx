import { authClient } from '@/shared/lib/authClient';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { UserAvatar } from '@/shared/components/UserAvatar';

export function AccountPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <UserAvatar name={user.name} image={user.image} className="size-18" />

        <div>
          <div className="text-2xl font-semibold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>

      <Separator />

      {/* Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Role</span>
          <Badge variant="secondary">{user.role}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Email verified</span>
          <Badge variant={user.emailVerified ? 'default' : 'destructive'}>
            {user.emailVerified ? 'Verified' : 'Not verified'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Phone</span>
          <span className="text-sm text-muted-foreground">{user.phone_number ?? 'Not set'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Created</span>
          <span className="text-sm text-muted-foreground">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Updated</span>
          <span className="text-sm text-muted-foreground">
            {new Date(user.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
