import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { env } from '../../config/env.js';

const isProduction = env.NODE_ENV === 'production';

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [env.WEB_URL],

  advanced: {
    defaultCookieAttributes: {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    },
  },
});
