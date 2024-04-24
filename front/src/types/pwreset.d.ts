export type PwResetResponse = {
  uuid?: {
    _id: string;
    uuid: string;
    expires: string;
  };
  message?: string;
};
