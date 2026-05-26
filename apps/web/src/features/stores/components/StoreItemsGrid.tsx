import type { ReactNode } from 'react';
import type { StoreItem } from '@repo/api';

import { StoreItemCard, type StoreItemCardMode } from './StoreItemCard';
import { StoreItemCardSkeleton } from './StoreItemCardSkeleton';

interface StoreItemsGridProps {
  items?: StoreItem[];
  mode: StoreItemCardMode;
  emptyState?: ReactNode;
  limit?: number;
  isLoading?: boolean;
  isError?: boolean;
}

export function StoreItemsGrid({
  items = [],
  mode,
  emptyState,
  limit,
  isLoading,
  isError,
}: StoreItemsGridProps) {
  const visibleItems = typeof limit === 'number' ? items.slice(0, limit) : items;

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-12 text-center text-sm text-destructive">
        Failed to load items.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: limit ?? 6 }).map((_, i) => (
          <StoreItemCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!visibleItems.length) {
    return (
      <div className="px-6 py-12 text-center text-muted-foreground">
        {emptyState ?? 'Items not found :('}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {visibleItems.map((item) => (
        <StoreItemCard key={item.store_item_id} item={item} mode={mode} />
      ))}
    </div>
  );
}
