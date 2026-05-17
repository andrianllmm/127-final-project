import { z } from 'zod';

export const UserRoleSchema = z.enum(['customer', 'vendor', 'rider']);

export const UserRole = UserRoleSchema.enum;
export type UserRole = z.infer<typeof UserRoleSchema>;
