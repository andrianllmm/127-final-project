import { useState } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import { SortByUp02Icon, SortByDown02Icon } from '@hugeicons/core-free-icons';

import { Slider } from '@/shared/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Toggle } from '@/shared/components/ui/toggle';

import { currencyFormatter } from '@/shared/lib/currencyFormatter';

export type StoreItemsSortBy = 'created_at' | 'name' | 'price';
export type StoreItemsSortOrder = 'asc' | 'desc';

interface StoreItemsFiltersProps {
  sortBy: StoreItemsSortBy;
  sortOrder: StoreItemsSortOrder;
  priceRange: [number, number];
  availableOnly: boolean;
  onSortByChange: (value: StoreItemsSortBy) => void;
  onSortOrderChange: (value: StoreItemsSortOrder) => void;
  onPriceRangeCommit: (value: [number, number]) => void;
  onAvailabilityChange: (value: boolean) => void;
}

const PRICE_MIN = 0;
const PRICE_MAX = 2000;

export function StoreItemsFilters({
  sortBy,
  sortOrder,
  priceRange,
  availableOnly,
  onSortByChange,
  onSortOrderChange,
  onPriceRangeCommit,
  onAvailabilityChange,
}: StoreItemsFiltersProps) {
  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>(priceRange);

  const commitPrice = (range: number[]) => {
    const [min = PRICE_MIN, max = PRICE_MAX] = range;
    onPriceRangeCommit([min, max]);
  };

  return (
    <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-3 xl:flex-1">
        <div className="flex flex-wrap items-center gap-1">
          <Select value={sortBy} onValueChange={(v) => onSortByChange(v as StoreItemsSortBy)}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>

          <Toggle
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            aria-label="Sort order"
            pressed={sortOrder === 'asc'}
            onPressedChange={(v) => onSortOrderChange(v ? 'asc' : 'desc')}
          >
            <HugeiconsIcon
              icon={sortOrder === 'asc' ? SortByUp02Icon : SortByDown02Icon}
              strokeWidth={2}
              className="size-4 opacity-75"
            />
          </Toggle>
        </div>

        <Toggle
          variant="outline"
          size="sm"
          className="px-2 text-sm opacity-80"
          aria-label="Available only"
          pressed={availableOnly}
          onPressedChange={onAvailabilityChange}
        >
          Available only
        </Toggle>
      </div>

      <div className="space-y-1 xl:w-80">
        <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
          <span>{currencyFormatter.format(draftPriceRange[0])}</span>
          <span>{currencyFormatter.format(draftPriceRange[1])}</span>
        </div>

        <Slider
          key={priceRange.join('-')}
          value={draftPriceRange}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={25}
          onValueChange={(v) => setDraftPriceRange([v[0] ?? 0, v[1] ?? 0])}
          onValueCommit={commitPrice}
        />
      </div>
    </section>
  );
}
