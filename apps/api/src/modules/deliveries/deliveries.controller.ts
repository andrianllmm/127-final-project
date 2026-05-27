import type { Request, Response } from 'express';
import { DeliveriesService } from './deliveries.service.js';
import type { UpdateDeliveryStatusInput } from '@repo/api';

export class DeliveriesController {
  private service = new DeliveriesService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const data = await this.service.getAll();
    return res.json(data);
  };

  // Specifically handles requests for the Rider Offers Page
  getOpenOffers = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.getOpenOffers();
      return res.json(data);
    } catch (error) {
      console.error('Failed to fetch open offers:', error);
      return res.status(500).json({ message: 'Internal server error' });
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

  acceptDelivery = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };

      if (!id) return res.status(400).json({ message: 'Delivery ID is required' });

      const result = await this.service.acceptDelivery(id);

      if (!result) return res.status(409).json({ message: 'Delivery already accepted or invalid' });

      return res.json(result);
    } catch (error) {
      console.error('Failed to accept delivery:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getActiveDeliveries = async (_req: Request, res: Response) => {
    try {
      const data = await this.service.getActiveDeliveries();
      return res.json(data);
    } catch (error) {
      console.error('Failed to fetch active deliveries:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  updateStatus = async (
    req: Request<{ id: string }, unknown, UpdateDeliveryStatusInput>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Delivery ID is required' });
      }

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const result = await this.service.updateDeliveryStatus(id, status);

      if (!result) {
        return res.status(404).json({ message: 'Delivery not found' });
      }

      return res.json(result);
    } catch (_error) {
      console.error('Failed to update status:', _error);
      return res.status(500).json({ message: 'Failed to update status' });
    }
  };
}
