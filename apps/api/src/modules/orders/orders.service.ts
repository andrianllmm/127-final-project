import { AddCartItemInput } from '@repo/api';
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
    const order = await this.repo.findById(id);

    if (!order) {return null;}

    const items = await this.repo.findItemsByOrderId(order.order_id);

    return {...order,items,};
  }

  async getOpenCart(customerId: string) {
    const cart = await this.repo.findOpenCart(customerId);

    if (!cart) {return null;}

    const items = await this.repo.findItemsByOrderId(cart.order_id);

    return {...cart,items,};
  }

  async addCartItem(customerId: string, input: AddCartItemInput) {
    const storeItem = await this.repo.findStoreItemById(input.store_item_id);

    if (!storeItem || storeItem.is_available !== true) {
      throw new Error('Store item is unavailable');
    }

    let cart = await this.repo.findOpenCart(customerId);

    if (!cart) {
      const createdOrder = await this.repo.createOpenOrder(customerId, storeItem.store_id as string);
      cart = await this.repo.findById(createdOrder.order_id as string);
    }

    if (!cart) {
      throw new Error('Failed to create cart');
    }

    if (cart.store_id !== storeItem.store_id) {
      throw new Error('Cart can only contain items from one store');
    }

    await this.repo.addItem(
      cart.order_id,
      input.store_item_id,
      Number(storeItem.price),
      input.quantity,
    );

    return this.getOpenCart(customerId);
  }

  async removeCartItem(customerId: string, orderItemId: string) {
    const cart = await this.repo.findOpenCart(customerId);

    if (!cart) {return null;}

    await this.repo.deleteItem(orderItemId, cart.order_id);

    return this.getOpenCart(customerId);
  }
  
  async checkoutCart(customerId: string, input: { payment_method: string; delivery_address: string }) {
    const cart = await this.repo.findOpenCart(customerId);

    if (!cart) {return null;}

    await this.repo.checkoutCart(cart.order_id, input.payment_method, input.delivery_address);

    return this.repo.findById(cart.order_id);
  }

  async cancelOrder(customerId: string, orderId: string) {
    const result = await this.repo.cancelOrder(orderId, customerId);

    if (!result) {return null;}

    return this.getById(orderId);
  }

}