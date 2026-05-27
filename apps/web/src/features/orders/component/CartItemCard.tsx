import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { OrderActionDialog } from '../component/OrderActionDialog';
import { OrderItem } from '@repo/api';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
}

type Props = {
  item: OrderItem;
  isUpdating: boolean;
  isRemoving: boolean;
  onIncrease: (id: string, qty: number) => void;
  onDecrease: (item: OrderItem) => void;
  onRemove: (id: string) => void;
};

export function CartItemCard({
  item,
  isUpdating,
  isRemoving,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <Link
            to={`#`}
            className="font-heading text-lg font-semibold hover:text-primary-foreground"
          >
            {item.name}
          </Link>

          <p className="text-sm text-muted-foreground">
            {formatCurrency(item.price_snapshot)} each
          </p>
        </div>
      </div>

      {/* quantity + subtotal row */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="text-lg font-semibold">{formatCurrency(item.subtotal)}</p>
        </div>

        <div className="flex items-center gap-2">
          {item.quantity === 1 ? (
            <OrderActionDialog
              triggerLabel="-"
              title="Remove item?"
              description={`Remove "${item.name}" from your cart?`}
              confirmLabel="Remove"
              pendingLabel="Removing..."
              isPending={isRemoving}
              onConfirm={() => onRemove(item.order_item_id)}
            />
          ) : (
            <Button
              size="icon"
              variant="outline"
              disabled={isUpdating}
              onClick={() => onDecrease(item)}
            >
              -
            </Button>
          )}

          <span className="w-6 text-center">{item.quantity}</span>

          <Button
            size="icon"
            variant="outline"
            disabled={isUpdating || isRemoving}
            onClick={() => onIncrease(item.order_item_id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
    </Card>
  );
}
