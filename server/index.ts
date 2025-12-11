import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from '../config/db';
import { submitVote, getVotingResults, getUserVote } from '../services/votingService';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/vote', async (req, res) => {
  try {
    const { google_uid, name, email, photo, device_fingerprint, symbol } = req.body;
    
    if (!google_uid || !name || !email || !device_fingerprint || !symbol) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await submitVote({
      google_uid,
      name,
      email,
      photo,
      device_fingerprint,
      symbol,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const results = await getVotingResults();
    res.json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user-vote/:google_uid', async (req, res) => {
  try {
    const { google_uid } = req.params;
    const vote = await getUserVote(google_uid);
    res.json({ success: true, data: vote });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
