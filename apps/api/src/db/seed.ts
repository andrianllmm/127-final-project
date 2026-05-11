/**
 * Runs SQL seed files in order inside a single transaction.
 *
 * Order: alphabetical (001_, 002_, ...)
 * Location: ../../db/seeds
 * Requires: env.DATABASE_URL
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_DIR = path.join(__dirname, '../../db/seeds');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

function getSeedFiles() {
  return fs
    .readdirSync(SEED_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const file of getSeedFiles()) {
      const sql = fs.readFileSync(path.join(SEED_DIR, file), 'utf8');
      console.log(`Running seed: ${file}`);
      await client.query(sql);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed()
  .then(() => console.log('Seeding complete'))
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
