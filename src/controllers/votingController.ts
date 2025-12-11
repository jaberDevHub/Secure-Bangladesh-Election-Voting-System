import { Request, Response } from 'express';
import { checkUserLogin, submitVote, getVotingResults } from '../services/votingService';
import { verifyFirebaseToken } from '../utils/firebaseAuth';

export const login = async (req: Request, res: Response) => {
  try {
    const { google_uid, name, email, photo, device_fingerprint } = req.body;

    // Validate required fields
    if (!google_uid || !name || !email || !device_fingerprint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await checkUserLogin({
      google_uid,
      name,
      email,
      photo,
      device_fingerprint,
    });

    return res.json({ status: result.status });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const vote = async (req: Request, res: Response) => {
  try {
    const { google_uid, symbol } = req.body;

    // Validate required fields
    if (!google_uid || !symbol) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate symbol (basic validation)
    if (typeof symbol !== 'string' || symbol.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid symbol' });
    }

    const result = await submitVote({
      google_uid,
      symbol: symbol.trim(),
    });

    return res.json({ status: result.status });
  } catch (error: any) {
    console.error('Vote error:', error);
    if (error.message === 'already_voted') {
      return res.status(400).json({ error: 'already_voted' });
    }
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getResults = async (req: Request, res: Response) => {
  try {
    const results = await getVotingResults();
    return res.json(results);
  } catch (error: any) {
    console.error('Results error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};