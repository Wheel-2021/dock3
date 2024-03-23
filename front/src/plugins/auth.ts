import { useAuth } from '@/composables/auth/useAuth';

export default defineNuxtPlugin(async () => {
  const { me } = useAuth();
  await me();
});
