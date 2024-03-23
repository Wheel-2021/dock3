import type { NitroApp } from 'nitropack';
import RedisSession from '@/utils/redis-session';

export interface MyNitroApp extends NitroApp {
  session: RedisSession;
}
