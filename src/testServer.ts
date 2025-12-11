import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration - allow only specific origins
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Rate limiting to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

app.use(limiter);

// Body parser middleware
app.use(bodyParser.json());

// Mock database for testing
const mockUsers: any[] = [];
const mockVotes: any[] = [];

// Mock routes for testing
app.post('/api/login', (req, res) => {
  try {
    const { google_uid, name, email, photo, device_fingerprint } = req.body;

    if (!google_uid || !name || !email || !device_fingerprint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if device already voted
    const deviceAlreadyVoted = mockUsers.some(
      user => user.device_fingerprint === device_fingerprint && user.has_voted
    );

    if (deviceAlreadyVoted) {
      return res.json({ status: 'already_voted_device' });
    }

    // Check if user exists
    const existingUser = mockUsers.find(user => user.google_uid === google_uid);

    if (existingUser) {
      if (existingUser.has_voted) {
        return res.json({ status: 'already_voted' });
      } else {
        return res.json({ status: 'allowed_to_vote' });
      }
    } else {
      // Create new user
      mockUsers.push({
        google_uid,
        name,
        email,
        photo,
        device_fingerprint,
        has_voted: false,
      });
      return res.json({ status: 'allowed_to_vote' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.post('/api/vote', (req, res) => {
  try {
    const { google_uid, symbol } = req.body;

    if (!google_uid || !symbol) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof symbol !== 'string' || symbol.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid symbol' });
    }

    // Find user
    const userIndex = mockUsers.findIndex(user => user.google_uid === google_uid);

    if (userIndex === -1) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (mockUsers[userIndex].has_voted) {
      return res.status(400).json({ error: 'already_voted' });
    }

    // Record vote
    mockVotes.push({
      symbol: symbol.trim(),
      timestamp: new Date(),
      election_year: 2026,
    });

    // Update user
    mockUsers[userIndex].has_voted = true;
    mockUsers[userIndex].voted_at = new Date();

    return res.json({ status: 'vote_recorded' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/api/results', (req, res) => {
  try {
    // Aggregate results
    const resultsMap = new Map<string, number>();

    mockVotes.forEach(vote => {
      const current = resultsMap.get(vote.symbol) || 0;
      resultsMap.set(vote.symbol, current + 1);
    });

    const results = Array.from(resultsMap.entries()).map(([symbol, total]) => ({
      symbol,
      total,
    }));

    // Sort by total descending
    results.sort((a, b) => b.total - a.total);

    return res.json(results);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test Server running on port ${PORT}`);
  console.log(`API endpoints available:`);
  console.log(`- POST /api/login`);
  console.log(`- POST /api/vote`);
  console.log(`- GET /api/results`);
});