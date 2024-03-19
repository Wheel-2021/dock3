import mongoose from 'mongoose';

export default async () => {
  try {
    console.log('hi');
    const config = useRuntimeConfig();
    mongoose.set('strictQuery', true);
    const client = await mongoose
      .connect(config.apiSecret.MONGODB_URI)
      .then(() => console.log('Successfully connected to DB.'))
      .catch((error) => console.error(`Failed to connect to DB: ${error}`));

    const db = mongoose.connection;
    const col = db.collection('users');
    const data = await col.find({ id: 'test' }).toArray();
    console.log(data);
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: 'Something went wrong.',
    });
  }
};
