import Vote from '../models/Vote.js';
import { verifyFirebaseToken } from '../utils/firebaseAuth.js';
import { isValidSymbol } from '../constants/partySymbols.js';

const ELECTION_YEAR = 2026;

// Verify Firebase token and return user info
export const verifyToken = async (idToken) => {
  try {
    const decodedToken = await verifyFirebaseToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      photo: decodedToken.picture,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
};

// Login route handler - verify Firebase token and return session info
export const handleLogin = async (idToken) => {
  try {
    if (!idToken) {
      throw new Error('No token provided');
    }

    const userInfo = await verifyToken(idToken);
    
    // Check if user already voted
    const existingVote = await Vote.findOne({
      google_uid: userInfo.uid,
      election_year: ELECTION_YEAR
    });

    if (existingVote) {
      return {
        status: 'already_voted',
        message: 'You have already cast your vote',
        user: {
          uid: userInfo.uid,
          name: userInfo.name,
          email: userInfo.email
        }
      };
    }

    return {
      status: 'allowed_to_vote',
      message: 'You can cast your vote',
      user: {
        uid: userInfo.uid,
        name: userInfo.name,
        email: userInfo.email
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Vote route handler - process vote with authentication and validation
export const handleVote = async (idToken, symbol, ipAddress, deviceFingerprint) => {
  try {
    if (!idToken) {
      throw new Error('Authentication required');
    }

    if (!symbol) {
      throw new Error('Party symbol required');
    }

    // Verify Firebase token
    const userInfo = await verifyToken(idToken);
    
    // Validate party symbol
    if (!isValidSymbol(symbol)) {
      throw new Error('Invalid party symbol');
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      google_uid: userInfo.uid,
      election_year: ELECTION_YEAR
    });

    if (existingVote) {
      throw new Error('already_voted');
    }

    // Create new vote document
    const vote = new Vote({
      google_uid: userInfo.uid,
      symbol: symbol,
      election_year: ELECTION_YEAR,
      timestamp: new Date(),
      ip_address: ipAddress,
      device_fingerprint: deviceFingerprint
    });

    await vote.save();

    console.log(`Vote recorded: ${userInfo.uid} voted for ${symbol} at ${new Date()}`);

    return {
      status: 'vote_recorded',
      message: 'Your vote has been recorded successfully',
      timestamp: vote.timestamp
    };
  } catch (error) {
    console.error('Vote error:', error);
    throw error;
  }
};

// Get voting results - aggregated count by party symbol
export const getVotingResults = async () => {
  try {
    const results = await Vote.aggregate([
      {
        $match: {
          election_year: ELECTION_YEAR
        }
      },
      {
        $group: {
          _id: '$symbol',
          total_votes: { $sum: 1 },
          timestamp: { $max: '$timestamp' }
        }
      },
      {
        $sort: { total_votes: -1 }
      },
      {
        $project: {
          symbol: '$_id',
          total_votes: 1,
          timestamp: 1,
          _id: 0
        }
      }
    ]);

    return {
      election_year: ELECTION_YEAR,
      total_votes: results.reduce((sum, party) => sum + party.total_votes, 0),
      results: results,
      last_updated: new Date()
    };
  } catch (error) {
    console.error('Results error:', error);
    throw error;
  }
};

// Check user voting status
export const getUserStatus = async (idToken) => {
  try {
    if (!idToken) {
      throw new Error('Authentication required');
    }

    const userInfo = await verifyToken(idToken);
    
    const existingVote = await Vote.findOne({
      google_uid: userInfo.uid,
      election_year: ELECTION_YEAR
    });

    if (existingVote) {
      return {
        status: 'voted',
        message: 'You have already cast your vote',
        voted_for: existingVote.symbol,
        voted_at: existingVote.timestamp,
        user: {
          uid: userInfo.uid,
          name: userInfo.name,
          email: userInfo.email
        }
      };
    }

    return {
      status: 'not_voted',
      message: 'You have not voted yet',
      user: {
        uid: userInfo.uid,
        name: userInfo.name,
        email: userInfo.email
      }
    };
  } catch (error) {
    console.error('User status error:', error);
    throw error;
  }
};