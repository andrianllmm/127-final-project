import type { ReactNode } from 'react';

import type { StoreItem } from '@repo/api';

import { StoreItemCard, type StoreItemCardMode } from './StoreItemCard';

interface StoreItemsGridProps {
  items?: StoreItem[];
  mode: StoreItemCardMode;
  emptyState: ReactNode;
  limit?: number;
}

export function StoreItemsGrid({ items = [], mode, emptyState, limit }: StoreItemsGridProps) {
  const sortedItems = [...items].sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );

  const visibleItems = typeof limit === 'number' ? sortedItems.slice(0, limit) : sortedItems;

  if (!visibleItems.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-12 text-center text-muted-foreground">
        {emptyState}
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
