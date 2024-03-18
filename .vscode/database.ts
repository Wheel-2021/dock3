import mongoose from 'mongoose';
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin';

export default defineNitroPlugin(async () => {
  await mongoose.connect(useRuntimeConfig().MONGODB_URI);

  console.log('MongoDB Connected successfully');
});
