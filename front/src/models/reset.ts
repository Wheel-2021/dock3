import mongoose, { Document, Model } from 'mongoose';

interface IReset {
  userId: string;
  uuid: string;
  expires: number;
}

export interface ResetDocument extends IReset, Document {}

interface ResetModelInterface extends Model<ResetDocument> {
  getExpiresByUuid(uuid: string): Promise<ResetDocument>;
}

const schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    uuid: { type: String, required: true, unique: true },
    expires: { type: Number, required: true },
  },
  { timestamps: true, strict: true }
);

schema.statics.getExpiresByUuid = async (uuid: string) => {
  const expires = await Reset.findOne({ uuid: uuid });
  return expires;
};

const Reset: ResetModelInterface = mongoose.model<
  ResetDocument,
  ResetModelInterface
>('Reset', schema);

export default Reset;
