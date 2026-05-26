import type { Request, Response } from 'express';
import { StoreItemsService } from './store-items.service.js';
import { AuthRequest } from '../../common/middleware/auth.middleware.js';

function isForbiddenError(error: unknown) {
  return error instanceof Error && error.message === 'Forbidden';
}

export class StoreItemsController {
  private service = new StoreItemsService();

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { storeId, keyword } = req.query as { storeId?: string; keyword?: string };
      const data = await this.service.getAll(storeId, keyword);

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
