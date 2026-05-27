import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CheckoutCartInput } from '@repo/api';
import { checkoutCart } from '../api/orders-api';

export function useCheckoutCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CheckoutCartInput) => checkoutCart(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}