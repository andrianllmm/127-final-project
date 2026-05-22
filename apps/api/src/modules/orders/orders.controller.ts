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
    const data = await this.service.getOpenCart(req.user!.id);
    return res.json(data);
  };

  getById = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { id } = req.params as { id: string };

    const data = await this.service.getById(id);

    if (!data || data.customer_id !== req.user!.id) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json(data);
  };
}