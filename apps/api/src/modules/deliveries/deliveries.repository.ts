import { sql } from 'slonik';
import { type DeliveryStatus, type Order, orderSchema } from '@repo/api';
import { getPool } from '../../db/pool.js';

export class DeliveriesRepository {
  async findAll(): Promise<Order[]> {
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
        COALESCE(oi_summary.total_price, 0) AS total_price,
        o.created_at,
        o.updated_at
      FROM "order" o
      JOIN store s ON o.store_id = s.store_id
      LEFT JOIN (
        SELECT
          oi.order_id,
          SUM(oi.price_snapshot * oi.quantity)::numeric(10, 2) AS total_price,
          SUM(oi.quantity)::integer AS item_count
        FROM order_item oi
        GROUP BY oi.order_id
      ) oi_summary ON oi_summary.order_id = o.order_id
      ORDER BY o.created_at DESC
    `);

    return [...rows];
  }

  async findOpenOffers(): Promise<Order[]> {
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
        COALESCE(oi_summary.total_price, 0) AS total_price,
        o.created_at,
        o.updated_at
      FROM "order" o
      JOIN store s ON o.store_id = s.store_id
      LEFT JOIN (
        SELECT
          oi.order_id,
          SUM(oi.price_snapshot * oi.quantity)::numeric(10, 2) AS total_price,
          SUM(oi.quantity)::integer AS item_count
        FROM order_item oi
        GROUP BY oi.order_id
      ) oi_summary ON oi_summary.order_id = o.order_id
      WHERE o.status = 'open'
      ORDER BY o.created_at ASC
    `);

    return [...rows];
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
        COALESCE(oi_summary.total_price, 0) AS total_price,
        o.created_at,
        o.updated_at
      FROM "order" o
      JOIN store s ON o.store_id = s.store_id
      LEFT JOIN (
        SELECT
          oi.order_id,
          SUM(oi.price_snapshot * oi.quantity)::numeric(10, 2) AS total_price,
          SUM(oi.quantity)::integer AS item_count
        FROM order_item oi
        GROUP BY oi.order_id
      ) oi_summary ON oi_summary.order_id = o.order_id
      WHERE o.order_id = ${id}
    `);

    return row ?? null;
  }

  async updateStatus(id: string, newStatus: DeliveryStatus): Promise<Order | null> {
    const pool = await getPool();

    return await pool.maybeOne(sql.type(orderSchema)`
      WITH updated AS (
        UPDATE "order"
        SET status = ${newStatus}
        WHERE order_id = ${id}
        RETURNING
          order_id,
          customer_id,
          store_id,
          rider_id,
          status,
          payment_method,
          delivery_address,
          created_at,
          updated_at
      )
      SELECT
        updated.order_id,
        updated.customer_id,
        updated.store_id,
        s.store_name,
        updated.rider_id,
        updated.status,
        updated.payment_method,
        updated.delivery_address,
        COALESCE(oi_summary.total_price, 0) AS total_price,
        updated.created_at,
        updated.updated_at
      FROM updated
      JOIN store s ON updated.store_id = s.store_id
      LEFT JOIN (
        SELECT
          oi.order_id,
          SUM(oi.price_snapshot * oi.quantity)::numeric(10, 2) AS total_price,
          SUM(oi.quantity)::integer AS item_count
        FROM order_item oi
        GROUP BY oi.order_id
      ) oi_summary ON oi_summary.order_id = updated.order_id
    `);
  }

  async findActiveDeliveries(): Promise<Order[]> {
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
        COALESCE(oi_summary.total_price, 0) AS total_price,
        o.created_at,
        o.updated_at
      FROM "order" o
      JOIN store s ON o.store_id = s.store_id
      LEFT JOIN (
        SELECT
          oi.order_id,
          SUM(oi.price_snapshot * oi.quantity)::numeric(10, 2) AS total_price,
          SUM(oi.quantity)::integer AS item_count
        FROM order_item oi
        GROUP BY oi.order_id
      ) oi_summary ON oi_summary.order_id = o.order_id
      WHERE o.status IN ('accepted', 'picked_up')
      ORDER BY o.created_at DESC
    `);

    return [...rows];
  }
}
