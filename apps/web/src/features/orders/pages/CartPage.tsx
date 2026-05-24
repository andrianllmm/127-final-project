import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../hooks/use-cart';
import { useRemoveCartItem } from '../hooks/use-remove-cart-item';
import { useCheckoutCart } from '../hooks/use-checkout-cart';
import { useUpdateCartItemQuantity } from '../hooks/use-update-cart-item-quantity';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/shared/components/ui/select';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
}

export function CartPage() {
  const { data: cart, isPending } = useCart();
  const removeCartItem = useRemoveCartItem();
  const updateQuantity = useUpdateCartItemQuantity();
  const checkoutCart = useCheckoutCart();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash'>('cash');

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Cart</h1>
          <p className="text-sm text-muted-foreground">Review items before placing an order.</p>
        </div>

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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold">Cart</h1>
        <p className="text-sm text-muted-foreground">Ordering from {cart.store_name}</p>
      </div>

      <Card>
        <CardContent className="space-y-4 py-6">
          {cart.items.map((item) => (
            <div
              key={item.order_item_id}
              className="flex items-center justify-between gap-6 rounded-2xl border p-5"
            >
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-semibold">{item.name}</h3>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Qty: {item.quantity}</p>
                  <p>Unit Price: {formatCurrency(item.price_snapshot)}</p>
                </div>
              </div>

              <div className="space-y-3 text-right">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateQuantity.isPending || removeCartItem.isPending}
                    onClick={() => {
                      if (item.quantity === 1) {
                        const confirmed = window.confirm(`Remove "${item.name}" from your cart?`);

                        if (confirmed) {
                          removeCartItem.mutate(item.order_item_id);
                        }

                        return;
                      }

                      updateQuantity.mutate({
                        orderItemId: item.order_item_id,
                        quantity: item.quantity - 1,
                      });
                    }}
                  >
                    -
                  </Button>

                  <span className="w-8 text-center">{item.quantity}</span>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateQuantity.isPending || removeCartItem.isPending}
                    onClick={() =>
                      updateQuantity.mutate({
                        orderItemId: item.order_item_id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    +
                  </Button>

                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="delivery-address">Delivery Address</Label>
              <Input
                id="delivery-address"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                placeholder="Enter your delivery address"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'cash' | 'gcash')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="gcash">GCash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 border-t pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Order Total</p>
              <p className="text-3xl font-bold">{formatCurrency(cart.total_price)}</p>
            </div>

            <Button
              size="lg"
              disabled={checkoutCart.isPending || cart.items.length === 0}
              onClick={() => {
                if (!deliveryAddress.trim()) {
                  window.alert('Delivery address is required.');
                  return;
                }

                checkoutCart.mutate(
                  {
                    delivery_address: deliveryAddress.trim(),
                    payment_method: paymentMethod,
                  },
                  {
                    onSuccess: () => {
                      const goToOrders = window.confirm(
                        'Order placed successfully. View your orders now?',
                      );

                      if (goToOrders) {
                        navigate('/orders');
                      }
                    },
                    onError: (error) => {
                      console.error(error);
                      window.alert('Failed to place order.');
                    },
                  },
                );
              }}
            >
              {checkoutCart.isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}