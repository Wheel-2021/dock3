import type { ApiResponse } from '@/types/apires';

export const useAdmini = () => {
  const getAllUsers = async () => {
    try {
      const data = await $fetch<ApiResponse>('/api/admin/users', {
        method: 'POST',
      });
      console.log('useAdmin', data);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return {
    getAllUsers,
  };
};
