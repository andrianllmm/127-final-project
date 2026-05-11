export type UserRole = 'customer' | 'vendor' | 'rider';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
