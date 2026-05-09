import { env } from '@/config/env.js';
import { createPool, sql } from 'slonik';

export const pool = createPool(env.DATABASE_URL!, {
  maximumPoolSize: 10,
});

export { sql };
