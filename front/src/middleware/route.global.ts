import { useAdmin } from '@/composables/auth/useAdmin';

export default defineNuxtRouteMiddleware((to, from) => {
  const isAdmin = useAdmin();

  if ((to.name === 'admin' || !to.path.indexOf('/admin/')) && !isAdmin.value) {
    return navigateTo('/');
  }
});
