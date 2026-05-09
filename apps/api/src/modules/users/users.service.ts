import { UsersRepository } from './users.repository.js';
import { CreateUserDTO } from './users.types.js';

export class UsersService {
  constructor(private repo = new UsersRepository()) {}

  getUsers() {
    return this.repo.findAll();
  }

  getUserById(id: number) {
    return this.repo.findById(id);
  }

  async createUser(data: CreateUserDTO) {
    return this.repo.create(data);
  }
}
