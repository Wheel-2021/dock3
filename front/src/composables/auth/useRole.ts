import { useAuthUser } from './useAuthUser';



export const useAdmin = () => {
  const authUser = useAuthUser();
  console.log('useRole admin', authUser.value);
  return computed(() => {
    if (!authUser.value) return false;
    return authUser.value.role === 'admin';
  });
};

export const useUser = () => {
  const authUser = useAuthUser();
  console.log('useRole user', authUser.value);
  return computed(() => {
    if (!authUser.value) return false;

    return (
      authUser.value.role === 'user' ||
      authUser.value.role === 'admin'
    );
  });
};
