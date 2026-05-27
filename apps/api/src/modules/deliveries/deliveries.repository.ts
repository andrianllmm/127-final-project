import { sql } from 'slonik';
import {
  activeDeliverySchema,
  deliveryOfferSchema,
  deliverySummarySchema,
  type ActiveDelivery,
  type DeliveryOffer,
  type DeliveryStatus,
  type DeliverySummary,
} from '@repo/api';
import { getPool } from '../../db/pool.js';

export class DeliveriesRepository {
  async findAll(): Promise<DeliverySummary[]> {
    const pool = await getPool();

    const rows = await pool.any(sql.type(deliverySummarySchema)`
      SELECT
        o.order_id AS id,
        o.customer_id AS "customerId",
        o.store_id AS "storeId",
        o.rider_id AS "riderId",
        s.store_name AS "vendorName",
        s.store_address AS "pickupLocation",
        o.delivery_address AS "dropoffLocation",
        o.status,
        o.payment_method AS "paymentMethod",
        COALESCE(oi_summary.total_price, 0) AS "totalPrice",
        COALESCE(oi_summary.item_count, 0) AS "itemCount",
        o.created_at AS "createdAt",
        o.updated_at AS "updatedAt"
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

  async findOpenOffers(): Promise<DeliveryOffer[]> {
    const pool = await getPool();

    const rows = await pool.any(sql.type(deliveryOfferSchema)`
      SELECT
        o.order_id AS id,
        s.store_name AS "vendorName",
        s.store_address AS "pickupLocation",
        o.delivery_address AS "dropoffLocation",
        COALESCE(oi_summary.total_price, 0) AS "totalPrice",
        COALESCE(oi_summary.item_count, 0) AS "itemCount"
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

  async findById(id: string): Promise<DeliverySummary | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(deliverySummarySchema)`
      SELECT
        o.order_id AS id,
        o.customer_id AS "customerId",
        o.store_id AS "storeId",
        o.rider_id AS "riderId",
        s.store_name AS "vendorName",
        s.store_address AS "pickupLocation",
        o.delivery_address AS "dropoffLocation",
        o.status,
        o.payment_method AS "paymentMethod",
        COALESCE(oi_summary.total_price, 0) AS "totalPrice",
        COALESCE(oi_summary.item_count, 0) AS "itemCount",
        o.created_at AS "createdAt",
        o.updated_at AS "updatedAt"
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

  async updateStatus(id: string, newStatus: DeliveryStatus): Promise<DeliverySummary | null> {
    const pool = await getPool();

    return await pool.maybeOne(sql.type(deliverySummarySchema)`
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
        updated.order_id AS id,
        updated.customer_id AS "customerId",
        updated.store_id AS "storeId",
        updated.rider_id AS "riderId",
        s.store_name AS "vendorName",
        s.store_address AS "pickupLocation",
        updated.delivery_address AS "dropoffLocation",
        updated.status,
        updated.payment_method AS "paymentMethod",
        COALESCE(oi_summary.total_price, 0) AS "totalPrice",
        COALESCE(oi_summary.item_count, 0) AS "itemCount",
        updated.created_at AS "createdAt",
        updated.updated_at AS "updatedAt"
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

  async findActiveDeliveries(): Promise<ActiveDelivery[]> {
    const pool = await getPool();

    const rows = await pool.any(sql.type(activeDeliverySchema)`
      SELECT
        o.order_id AS id,
        s.store_name AS "vendorName",
        o.delivery_address AS "dropoffLocation",
        o.status
      FROM "order" o
      JOIN store s ON o.store_id = s.store_id
      WHERE o.status IN ('accepted', 'picked_up')
      ORDER BY o.created_at DESC
    `);

    return [...rows];
  }
}
