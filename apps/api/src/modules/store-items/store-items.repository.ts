import { sql } from 'slonik';
import { getPool } from '../../db/pool.js';
import {
  storeItemSchema,
  type CreateStoreItemInput,
  type StoreItem,
  type UpdateStoreItemInput,
} from '@repo/api';

export class StoreItemsRepository {
  async findAll(storeId?: string): Promise<StoreItem[]> {
    const pool = await getPool();

    const rows = storeId
      ? await pool.any(sql.type(storeItemSchema)`
          SELECT
            store_item_id,
            store_id,
            name,
            description,
            price,
            COALESCE(is_available, true) AS is_available,
            image_url,
            created_at
          FROM store_item
          WHERE store_id = ${storeId}
          ORDER BY created_at DESC
        `)
      : await pool.any(sql.type(storeItemSchema)`
          SELECT
            store_item_id,
            store_id,
            name,
            description,
            price,
            COALESCE(is_available, true) AS is_available,
            image_url,
            created_at
          FROM store_item
          ORDER BY created_at DESC
        `);

    return rows as StoreItem[];
  }

  async findById(itemId: string): Promise<StoreItem | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(storeItemSchema)`
      SELECT
        store_item_id,
        store_id,
        name,
        description,
        price,
        COALESCE(is_available, true) AS is_available,
        image_url,
        created_at
      FROM store_item
      WHERE store_item_id = ${itemId}
    `);

    return row as StoreItem | null;
  }

  async create(storeId: string, input: CreateStoreItemInput): Promise<StoreItem> {
    const pool = await getPool();

    const row = await pool.one(sql.type(storeItemSchema)`
      INSERT INTO store_item (
        store_id,
        name,
        description,
        price,
        is_available,
        image_url
      )
      VALUES (
        ${storeId},
        ${input.name},
        ${input.description ?? null},
        ${input.price},
        ${input.is_available ?? true},
        ${input.image_url ?? null}
      )
      RETURNING
        store_item_id,
        store_id,
        name,
        description,
        price,
        COALESCE(is_available, true) AS is_available,
        image_url,
        created_at
    `);

    return row as StoreItem;
  }

  async update(itemId: string, input: UpdateStoreItemInput): Promise<StoreItem | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(storeItemSchema)`
      UPDATE store_item
      SET
        name = COALESCE(${input.name ?? null}, name),
        description = COALESCE(${input.description ?? null}, description),
        price = COALESCE(${input.price ?? null}, price),
        is_available = COALESCE(${input.is_available ?? null}, is_available),
        image_url = COALESCE(${input.image_url ?? null}, image_url)
      WHERE store_item_id = ${itemId}
      RETURNING
        store_item_id,
        store_id,
        name,
        description,
        price,
        COALESCE(is_available, true) AS is_available,
        image_url,
        created_at
    `);

    return row as StoreItem | null;
  }

  async delete(itemId: string): Promise<StoreItem | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(storeItemSchema)`
      DELETE FROM store_item
      WHERE store_item_id = ${itemId}
      RETURNING
        store_item_id,
        store_id,
        name,
        description,
        price,
        COALESCE(is_available, true) AS is_available,
        image_url,
        created_at
    `);

    return row as StoreItem | null;
  }
}
