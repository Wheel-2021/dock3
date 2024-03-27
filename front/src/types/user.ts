export interface User {
  id: number | null;
  name: string;
  mail: string;
  animal: string;
  password: string;
  filename?: string | null;
  role: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
