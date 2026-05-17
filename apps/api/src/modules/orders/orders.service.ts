import { OrdersRepository } from './orders.repository.js';

export class OrdersService {
  private repo: OrdersRepository;

  constructor(repo?: OrdersRepository) {
    this.repo = repo ?? new OrdersRepository();
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }
}
