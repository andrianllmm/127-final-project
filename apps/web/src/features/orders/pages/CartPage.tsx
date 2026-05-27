import { Link } from 'react-router-dom';

import { useCart } from '../hooks/use-cart';
import { useRemoveCartItem } from '../hooks/use-remove-cart-item';
import { useUpdateCartItemQuantity } from '../hooks/use-update-cart-item-quantity';
import { useClearCart } from '../hooks/use-clear-cart';

import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { OrderActionDialog } from '../component/OrderActionDialog';
import { CartItemCard } from '../component/CartItemCard';
import { PlaceOrderForm } from '../component/PlaceOrderForm';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingCartIcon } from '@hugeicons/core-free-icons';

export function CartPage() {
  const { data: cart, isPending } = useCart();
  const removeCartItem = useRemoveCartItem();
  const updateQuantity = useUpdateCartItemQuantity();
  const clearCart = useClearCart();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <div>
          <div className="flex items-center gap-2 text-primary-foreground">
            <HugeiconsIcon icon={ShoppingCartIcon} strokeWidth={3} />
            <h1 className="font-heading text-3xl font-semibold text-primary-foreground">Cart</h1>
          </div>
          <p className="text-sm text-muted-foreground">Review items before placing an order.</p>
        </div>

        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div>
            <h2 className="font-heading text-xl font-semibold">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground">
              Add food items from stores to begin your order.
            </p>
          </div>

          <Button asChild>
            <Link to="/items">Browse</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">Cart</h1>

        <div className="mt-2 flex items-center gap-4">
          <p className="text-muted-foreground mr-auto">
            Ordering from{' '}
            <Link to={`/stores/${cart.store_id}`} className="font-semibold text-primary-foreground">
              {cart.store_name}
            </Link>
          </p>

          <OrderActionDialog
            triggerLabel="Clear Cart"
            title="Clear cart?"
            description="This will remove all items from your cart."
            confirmLabel="Clear Cart"
            pendingLabel="Clearing..."
            isPending={clearCart.isPending}
            onConfirm={() => clearCart.mutate()}
          />
        </div>
      </div>

      <div className="space-y-4 py-6">
        {cart.items.map((item) => (
          <CartItemCard
            key={item.order_item_id}
            item={item}
            isUpdating={updateQuantity.isPending}
            isRemoving={removeCartItem.isPending}
            onIncrease={(id, qty) =>
              updateQuantity.mutate({
                orderItemId: id,
                quantity: qty,
              })
            }
            onDecrease={(item) =>
              updateQuantity.mutate({
                orderItemId: item.order_item_id,
                quantity: item.quantity - 1,
              })
            }
            onRemove={(id) => removeCartItem.mutate(id)}
          />
        ))}
      </div>

      <PlaceOrderForm totalPrice={cart.total_price} disabled={cart.items.length === 0} />
    </div>
  );
}
