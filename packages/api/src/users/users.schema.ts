import { z } from 'zod';
import { UserRoleSchema } from '../enums';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  role: UserRoleSchema,
  image: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;

export const userIdParamSchema = z.object({
  id: z.string(),
});

export type UserIdParamDTO = z.infer<typeof userIdParamSchema>;
