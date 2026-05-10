import { UsersRepository } from './users.repository.js';

export class UsersService {
  constructor(private repo = new UsersRepository()) {}

  getUsers() {
    return this.repo.findAll();
  }

  getUserById(id: string) {
    return this.repo.findById(id);
  }
}
