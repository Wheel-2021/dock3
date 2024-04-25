import mongoose, { Document, Model } from 'mongoose';
import { userRoles } from './types/role';

const { roles } = userRoles();

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  id: number;
  name: string;
  mail: string;
  password: string;
  filename?: string;
  role: string;
  deleted: boolean;
  deletedAt: Date;
}

interface IUserModel extends Model<IUser> {
  getUserByEmail(email: string): Promise<IUser>;
  getUserById(_id: mongoose.Types.ObjectId): Promise<IUser>;
  getUsers(): Promise<IUser[]>;
  getUsersByDeleted(): Promise<IUser[]>;
}

const schema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
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
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: '',
    },
  },
  { timestamps: true, strict: true }
);

schema.statics.getUserByEmail = async (email: string) => {
  const user = await User.findOne({ mail: email });
  return user;
};

schema.statics.getUserById = async (_id: mongoose.Types.ObjectId) => {
  const user = await User.findOne({ _id: _id });
  return user;
};

schema.statics.getUsers = async () => {
  const users = await User.find();
  return users;
};

schema.statics.getUsersByDeleted = async () => {
  const users = await User.find({ deleted: true });
  return users;
};

const User: IUserModel = mongoose.model<IUser, IUserModel>(
  'User',
  schema,
  'user'
);
export default User;
