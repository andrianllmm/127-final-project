import { Request, Response } from 'express';
import { UsersService } from './users.service.js';

const service = new UsersService();

export class UsersController {
  async getAll(req: Request, res: Response) {
    const users = await service.getUsers();
    return res.json(users);
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;

    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await service.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  }
}
