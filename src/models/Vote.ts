import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  symbol: string;
  timestamp: Date;
  election_year: number;
}

const voteSchema = new Schema<IVote>({
  symbol: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  election_year: {
    type: Number,
    required: true,
    default: 2026,
  },
});

export default mongoose.model<IVote>('Vote', voteSchema);