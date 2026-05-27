import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { clearCart } from '../api/orders-api';

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Cart cleared.');
    },
    onError: () => {
      toast.error('Failed to clear cart.');
    },
  });
}