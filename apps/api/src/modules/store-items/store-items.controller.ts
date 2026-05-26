import type { Request, Response } from 'express';
import { StoreItemsService } from './store-items.service.js';
import { AuthRequest } from '../../common/middleware/auth.middleware.js';

type StoreItemsQuery = {
  storeId?: string | undefined;
  keyword?: string | undefined;
  sortBy?: 'created_at' | 'name' | 'price' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  priceMin?: number | undefined;
  priceMax?: number | undefined;
  available?: boolean | undefined;
};

function isForbiddenError(error: unknown) {
  return error instanceof Error && error.message === 'Forbidden';
}

export class StoreItemsController {
  private service = new StoreItemsService();

  getAll = async (req: Request<unknown, unknown, unknown, StoreItemsQuery>, res: Response) => {
    try {
      const data = await this.service.getAll({
        storeId: req.query.storeId,
        keyword: req.query.keyword,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        priceMin: req.query.priceMin,
        priceMax: req.query.priceMax,
        available: req.query.available,
      });

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.json(data);
    } catch (error) {
      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      throw error;
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { itemId } = req.params as { itemId: string };
      const data = await this.service.getById(itemId);

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.json(data);
    } catch (error) {
      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      throw error;
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const result = await this.service.create(req.user!.id, req.body);

      if (!result) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.status(201).json(result);
    } catch (error) {
      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      throw error;
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const { itemId } = req.params as { itemId: string };
      const result = await this.service.update(req.user!.id, itemId, req.body);

      if (!result) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.json(result);
    } catch (error) {
      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      throw error;
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const { itemId } = req.params as { itemId: string };
      const result = await this.service.delete(req.user!.id, itemId);

      if (!result) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.status(204).send();
    } catch (error) {
      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      throw error;
    }
  };
}
