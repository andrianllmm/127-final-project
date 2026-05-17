import { DeliveriesRepository as DeliveriesRepository } from './deliveries.repository.js';

export class DeliveriesService {
  private repo: DeliveriesRepository;

  constructor(repo?: DeliveriesRepository) {
    this.repo = repo ?? new DeliveriesRepository();
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }
}
