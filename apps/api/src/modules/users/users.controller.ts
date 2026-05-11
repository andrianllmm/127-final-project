import type { Request, Response } from 'express';
import { UsersService } from './users.service.js';

export class UsersController {
  private service = new UsersService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const users = await this.service.getUsers();
    return res.json(users);
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (typeof id !== 'string' || !id) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await this.service.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  };
}
