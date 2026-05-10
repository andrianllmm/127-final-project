import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { env } from '../config/env.js';

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.WEB_URL],
});
