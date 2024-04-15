import type { ApiResponse } from '@/types/apires';

export const useAdmini = () => {
  const getAllUsers = async () => {
    try {
      const { data } = await useFetch<ApiResponse>('/api/admin/users/');
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
