import { useAdmin } from '@/composables/auth/useRole';

export default defineNuxtRouteMiddleware((to, from) => {
  const isAdmin = useAdmin();
  console.log(isAdmin.value);
  if ((to.name === 'admin' || !to.path.indexOf('/admin/')) && !isAdmin.value) {
    return navigateTo('/');
  }
});
