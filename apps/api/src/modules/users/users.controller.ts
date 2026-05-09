import { Request, Response } from 'express';
import { UsersService } from './users.service.js';

const service = new UsersService();

export class UsersController {
  async getAll(req: Request, res: Response) {
    const users = await service.getUsers();
    res.json(users);
  }

  async getById(req: Request, res: Response) {
    const user = await service.getUserById(Number(req.params.id));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  }

  async create(req: Request, res: Response) {
    const user = await service.createUser(req.body);
    res.status(201).json(user);
  }
}
