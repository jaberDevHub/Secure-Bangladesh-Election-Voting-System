import { handleLogin, handleVote, getVotingResults, getUserStatus } from '../services/votingService.js';

// Middleware to extract Firebase token from request headers
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

// Login endpoint - verify Firebase token and return user status
export const login = async (req, res) => {
  try {
    const idToken = extractToken(req);
    
    if (!idToken) {
      return res.status(401).json({ 
        error: 'Authorization token required',
        message: 'Please provide a valid Firebase ID token'
      });
    }

    const result = await handleLogin(idToken);

    return res.json({
      status: result.status,
      message: result.message,
      user: result.user,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Please sign in again with Google'
      });
    }
    
    return res.status(500).json({ 
      error: 'Login failed',
      message: error.message || 'Internal server error'
    });
  }
};

// Vote endpoint - process authenticated vote
export const vote = async (req, res) => {
  try {
    const idToken = extractToken(req);
    const { symbol, device_fingerprint } = req.body;

    if (!idToken) {
      return res.status(401).json({ 
        error: 'Authorization required',
        message: 'Please sign in with Google to vote'
      });
    }

    if (!symbol) {
      return res.status(400).json({ 
        error: 'Party symbol required',
        message: 'Please select a party symbol to vote'
      });
    }

    // Get IP address for logging (optional security measure)
    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await handleVote(idToken, symbol, ipAddress, device_fingerprint);

    return res.json({
      status: result.status,
      message: result.message,
      timestamp: result.timestamp,
      election_year: 2026
    });
  } catch (error) {
    console.error('Vote error:', error);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Please sign in again with Google'
      });
    }
    
    if (error.message === 'Invalid party symbol') {
      return res.status(400).json({ 
        error: 'Invalid symbol',
        message: 'Please select a valid party symbol'
      });
    }
    
    if (error.message === 'already_voted') {
      return res.status(400).json({ 
        error: 'already_voted',
        message: 'You have already cast your vote'
      });
    }
    
    return res.status(500).json({ 
      error: 'Vote failed',
      message: error.message || 'Internal server error'
    });
  }
};

// Results endpoint - return aggregated voting results
export const getResults = async (req, res) => {
  try {
    const results = await getVotingResults();
    
    return res.json({
      success: true,
      data: results,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Results error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch results',
      message: error.message || 'Internal server error'
    });
  }
};

// User status endpoint - check if current user has voted
export const checkUserStatus = async (req, res) => {
  try {
    const idToken = extractToken(req);
    
    if (!idToken) {
      return res.status(401).json({
        error: 'Authorization required',
        message: 'Please sign in with Google to check status'
      });
    }

    const status = await getUserStatus(idToken);

    return res.json({
      success: true,
      data: status,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('User status error:', error);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please sign in again with Google'
      });
    }
    
    return res.status(500).json({
      error: 'Failed to check status',
      message: error.message || 'Internal server error'
    });
  }
};