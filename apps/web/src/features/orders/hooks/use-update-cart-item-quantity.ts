import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCartItemQuantity } from '../api/orders-api';

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderItemId,
      quantity,
    }: {
      orderItemId: string;
      quantity: number;
    }) => updateCartItemQuantity(orderItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}