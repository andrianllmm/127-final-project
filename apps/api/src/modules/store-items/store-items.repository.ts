import { sql } from 'slonik';
import { getPool } from '../../db/pool.js';
import {
  storeItemSchema,
  type CreateStoreItemInput,
  type StoreItem,
  type UpdateStoreItemInput,
} from '@repo/api';

interface FindAllStoreItemsOptions {
  storeId?: string | undefined;
  keyword?: string | undefined;
  sortBy?: 'created_at' | 'name' | 'price' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  priceMin?: number | undefined;
  priceMax?: number | undefined;
  available?: boolean | undefined;
}

export class StoreItemsRepository {
  async findAll(options: FindAllStoreItemsOptions = {}): Promise<StoreItem[]> {
    const pool = await getPool();
    const {
      storeId,
      keyword,
      sortBy = 'created_at',
      sortOrder = 'desc',
      priceMin,
      priceMax,
      available,
    } = options;

    const normalizedStoreId = storeId ?? null;
    const normalizedKeyword = keyword?.trim() ? keyword.trim() : null;
    const normalizedPriceMin = typeof priceMin === 'number' ? priceMin : null;
    const normalizedPriceMax = typeof priceMax === 'number' ? priceMax : null;
    const normalizedAvailable = typeof available === 'boolean' ? available : null;
    const sortDirection = sortOrder === 'asc' ? sql.fragment`ASC` : sql.fragment`DESC`;

    const orderByClause =
      sortBy === 'name'
        ? sql.fragment`name ${sortDirection}, created_at DESC`
        : sortBy === 'price'
          ? sql.fragment`price ${sortDirection}, created_at DESC`
          : sql.fragment`created_at ${sortDirection}, name ASC`;

    const rows = await pool.any(sql.type(storeItemSchema)`
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
      WHERE (${normalizedStoreId}::uuid IS NULL OR store_id = ${normalizedStoreId})
        AND (
          ${normalizedKeyword}::text IS NULL
          OR name ILIKE '%' || ${normalizedKeyword} || '%'
          OR COALESCE(description, '') ILIKE '%' || ${normalizedKeyword} || '%'
        )
        AND (${normalizedPriceMin}::numeric IS NULL OR price >= ${normalizedPriceMin})
        AND (${normalizedPriceMax}::numeric IS NULL OR price <= ${normalizedPriceMax})
        AND (${normalizedAvailable}::boolean IS NULL OR is_available = ${normalizedAvailable})
      ORDER BY ${orderByClause}
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
