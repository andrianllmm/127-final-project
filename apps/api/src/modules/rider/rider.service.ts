import { RiderRepository } from './rider.repository.js';

export class RiderService {
  private repo: RiderRepository;

  constructor(repo?: RiderRepository) {
    this.repo = repo ?? new RiderRepository();
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }
}
