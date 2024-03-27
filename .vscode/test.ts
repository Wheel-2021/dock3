import mongoose from "mongoose";

const connection = {
  isConnected: false,
  db: undefined,
};

async function connectDB() {
  if (connection.isConnected) {
    return connection.db;
  }

  const username = encodeURIComponent(
    process.env.MONGO_INITDB_ROOT_USERNAME || ""
  );
  const password = encodeURIComponent(
    process.env.MONGO_INITDB_ROOT_PASSWORD || ""
  );
  const host = process.env.MONGO_HOST;

  let db = undefined;
  console.log("connecting");

  if (process.env.IS_DEV) {
    db = await mongoose.connect(`mongodb://${username}:${password}@${host}/`, {
      authSource: "admin",
      user: username,
      pass: password,
    });
  } else {
    // 本番環境の設定はここに書く
  }

  if (!db) return;

  console.log("connected");
  // connection.isConnected = db.connections[0].readyState;
  // connection.db = db.connections[0].useDb('YOUR_DB_NAME');

  return connection.db;
}

export default connectDB;

// interface ICounter {
//   _id: string;
//   seq: number;
// }
// const CounterSchema: Schema<ICounter> = new mongoose.Schema({
//   _id: { type: String, required: true },
//   seq: { type: Number, default: 0 },
// });
// const counter =
//   mongoose.models.Counter ||
//   mongoose.model<ICounter>('counter', CounterSchema);

// User.schema.pre('save', async function () {
//   console.log('すきーま');
//   const newId = await counter.findByIdAndUpdate(
//     { _id: 'userId' },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   console.log('ima', newId);
//   this.set({ id: newId.seq });
// });
