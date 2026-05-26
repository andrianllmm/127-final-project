import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { AddCartItemInput } from '@repo/api';
import { addCartItem } from '../api/orders-api';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to add item to cart.';
}

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddCartItemInput) => addCartItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Item added to cart.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}