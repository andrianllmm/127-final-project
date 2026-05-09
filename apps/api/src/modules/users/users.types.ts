export type User = {
  id: number;
  email: string;
  createdAt: Date;
};

export type CreateUserDTO = {
  email: string;
};
