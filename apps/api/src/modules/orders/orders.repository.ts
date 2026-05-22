import { sql } from 'slonik';
import { getPool } from '../../db/pool.js';
import { Order, OrderItem, orderItemSchema, orderSchema } from '@repo/api';

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
}
