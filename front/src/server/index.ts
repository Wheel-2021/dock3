import Redis from 'ioredis';
import mongoose from 'mongoose';
import RedisSession from '@/utils/redis-session';
import type { MyNitroApp } from '@/types/nitro';

const config = useRuntimeConfig();
const username = encodeURIComponent(
  process.env.MONGO_INITDB_ROOT_USERNAME || ''
);
const password = encodeURIComponent(
  process.env.MONGO_INITDB_ROOT_PASSWORD || ''
);

export default async (_nitroApp: MyNitroApp) => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode');
  } else {
    console.log('Debug mode');
  }

  const redis = new Redis(config.sessionRedisUrl);
  const redisSession = new RedisSession({
    client: redis,
    ttl: config.sessionExpires,
  });
  _nitroApp.session = redisSession;

  try {
    await mongoose
      .connect(config.apiSecret.MONGODB_URI, {
        authSource: 'admin',
        user: username,
        pass: password,
      })
      .then(() =>
        console.log(`Connected to database on Worker process: ${process.pid}`)
      )
      .catch((err) => console.error(`Failed to connect to DB: ${err}`));
  } catch (err: any) {
    console.error(
      `Connection error: ${err.stack} on Worker process: ${process.pid}`
    );
    process.exit(1);
  }
};
