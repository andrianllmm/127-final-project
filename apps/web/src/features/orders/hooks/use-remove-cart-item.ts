import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeCartItem } from '../api/orders-api';

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderItemId: string) => removeCartItem(orderItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}