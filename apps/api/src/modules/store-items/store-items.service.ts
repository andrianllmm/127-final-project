import { StoresRepository } from '../stores/stores.repository.js';
import { StoreItemsRepository } from './store-items.repository.js';
import type { CreateStoreItemInput, StoreItemsQuery, UpdateStoreItemInput } from '@repo/api';

export class StoreItemsService {
  private storeItemsRepo: StoreItemsRepository;

  private storesRepo: StoresRepository;

  constructor(storeItemsRepo?: StoreItemsRepository, storesRepo?: StoresRepository) {
    this.storeItemsRepo = storeItemsRepo ?? new StoreItemsRepository();
    this.storesRepo = storesRepo ?? new StoresRepository();
  }

  private async assertVendorOwnsStore(storeId: string, userId: string) {
    const store = await this.storesRepo.findById(storeId);

    if (!store || store.user_id !== userId) {
      throw new Error('Forbidden');
    }

    return store;
  }

  async getAll(options: StoreItemsQuery = {}) {
    const { storeId, keyword, sortBy, sortOrder, priceMin, priceMax, available } = options;

    if (storeId) {
      const store = await this.storesRepo.findById(storeId);

      if (!store) {
        return null;
      }
    }

    return this.storeItemsRepo.findAll({
      storeId,
      keyword,
      sortBy,
      sortOrder,
      priceMin,
      priceMax,
      available,
    });
  }

  async getById(itemId: string) {
    return this.storeItemsRepo.findById(itemId);
  }

  async create(userId: string, input: CreateStoreItemInput) {
    const store = await this.storesRepo.findByUserId(userId);
    if (!store) return null;

    return this.storeItemsRepo.create(store.store_id, input);
  }

  async update(userId: string, itemId: string, input: UpdateStoreItemInput) {
    const item = await this.storeItemsRepo.findById(itemId);
    if (!item) return null;
    const store = await this.assertVendorOwnsStore(item?.store_id, userId);
    if (!store) return null;

    return this.storeItemsRepo.update(itemId, input);
  }

  async delete(userId: string, itemId: string) {
    const item = await this.storeItemsRepo.findById(itemId);
    if (!item) return null;
    const store = await this.assertVendorOwnsStore(item.store_id, userId);
    if (!store) return null;

    return this.storeItemsRepo.delete(itemId);
  }
}
