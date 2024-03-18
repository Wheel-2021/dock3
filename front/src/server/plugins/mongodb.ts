import type { Nitro } from 'nitropack';
import mongoose from 'mongoose';

export default async (_nitroApp: Nitro) => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connect to MongoDB');
  } catch (e) {
    console.error(e);
  }
};
