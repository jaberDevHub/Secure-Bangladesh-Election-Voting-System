import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  google_uid: string;
  name: string;
  email: string;
  photo?: string;
  device_fingerprint: string;
  has_voted: boolean;
  voted_at?: Date;
  timestamp: Date;
}

const userSchema = new Schema<IUser>({
  google_uid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: false,
  },
  device_fingerprint: {
    type: String,
    required: true,
  },
  has_voted: {
    type: Boolean,
    default: false,
  },
  voted_at: {
    type: Date,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>('User', userSchema);