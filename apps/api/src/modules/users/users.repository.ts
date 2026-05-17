import { sql } from 'slonik';
import { getPool } from '../../db/pool.js';
import { User, userSchema } from '@repo/api';

export class UsersRepository {
  async findAll(): Promise<User[]> {
    const pool = await getPool();

    const rows = await pool.any(sql.type(userSchema)`
      SELECT
        id,
        name,
        email,
        "emailVerified",
        image,
        "createdAt",
        "updatedAt"
      FROM "user"
      ORDER BY "createdAt" DESC
    `);

    return rows as User[];
  }

  async findById(id: string): Promise<User | null> {
    const pool = await getPool();

    const row = await pool.maybeOne(sql.type(userSchema)`
      SELECT
        id,
        name,
        email,
        "emailVerified",
        image,
        "createdAt",
        "updatedAt"
      FROM "user"
      WHERE id = ${id}
    `);

    return row as User | null;
  }
}
