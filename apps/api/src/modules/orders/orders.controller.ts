import type { Response } from 'express';
import { OrdersService } from './orders.service.js';
import { AuthRequest } from '../../common/middleware/auth.middleware.js';

export class OrdersController {
  private service = new OrdersService();

  getMine = async (req: AuthRequest, res: Response): Promise<Response> => {
    const data = await this.service.getByCustomerId(req.user!.id);
    return res.json(data);
  };

  getCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    const data = await this.service.getDraftCart(req.user!.id);
    return res.json(data);
  };

  getById = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { id } = req.params as { id: string };

    const data = await this.service.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'Not found' });
    }

    if (data.customer_id !== req.user!.id && req.user!.role !== 'rider') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(data);
  };

  addCartItem = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const data = await this.service.addCartItem(req.user!.id, req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Failed to add item to cart',
      });
    }
  };

  removeCartItem = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { orderItemId } = req.params as { orderItemId: string };

    const data = await this.service.removeCartItem(req.user!.id, orderItemId);

    if (!data) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.json(data);
  };

  clearCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    const data = await this.service.clearCart(req.user!.id);

    if (!data) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(204).send();
  };

  updateCartItemQuantity = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { orderItemId } = req.params as { orderItemId: string };
    const { quantity } = req.body as { quantity: number };

    const data = await this.service.updateCartItemQuantity(req.user!.id, orderItemId, quantity);

    if (!data) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    return res.json(data);
  };

  checkoutCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    const data = await this.service.checkoutCart(req.user!.id, req.body);

    if (!data) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.json(data);
  };

  cancelOrder = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { id } = req.params as { id: string };

    const user = req.user!;

    const data = await this.service.cancelOrder(user.id, user.role, id);

    if (!data) {
      return res.status(404).json({
        message: 'Order cannot be cancelled',
      });
    }

    return res.json(data);
  };
}
