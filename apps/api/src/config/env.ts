import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/miago'),
  WEB_URL: z.string().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);
