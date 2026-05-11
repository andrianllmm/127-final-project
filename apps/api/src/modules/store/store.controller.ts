import type { Request, Response } from 'express';
import { StoreService } from './store.service.js';

export class StoreController {
  private service = new StoreService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const data = await this.service.getAll();
    return res.json(data);
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
