import User from '../models/User';
import Vote from '../models/Vote';
import { IVote } from '../models/Vote';

export const checkUserLogin = async ({
  google_uid,
  name,
  email,
  photo,
  device_fingerprint,
}: {
  google_uid: string;
  name: string;
  email: string;
  photo?: string;
  device_fingerprint: string;
}) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ google_uid });

    // Check if device fingerprint already belongs to a voted user
    const deviceAlreadyVoted = await User.findOne({
      device_fingerprint,
      has_voted: true
    });

    if (deviceAlreadyVoted) {
      return { status: 'already_voted_device' };
    }

    if (existingUser) {
      if (existingUser.has_voted) {
        return { status: 'already_voted' };
      } else {
        // Update user info if needed
        await User.findOneAndUpdate(
          { google_uid },
          { name, email, photo, device_fingerprint },
          { new: true }
        );
        return { status: 'allowed_to_vote' };
      }
    } else {
      // Create new user
      await User.create({
        google_uid: google_uid,
        name: name,
        email: email,
        photo: photo,
        device_fingerprint: device_fingerprint,
        has_voted: false,
      });
      return { status: 'allowed_to_vote' };
    }
  } catch (error) {
    console.error('Error in checkUserLogin:', error);
    throw error;
  }
};

export const submitVote = async ({
  google_uid,
  symbol,
}: {
  google_uid: string;
  symbol: string;
}) => {
  try {
    // Check if user exists and hasn't voted
    const user = await User.findOne({ google_uid });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.has_voted) {
      throw new Error('already_voted');
    }

    // Create anonymous vote
    const vote = await Vote.create({
      symbol,
      election_year: 2026,
    });

    // Update user as voted
    await User.findOneAndUpdate(
      { google_uid },
      {
        has_voted: true,
        voted_at: new Date(),
      },
      { new: true }
    );

    return { status: 'vote_recorded' };
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
};

export const getVotingResults = async () => {
  try {
    const results = await Vote.aggregate([
      {
        $group: {
          _id: '$symbol',
          total: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $project: {
          symbol: '$_id',
          total: 1,
          _id: 0
        }
      }
    ]);

    return results;
  } catch (error) {
    console.error('Error getting voting results:', error);
    throw error;
  }
};