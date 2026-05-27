import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCheckoutCart } from '../hooks/use-checkout-cart';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { currencyFormatter } from '@/shared/lib/currencyFormatter';

const schema = z.object({
  delivery_address: z.string().min(1, 'Delivery address is required'),
  payment_method: z.enum(['cash', 'gcash']),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  totalPrice: number;
  disabled?: boolean;
};

export function PlaceOrderForm({ totalPrice, disabled }: Props) {
  const checkoutCart = useCheckoutCart();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      delivery_address: '',
      payment_method: 'cash',
    },
  });

  const paymentMethod = watch('payment_method');

  const onSubmit = (data: FormValues) => {
    checkoutCart.mutate(
      {
        delivery_address: data.delivery_address.trim(),
        payment_method: data.payment_method,
      },
      {
        onSuccess: () => {
          toast.success('Order placed successfully.');
          navigate('/orders');
        },
        onError: (error) => {
          console.error(error);
          toast.error('Failed to place order.');
        },
      },
    );
  };

  return (
    <Card>
      <CardContent className="space-y-6 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Inputs */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="delivery-address">Delivery Address</Label>
              <Input
                id="delivery-address"
                placeholder="Enter your delivery address"
                {...register('delivery_address')}
              />
              {errors.delivery_address && (
                <p className="text-sm text-destructive">{errors.delivery_address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) =>
                  setValue('payment_method', value as FormValues['payment_method'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="gcash">GCash</SelectItem>
                </SelectContent>
              </Select>

              {errors.payment_method && (
                <p className="text-sm text-destructive">{errors.payment_method.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-6 border-t pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Order Total</p>
              <p className="text-3xl font-bold text-primary-foreground">
                {currencyFormatter.format(totalPrice)}
              </p>
            </div>

            <Button type="submit" size="lg" disabled={disabled || checkoutCart.isPending}>
              {checkoutCart.isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
