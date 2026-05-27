'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { getInitials } from '../lib/getInitials';

type UserAvatarProps = {
  name?: string | null | undefined;
  image?: string | null | undefined;
  className?: string;
};

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const initials = getInitials(name ?? undefined);

  return (
    <Avatar className={className}>
      {image ? <AvatarImage src={image} alt={name ?? 'User'} /> : null}
      <AvatarFallback>{initials || 'U'}</AvatarFallback>
    </Avatar>
  );
}
