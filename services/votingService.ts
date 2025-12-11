import User from '../models/User';
import { ObjectId } from 'mongodb';

export const submitVote = async ({
  google_uid,
  name,
  email,
  photo,
  device_fingerprint,
  symbol,
}: {
  google_uid: string;
  name: string;
  email: string;
  photo?: string;
  device_fingerprint: string;
  symbol: string;
}) => {
  try {
    // Check if user has already voted
    const existingVote = await User.findOne({ google_uid });
    
    if (existingVote?.has_voted) {
      throw new Error('You have already voted');
    }

    // Update or create user with vote
    const user = await User.findOneAndUpdate(
      { google_uid },
      {
        name,
        email,
        photo,
        device_fingerprint,
        has_voted: true,
        voted_at: new Date(),
        symbol,
      },
      { upsert: true, new: true }
    );

    return user;
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
};

export const getVotingResults = async () => {
  try {
    const results = await User.aggregate([
      { $match: { has_voted: true } },
      { $group: { _id: '$symbol', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    return results;
  } catch (error) {
    console.error('Error getting voting results:', error);
    throw error;
  }
};

export const getUserVote = async (google_uid: string) => {
  try {
    return await User.findOne({ google_uid }, { symbol: 1, voted_at: 1 });
  } catch (error) {
    console.error('Error getting user vote:', error);
    throw error;
  }
};
