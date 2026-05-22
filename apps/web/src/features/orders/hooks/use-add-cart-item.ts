import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AddCartItemInput } from '@repo/api';
import { addCartItem } from '../api/orders-api';

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddCartItemInput) => addCartItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}