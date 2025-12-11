import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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

export default mongoose.model('User', userSchema);