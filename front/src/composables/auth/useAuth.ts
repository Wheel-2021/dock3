import { useAuthUser } from './useAuthUser';
import type { UserWithoutPassword } from '@/types/user';

type ApiResponse = {
  user?: {
    id: number;
    name: string;
    mail: string;
    animal: string;
    filename?: string;
    role: string;
  };
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

      if (data && data.message) {
        return data;
      }
      if (data && data.user) {
        setUser(data.user);
        return authUser;
      }
    } catch (error) {
      console.log(error);
      throw error; // ここでエラーをスロー
    }
  };

  const login = async (
    mail: string,
    animal: string,
    password: string,
    rememberMe: boolean
  ) => {
    console.log('useAuth1');
    const data = await $fetch<ApiResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        mail,
        animal,
        password,
        rememberMe,
      },
    });
    console.log('useAuth2');
    if (data && data.message) {
      return data;
    }
    if (data && data.user) {
      setUser(data.user);
      return authUser;
    }
  };

  const logout = async () => {
    const data = await $fetch<ApiResponse>('/api/auth/logout', {
      method: 'POST',
    });
    if (data && data.user) {
      setUser(data.user);
      return data;
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
      }
    }
    return authUser;
  };
  return {
    signUp,
    login,
    logout,
    me,
  };
};
