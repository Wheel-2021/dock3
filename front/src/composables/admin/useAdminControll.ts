import type { ApiResponse } from '@/types/apires';
import type { PwResetResponse } from '@/types/pwreset';
import type { User } from '@/types/user';

export const useAdminControll = () => {
  const getAllUsers = async () => {
    try {
      const data = await $fetch<User[]>('/api/admin/users', {
        method: 'POST',
      });

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deleteUserOne = async (mail: string) => {
    console.log('useAdminControll', mail);
    try {
      const data = await $fetch<ApiResponse>('/api/admin/deleteuser', {
        method: 'POST',
        body: { mail },
      });

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getPwresetUsers = async () => {
    try {
      const data = await $fetch<PwResetResponse>('/api/admin/getpwreset', {
        method: 'POST',
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getDeletedUsers = async () => {
    try {
      const data = await $fetch<ApiResponse>('/api/admin/getdeletedusers', {
        method: 'POST',
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return {
    getAllUsers,
    deleteUserOne,
    getPwresetUsers,
    getDeletedUsers,
  };
};
