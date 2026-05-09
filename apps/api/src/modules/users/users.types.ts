import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  email: z.email(),
});

export type User = z.infer<typeof userSchema>;

export const userIdParamSchema = z.object({
  id: z.string(),
});

export type UserIdParamDTO = z.infer<typeof userIdParamSchema>;

export const createUserSchema = z.object({
  email: z.email(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
