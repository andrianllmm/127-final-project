import { createPool, type DatabasePool } from 'slonik';
import { env } from '../config/env.js';

export let pool: DatabasePool;

export const initPool = async () => {
  pool = await createPool(env.DATABASE_URL!, {
    maximumPoolSize: 10,
  });
};
