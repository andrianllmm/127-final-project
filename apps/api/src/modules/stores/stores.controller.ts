import type { Request, Response } from 'express';
import { StoresService } from './stores.service.js';
import { AuthRequest } from '../../common/middleware/auth.middleware.js';

export class StoresController {
  private service = new StoresService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const data = await this.service.getAll();
    return res.json(data);
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params as { id: string };

    const data = await this.service.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json(data);
  };

  getByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as { userId: string };

    const data = await this.service.getByUserId(userId);
    return res.json(data);
  };

  create = async (req: AuthRequest, res: Response): Promise<Response> => {
    const result = await this.service.create(req.user!.id, req.body);
    return res.status(201).json(result);
  };

  update = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { id } = req.params as { id: string };

    const result = await this.service.update(req.user!.id, id, req.body);

    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json(result);
  };
}
