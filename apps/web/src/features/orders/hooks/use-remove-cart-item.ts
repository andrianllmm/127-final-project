import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { removeCartItem } from '../api/orders-api';

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderItemId: string) => removeCartItem(orderItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Item removed from cart.');
    },
    onError: () => {
      toast.error('Failed to remove item from cart.');
    },
  });
}