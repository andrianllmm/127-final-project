import { sql } from 'slonik';
import { getPool } from '../../db/pool.js';

export class DeliveriesRepository {
  async findAll() {
    return [];
  }

  async findOpenOffers() {
    const query = sql.unsafe`
      SELECT 
        o.order_id AS id,
        s.store_name AS "vendorName",
        s.store_address AS "pickupLocation",
        o.delivery_address AS "dropoffLocation",
        (
          SELECT COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) 
          FROM order_item oi 
          WHERE oi.order_id = o.order_id
        ) AS "totalPrice",
        (
          SELECT COALESCE(SUM(oi.quantity), 0) 
          FROM order_item oi 
          WHERE oi.order_id = o.order_id
        ) AS "itemCount"
      FROM "order" o
      JOIN store s ON o.store_id = s.store_id
      WHERE o.status = 'open'
      ORDER BY o.created_at ASC
    `;

    const pool = await getPool();
    return await pool.any(query);
  }

  async findById(id: string) {
    return id;
  }

  async updateStatus(id: string, status: string) {
    const query = sql.unsafe`
    UPDATE "order" 
    SET status = ${status} 
    WHERE order_id = ${id} AND status = 'open'
    RETURNING *
  `;
    const pool = await getPool();
    return await pool.one(query);
  }
}
