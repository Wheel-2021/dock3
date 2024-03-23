import { useAuthUser } from './useAuthUser';
import type { UserWithoutPassword } from '@/types/user';

type ApiResponse = {
  user: {
    id: number;
    name: string;
    mail: string;
    filename?: string;
    role: string;
  };
};

export const useAuth = () => {
  const authUser = useAuthUser();

  const setUser = (user: UserWithoutPassword | null) => {
    authUser.value = user;
  };

  const setCookie = (cookie: string | null) => {
    document.cookie = cookie || '';
  };

  const login = async (
    mail: string,
    password: string,
    role: string,
    rememberMe: boolean,
    filename?: string
  ) => {
    const data = await $fetch<ApiResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        mail,
        password,
        role,
        rememberMe,
        filename,
      },
    });
    setUser(data.user);
    return authUser;
  };

  const logout = async () => {
    const data = await $fetch<ApiResponse>('/api/auth/logout', {
      method: 'POST',
    });
    setUser(data.user);
  };

  const me = async () => {
    if (!authUser.value) {
      try {
        const data = await $fetch<ApiResponse>('/api/auth/me', {
          headers: useRequestHeaders(['cookie']) as HeadersInit,
        });
        setUser(data.user);
      } catch (error) {
        setCookie(null);
      }
    }
    return authUser;
  };
  return {
    login,
    logout,
    me,
  };
};
