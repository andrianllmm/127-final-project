import { createPool, type DatabasePool } from 'slonik';
import { env } from '../config/env.js';

let pool: DatabasePool | null = null;

export async function getPool() {
  if (!pool) {
    pool = await createPool(env.DATABASE_URL!, {
      maximumPoolSize: 10,
    });
  }
  return pool;
}
