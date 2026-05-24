import { sql } from 'slonik';
import { z } from 'zod';

import { getPool } from '../../db/pool.js';
import { Order, OrderItem, orderItemSchema, orderSchema } from '@repo/api';

const storeItemLookupSchema = z.object({
  store_item_id: z.string(),
  store_id: z.string(),
  price: z.coerce.number(),
  is_available: z.boolean(),
});

const orderIdSchema = z.object({
  order_id: z.string(),
});

const orderItemIdSchema = z.object({
  order_item_id: z.string(),
});

export class OrdersRepository {
  async findByCustomerId(customerId: string): Promise<Order[]> {
    const pool = await getPool();

    const rows = await pool.any(sql.type(orderSchema)`
      SELECT
        o.order_id,
        o.customer_id,
        o.store_id,
        s.store_name,
        o.rider_id,
        o.status,
        o.payment_method,
        o.delivery_address,
        COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) AS total_price,
        o.created_at,
        o.updated_at
      FROM "order" o
      JOIN store s ON s.store_id = o.store_id
      LEFT JOIN order_item oi ON oi.order_id = o.order_id
      WHERE o.customer_id = ${customerId}
      GROUP BY o.order_id, s.store_name
      ORDER BY o.created_at DESC
    `);

    return rows as Order[];
  }

  async findById(id: string): Promise<Order | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(orderSchema)`
      SELECT
        o.order_id,
        o.customer_id,
        o.store_id,
        s.store_name,
        o.rider_id,
        o.status,
        o.payment_method,
        o.delivery_address,
        COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) AS total_price,
        o.created_at,
        o.updated_at
      FROM "order" o
      JOIN store s ON s.store_id = o.store_id
      LEFT JOIN order_item oi ON oi.order_id = o.order_id
      WHERE o.order_id = ${id}
      GROUP BY o.order_id, s.store_name
    `);

    return row as Order | null;
  }

  async findOpenCart(customerId: string): Promise<Order | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(orderSchema)`
      SELECT
        o.order_id,
        o.customer_id,
        o.store_id,
        s.store_name,
        o.rider_id,
        o.status,
        o.payment_method,
        o.delivery_address,
        COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) AS total_price,
        o.created_at,
        o.updated_at
      FROM "order" o
      JOIN store s ON s.store_id = o.store_id
      LEFT JOIN order_item oi ON oi.order_id = o.order_id
      WHERE o.customer_id = ${customerId}
        AND o.status = 'open'
        AND o.delivery_address = 'To be provided at checkout'
      GROUP BY o.order_id, s.store_name
      ORDER BY o.created_at DESC
      LIMIT 1
    `);

    return row as Order | null;
  }

  async findItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const pool = await getPool();

    const rows = await pool.any(sql.type(orderItemSchema)`
      SELECT
        oi.order_item_id,
        oi.order_id,
        oi.store_item_id,
        si.name,
        oi.price_snapshot,
        oi.quantity,
        oi.price_snapshot * oi.quantity AS subtotal
      FROM order_item oi
      JOIN store_item si ON si.store_item_id = oi.store_item_id
      WHERE oi.order_id = ${orderId}
      ORDER BY si.name ASC
    `);

    return rows as OrderItem[];
  }

  async findStoreItemById(storeItemId: string) {
    const pool = await getPool();

    return pool.maybeOne(sql.type(storeItemLookupSchema)`
      SELECT store_item_id, store_id, price, is_available
      FROM store_item
      WHERE store_item_id = ${storeItemId}
    `);
  }

  async createOpenOrder(customerId: string, storeId: string) {
    const pool = await getPool();

    return pool.one(sql.type(orderIdSchema)`
      INSERT INTO "order" (
        customer_id,
        store_id,
        payment_method,
        delivery_address,
        status
      )
      VALUES (
        ${customerId},
        ${storeId},
        'cash',
        'To be provided at checkout',
        'open'
      )
      RETURNING order_id
    `);
  }

  async addItem(orderId: string, storeItemId: string, priceSnapshot: number, quantity: number) {
    const pool = await getPool();

    const existingItem = await pool.maybeOne(sql.type(orderItemIdSchema)`
      SELECT order_item_id
      FROM order_item
      WHERE order_id = ${orderId}
        AND store_item_id = ${storeItemId}
    `);

    if (existingItem) {
      return pool.one(sql.type(orderItemIdSchema)`
        UPDATE order_item
        SET
          quantity = quantity + ${quantity},
          price_snapshot = ${priceSnapshot}
        WHERE order_id = ${orderId}
          AND store_item_id = ${storeItemId}
        RETURNING order_item_id
      `);
    }

    return pool.one(sql.type(orderItemIdSchema)`
      INSERT INTO order_item (
        order_id,
        store_item_id,
        price_snapshot,
        quantity
      )
      VALUES (
        ${orderId},
        ${storeItemId},
        ${priceSnapshot},
        ${quantity}
      )
      RETURNING order_item_id
    `);
  }

  async deleteItem(orderItemId: string, orderId: string) {
    const pool = await getPool();

    return pool.maybeOne(sql.type(orderItemIdSchema)`
      DELETE FROM order_item
      WHERE order_item_id = ${orderItemId}
        AND order_id = ${orderId}
      RETURNING order_item_id
    `);
  }

  async updateCartItemQuantity(customerId: string, orderItemId: string, quantity: number) {
    const pool = await getPool();

    return pool.maybeOne(sql.type(orderItemSchema)`
      UPDATE order_item oi
      SET quantity = ${quantity}
      FROM "order" o, store_item si
      WHERE oi.order_item_id = ${orderItemId}
        AND oi.order_id = o.order_id
        AND si.store_item_id = oi.store_item_id
        AND o.customer_id = ${customerId}
        AND o.status = 'open'
      RETURNING
        oi.order_item_id,
        oi.order_id,
        oi.store_item_id,
        si.name,
        oi.price_snapshot,
        oi.quantity,
        oi.price_snapshot * oi.quantity AS subtotal
    `);
  }

  async checkoutCart(orderId: string, paymentMethod: string, deliveryAddress: string) {
    const pool = await getPool();

    return pool.one(sql.type(orderIdSchema)`
      UPDATE "order"
      SET
        payment_method = ${paymentMethod},
        delivery_address = ${deliveryAddress},
        updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ${orderId}
        AND status = 'open'
      RETURNING order_id
    `);
  }

  async deleteOpenCart(orderId: string, customerId: string) {
    const pool = await getPool();

    return pool.maybeOne(sql.type(orderIdSchema)`
      DELETE FROM "order"
      WHERE order_id = ${orderId}
        AND customer_id = ${customerId}
        AND status = 'open'
        AND delivery_address = 'To be provided at checkout'
      RETURNING order_id
    `);
  }

  async cancelOrder(orderId: string, customerId: string) {
    const pool = await getPool();

    return pool.maybeOne(sql.type(orderIdSchema)`
      UPDATE "order"
      SET
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ${orderId}
        AND customer_id = ${customerId}
        AND status = 'open'
      RETURNING order_id
    `);
  }
}