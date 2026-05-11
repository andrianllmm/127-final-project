import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  plugins: [
    inferAdditionalFields({
      user: {
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
    }),
  ],
});
