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

  trustedOrigins: [
    env.WEB_URL,
    ...(env.WEB_URL.startsWith('http://localhost:') || env.WEB_URL.startsWith('https://localhost:')
      ? [`${new URL(env.WEB_URL).protocol}//127.0.0.1:${new URL(env.WEB_URL).port}`]
      : []),
  ],

  user: {
    additionalFields: {
      role: {
        type: ['customer', 'vendor', 'rider'],
        required: true,
        defaultValue: 'customer',
        input: true,
      },
      phone_number: {
        type: 'string',
        required: false,
      },
    },
  },

  advanced: {
    defaultCookieAttributes: {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    },
  },
});
