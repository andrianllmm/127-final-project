import { sql } from 'slonik';
import { getPool } from '../../db/pool.js';
import { CreateStoreInput, Store, storeSchema, UpdateStoreInput } from '@repo/api';

export class StoreRepository {
  async findAll(): Promise<Store[]> {
    const pool = await getPool();

    const rows = await pool.any(sql.type(storeSchema)`
      SELECT
        store_id,
        user_id,
        store_name,
        store_address,
        created_at
      FROM store
      ORDER BY created_at DESC
    `);

    return rows as Store[];
  }

  async findById(id: string): Promise<Store | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(storeSchema)`
      SELECT
        store_id,
        user_id,
        store_name,
        store_address,
        created_at
      FROM store
      WHERE store_id = ${id}
    `);

    return row as Store | null;
  }

  async findByUserId(userId: string): Promise<Store[]> {
    const pool = await getPool();

    const rows = await pool.any(sql.type(storeSchema)`
      SELECT
        store_id,
        user_id,
        store_name,
        store_address,
        created_at
      FROM store
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `);

    return rows as Store[];
  }

  async create(userId: string, input: CreateStoreInput): Promise<Store> {
    const pool = await getPool();

    const row = await pool.one(sql.type(storeSchema)`
      INSERT INTO store (
        user_id,
        store_name,
        store_address
      )
      VALUES (
        ${userId},
        ${input.store_name},
        ${input.store_address}
      )
      RETURNING
        store_id,
        user_id,
        store_name,
        store_address,
        created_at
    `);

    return row as Store;
  }

  async update(id: string, input: UpdateStoreInput): Promise<Store | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(storeSchema)`
      UPDATE store
      SET
        store_name = COALESCE(${input.store_name ?? null}, store_name),
        store_address = COALESCE(${input.store_address ?? null}, store_address)
      WHERE store_id = ${id}
      RETURNING
        store_id,
        user_id,
        store_name,
        store_address,
        created_at
    `);

    return row as Store | null;
  }
}
