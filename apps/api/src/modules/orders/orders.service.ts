import { OrdersRepository } from './orders.repository.js';

export class OrdersService {
  private repo: OrdersRepository;

  constructor(repo?: OrdersRepository) {
    this.repo = repo ?? new OrdersRepository();
  }

  async getByCustomerId(customerId: string) {
    return this.repo.findByCustomerId(customerId);
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }

  async getOpenCart(customerId: string) {
    const cart = await this.repo.findOpenCart(customerId);

    if (!cart) {
      return null;
    }

    const items = await this.repo.findItemsByOrderId(cart.order_id);

    return {
      ...cart,
      items,
    };
  }
}