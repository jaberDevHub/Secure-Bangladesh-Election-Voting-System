import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  google_uid: {
    type: String,
    required: true,
    unique: true, // Each user can only vote once per election
    index: true   // Add index for faster checking
  },
  symbol: {
    type: String,
    required: true,
    index: true   // Add index for faster counting
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  election_year: {
    type: Number,
    required: true,
    default: 2026,
  },
  ip_address: {
    type: String,
    required: false // Optional for security
  },
  device_fingerprint: {
    type: String,
    required: false // Optional for extra security
  }
});

// Compound index for efficient queries
voteSchema.index({ google_uid: 1, election_year: 1 });

export default mongoose.model('Vote', voteSchema);