import { StoresRepository } from '../stores/stores.repository.js';
import { StoreItemsRepository } from './store-items.repository.js';
import type { CreateStoreItemInput, UpdateStoreItemInput } from '@repo/api';

export class StoreItemsService {
  private storeItemsRepo: StoreItemsRepository;

  private storesRepo: StoresRepository;

  constructor(storeItemsRepo?: StoreItemsRepository, storesRepo?: StoresRepository) {
    this.storeItemsRepo = storeItemsRepo ?? new StoreItemsRepository();
    this.storesRepo = storesRepo ?? new StoresRepository();
  }

  private async assertVendorOwnsStore(storeId: string, userId: string) {
    const store = await this.storesRepo.findById(storeId);

    if (!store) {
      return null;
    }

    if (store.user_id !== userId) {
      throw new Error('Forbidden');
    }

    return store;
  }

  async getAll(storeId: string) {
    const store = await this.storesRepo.findById(storeId);

    if (!store) {
      return null;
    }

    return this.storeItemsRepo.findAllByStoreId(storeId);
  }

  async getById(storeId: string, itemId: string) {
    const store = await this.storesRepo.findById(storeId);

    if (!store) {
      return null;
    }

    return this.storeItemsRepo.findById(storeId, itemId);
  }

  async create(userId: string, storeId: string, input: CreateStoreItemInput) {
    const store = await this.assertVendorOwnsStore(storeId, userId);

    if (!store) {
      return null;
    }

    return this.storeItemsRepo.create(storeId, input);
  }

  async update(userId: string, storeId: string, itemId: string, input: UpdateStoreItemInput) {
    const store = await this.assertVendorOwnsStore(storeId, userId);

    if (!store) {
      return null;
    }

    return this.storeItemsRepo.update(storeId, itemId, input);
  }

  async delete(userId: string, storeId: string, itemId: string) {
    const store = await this.assertVendorOwnsStore(storeId, userId);

    if (!store) {
      return null;
    }

    return this.storeItemsRepo.delete(storeId, itemId);
  }
}
