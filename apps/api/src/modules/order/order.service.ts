import { OrderRepository } from './order.repository.js';

export class OrderService {
  private repo: OrderRepository;

  constructor(repo?: OrderRepository) {
    this.repo = repo ?? new OrderRepository();
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }
}
