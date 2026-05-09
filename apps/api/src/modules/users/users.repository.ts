import { sql } from 'slonik';
import { pool } from '../../db/pool.js';
import { CreateUserDTO, User } from './users.types.js';

export class UsersRepository {
  async findAll(): Promise<User[]> {
    const rows = await pool.any(sql.unsafe`
    SELECT id, email
    FROM users
    ORDER BY id DESC
  `);

    return rows as User[];
  }

  async findById(id: number): Promise<User | null> {
    const row = await pool.maybeOne(sql.unsafe`
      SELECT id, email
      FROM users
      WHERE id = ${id}
    `);

    return row as User | null;
  }

  async create(data: CreateUserDTO): Promise<User> {
    const row = await pool.one(sql.unsafe`
      INSERT INTO users (email)
      VALUES (${data.email})
      RETURNING id, email
    `);

    return row as User;
  }
}
