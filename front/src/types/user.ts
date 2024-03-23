export interface User {
  id: number;
  name: string;
  mail: string;
  password: string;
  filename?: string | null;
  role: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
