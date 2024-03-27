import mongoose, { Document, Model } from 'mongoose';
import { userRoles } from './types/role';

const { roles } = userRoles();

interface IUser extends Document {
  id: number;
  name: string;
  mail: string;
  password: string;
  filename?: string;
  role: string;
}

interface IUserModel extends Model<IUser> {
  getUserByEmail(email: string): Promise<IUser>;
  getUserById(id: number): Promise<IUser>;
  getUsers(): Promise<IUser[]>;
}

const schema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    mail: { type: String, required: true, unique: true, trime: true },
    animal: { type: String, required: true, trime: true },
    password: { type: String, required: true, trime: true },
    filename: { type: String, trim: true },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
  },
  { timestamps: true, strict: true }
);

schema.statics.getUserByEmail = async (email: string) => {
  const user = await User.findOne({ mail: email });
  return user;
};

schema.statics.getUserById = async (id: number) => {
  const user = await User.findOne({ id: id });
  return user;
};

schema.statics.getUsers = async () => {
  const users = await User.find();
  return users;
};

const User: IUserModel = mongoose.model<IUser, IUserModel>(
  'User',
  schema,
  'user'
);
export default User;
