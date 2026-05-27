import type { Request, Response } from 'express';
import { DeliveriesService } from './deliveries.service.js';

export class DeliveriesController {
  private service = new DeliveriesService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const data = await this.service.getAll();
    return res.json(data);
  };

  // Specifically handles requests for the Rider Offers Page
  // It catches errors so server doesn't crash if the database is asleep
  getOpenOffers = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.getOpenOffers();
      return res.json(data);
    } catch (error) {
      console.error('Error fetching open offers:', error);
      return res.status(500).json({ message: 'Failed to fetch available deliveries' });
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (typeof id !== 'string') {
      return res.status(400).json({
        message: 'Invalid id',
      });
    }

    const data = await this.service.getById(id);

    if (!data) {
      return res.status(404).json({
        message: 'Not found',
      });
    }

    return res.json(data);
  };
}
