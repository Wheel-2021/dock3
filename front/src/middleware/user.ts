import { useUser } from '@/composables/auth/useRole';

export default defineNuxtRouteMiddleware((to, from) => {
  const isUser = useUser();
  console.log(isUser.value);
  if (
    (to.name === 'dashboard' || !to.path.indexOf('/dashboard/')) &&
    !isUser.value
  ) {
    return navigateTo('/');
  }
});
