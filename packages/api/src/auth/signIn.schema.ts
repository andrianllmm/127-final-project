import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Invalid password'),
});

export type SignInInput = z.infer<typeof signInSchema>;
