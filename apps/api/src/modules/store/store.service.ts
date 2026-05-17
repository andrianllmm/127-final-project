import { StoreRepository } from './store.repository.js';
import { CreateStoreInput, UpdateStoreInput } from '@repo/api';

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

  async getByUserId(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async create(userId: string, input: CreateStoreInput) {
    return this.repo.create(userId, input);
  }

  async update(userId: string, id: string, input: UpdateStoreInput) {
    const store = await this.repo.findById(id);

    if (!store) {
      return null;
    }

    if (store.user_id !== userId) {
      throw new Error('Forbidden');
    }

    return this.repo.update(id, input);
  }
}
