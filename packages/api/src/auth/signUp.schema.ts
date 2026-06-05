import { z } from 'zod';
import { UserRoleSchema } from '../enums.js';

export const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name is too short'),
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: UserRoleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
