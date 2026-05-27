import { DeliveriesRepository } from './deliveries.repository.js';
import type { DeliveryStatus } from '@repo/api';

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

  async getOpenOffers() {
    return this.repo.findOpenOffers();
  }

  async acceptDelivery(id: string) {
    return this.repo.updateStatus(id, 'accepted');
  }

  async getActiveDeliveries() {
    return this.repo.findActiveDeliveries();
  }

  async updateDeliveryStatus(id: string, status: DeliveryStatus) {
    return this.repo.updateStatus(id, status);
  }
}
