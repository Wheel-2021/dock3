export interface User {
  _id?: string | null;
  id: number | null;
  name: string;
  mail: string;
  animal: string;
  password: string;
  filename?: string | undefined;
  role: string;
  deleted: boolean;
}

export type UserWithoutPassword = Omit<User, 'password'>;
