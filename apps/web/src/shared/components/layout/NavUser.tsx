import { useNavigate, Link } from 'react-router-dom';

import { authClient } from '@/shared/lib/authClient';
import { getInitials } from '@/shared/lib/getInitials';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';

import { LogoutIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function NavUser() {
  const navigate = useNavigate();

  const session = authClient.useSession();
  const user = session.data?.user;

  const handleLogout = async () => {
    await authClient.signOut();

    session.refetch?.();

    navigate('/sign-in', { replace: true });
  };

  if (session.isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return (
      <Button asChild>
        <Link to="/sign-in">Sign in</Link>
      </Button>
    );
  }

  const name = user.name ?? null;
  const email = user.email ?? null;
  const image = user.image ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center rounded-full focus:outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image ?? undefined} alt={name ?? 'User'} />
            <AvatarFallback>{getInitials(name, email)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium leading-none">{name ?? 'User'}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/me">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/settings">Account</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <HugeiconsIcon icon={LogoutIcon} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
