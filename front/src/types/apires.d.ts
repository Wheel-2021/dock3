export type ApiResponse = {
  user?: {
    _id?: string;
    id: number;
    name: string;
    mail: string;
    animal: string;
    filename?: string;
    role: string;
    deleted: boolean;
    deletedAt?: string;
  };
  message?: string;
};
