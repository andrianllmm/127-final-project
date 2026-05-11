import { StoreRepository } from './store.repository.js';

export class StoreService {
  private repo: StoreRepository;

  constructor(repo?: StoreRepository) {
    this.repo = repo ?? new StoreRepository();
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }
}
