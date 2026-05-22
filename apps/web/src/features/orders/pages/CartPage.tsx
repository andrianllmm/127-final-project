import { Link } from 'react-router-dom';

import { useCart } from '../hooks/use-cart';
import { useRemoveCartItem } from '../hooks/use-remove-cart-item';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
}

export function CartPage() {
  const { data: cart, isPending } = useCart();
  const removeCartItem = useRemoveCartItem();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
        <h1 className="font-heading text-3xl font-semibold">Cart</h1>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div>
              <h2 className="font-heading text-xl font-semibold">Your cart is empty</h2>
              <p className="text-sm text-muted-foreground">
                Add food items from stores to begin your order.
              </p>
            </div>

            <Button asChild>
              <Link to="/stores">Browse Stores</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold">Cart</h1>
        <p className="text-sm text-muted-foreground">{cart.store_name}</p>
      </div>

      <div className="grid gap-4">
        {cart.items.map((item) => (
          <Card key={item.order_item_id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Quantity: {item.quantity}</p>
              <p>Unit Price: {formatCurrency(item.price_snapshot)}</p>
              <p>Total: {formatCurrency(item.subtotal)}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Remove "${item.name}" from your cart?`,
                  );

                  if (confirmed) {
                    removeCartItem.mutate(item.order_item_id);
                  }
                }}
                disabled={removeCartItem.isPending}
              >
                {removeCartItem.isPending ? 'Removing...' : 'Remove'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-6">
          <div>
            <p className="text-sm text-muted-foreground">Order Total</p>
            <p className="text-2xl font-bold">{formatCurrency(cart.total_price)}</p>
          </div>

          <Button disabled>Place Order</Button>
        </CardContent>
      </Card>
    </div>
  );
}