import type { StoreItem } from '@repo/api';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Toggle } from '@/shared/components/ui/toggle';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useUpdateStoreItem } from '../hooks/use-update-store-item';

export type StoreItemCardMode = 'manager' | 'customer' | 'guest';

interface StoreItemCardProps {
  item: StoreItem;
  mode: StoreItemCardMode;
}

const moneyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
});

function useStoreItemActions(item: StoreItem) {
  const navigate = useNavigate();
  const updateItemMutation = useUpdateStoreItem();

  const toggleAvailability = async () => {
    await updateItemMutation.mutateAsync({
      itemId: item.store_item_id,
      input: {
        is_available: !item.is_available,
      },
    });
  };

  const goToEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigate(`/stores/${item.store_id}/items/${item.store_item_id}/edit`);
  };

  const goToDetail = () => {
    navigate(`/stores/${item.store_id}/items/${item.store_item_id}`);
  };

  return {
    toggleAvailability,
    goToEdit,
    goToDetail,
    isUpdating: updateItemMutation.isPending,
  };
}

function ManagerActions({
  item,
  actions,
}: {
  item: StoreItem;
  actions: ReturnType<typeof useStoreItemActions>;
}) {
  return (
    <>
      <Toggle
        size="sm"
        variant="outline"
        pressed={item.is_available}
        onPressedChange={actions.toggleAvailability}
        disabled={actions.isUpdating}
        className="flex-1 gap-2"
      >
        <HugeiconsIcon
          icon={item.is_available ? CheckmarkCircle01Icon : CancelCircleIcon}
          size={16}
        />
        {item.is_available ? 'Available' : 'Unavailable'}
      </Toggle>

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={actions.goToEdit}
        disabled={actions.isUpdating}
        className="flex-1"
      >
        Edit
      </Button>
    </>
  );
}

function CustomerActions() {
  return (
    <Button type="button" size="sm" className="w-full">
      Add to Cart
    </Button>
  );
}

export function StoreItemCard({ item, mode }: StoreItemCardProps) {
  const actions = useStoreItemActions(item);

  const handleNavigate = () => {
    actions.goToDetail();
  };

  const renderActions = () => {
    if (mode === 'manager') {
      return <ManagerActions item={item} actions={actions} />;
    }

    if (mode === 'customer') {
      return <CustomerActions />;
    }

    return null;
  };

  return (
    <Card
      className="h-full cursor-pointer transition hover:bg-muted/50 gap-0 overflow-hidden"
      tabIndex={0}
      role="button"
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigate();
        }
      }}
    >
      <img
        src={item.image_url || `https://placehold.co/600x400?text=${item.name}&font=Poppins`}
        alt={item.name}
        className="aspect-video w-full object-cover"
        loading="lazy"
      />

      <CardHeader className="gap-2 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>

            <CardDescription className="line-clamp-2">
              {item.description || 'No description provided yet.'}
            </CardDescription>
          </div>

          {!item.is_available && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              Unavailable
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 mb-auto">
        <p className="text-primary-foreground font-heading text-xl font-semibold leading-none">
          {moneyFormatter.format(item.price)}
        </p>
      </CardContent>

      {renderActions() && (
        <CardFooter>
          <div className="mt-auto flex w-full gap-2 pt-4" onClick={(e) => e.stopPropagation()}>
            {renderActions()}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
