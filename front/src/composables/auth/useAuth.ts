import { boolean } from 'yup';
import { useAuthUser } from './useAuthUser';
import type { UserWithoutPassword } from '@/types/user';

type ApiResponse = {
  user?: {
    _id?: string;
    id: number;
    name: string;
    mail: string;
    animal: string;
    filename?: string;
    role: string;
  };
  message?: string;
};

type CheckUuidResponse = {
  userId: string;
  uuid: string;
  expires: number;
  message?: string;
};

export const useAuth = () => {
  const authUser = useAuthUser();
  const setUser = (user: UserWithoutPassword | null) => {
    authUser.value = user;
  };

  const setCookie = (cookie: string | null) => {
    document.cookie = cookie || '';
  };

  const signUp = async (formData: FormData) => {
    try {
      const data = await $fetch<ApiResponse>('/api/auth/register', {
        method: 'POST',
        body: formData,
      });
      console.log('useAuth', data);
      if (data && data.user) {
        setUser(data.user);
      }
      if (data && data.message) {
        return data;
      }
      return authUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const login = async (mail: string, animal: string, password: string) => {
    try {
      const data = await $fetch<ApiResponse>('/api/auth/login', {
        method: 'POST',
        body: {
          mail,
          animal,
          password,
        },
      });

      if (data && data.user) {
        console.log(data.user);
        setUser(data.user);
      }
      if (data && data.message) {
        return data;
      }
      return authUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const data = await $fetch<ApiResponse>('/api/auth/logout', {
        method: 'POST',
      });
      if (data && data.user) {
        setUser(data.user);
        return data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const pwReset = async (mail: string) => {
    try {
      const data = await $fetch('/api/auth/reset', {
        method: 'POST',
        body: {
          mail,
        },
      });

      if (data && data.message) {
        return data;
      }
    } catch (error) {}
  };

  const updatePw = async (userId: string, password: string) => {
    const data = await $fetch<ApiResponse>('/api/auth/pwupdate', {
      method: 'POST',
      body: {
        userId,
        password,
      },
    });

    if (data && data.message) {
      return data;
    }
  };

  const checkUuid = async (urlParams: string) => {
    try {
      const data = await $fetch<CheckUuidResponse>('/api/auth/checkuuid', {
        method: 'POST',
        body: {
          urlParams,
        },
      });

      if ('message' in data) {
        return data;
      }
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getDBUser = async (mail: string) => {
    try {
      const data = await $fetch<ApiResponse>('/api/auth/getdbuser', {
        method: 'POST',
        body: {
          mail,
        },
      });

      if (data && data.message) {
        return data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const infoUpdate = async (formData: FormData) => {
    try {
      const data = await $fetch<ApiResponse>('/api/auth/infoupdate', {
        method: 'POST',
        body: formData,
      });
      if (data && data.user) {
        console.log(data.user);
        setUser(data.user);
      }
      if (data && data.message) {
        console.log(data);
        return data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const cancel = async (mail: string | undefined, deletedFlag: boolean) => {
    try {
      const data = await $fetch<ApiResponse>('/api/auth/cancel', {
        method: 'POST',
        body: {
          mail,
          deletedFlag,
        },
      });

      if (data && data.message) {
        return data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const me = async () => {
    if (!authUser.value) {
      try {
        const data = await $fetch<ApiResponse>('/api/auth/me', {
          headers: useRequestHeaders(['cookie']) as HeadersInit,
        });
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        setCookie(null);
        throw error;
      }
    }
    return authUser;
  };
  return {
    signUp,
    login,
    logout,
    pwReset,
    updatePw,
    checkUuid,
    getDBUser,
    infoUpdate,
    cancel,
    me,
  };
};
