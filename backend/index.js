import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import connectDB from './config/database.js';
import votingRoutes from './routes/votingRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration - allow only specific origins
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3000/'],
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

// Connect to MongoDB
connectDB();

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    message: 'Digital Nirbachon 2026 Voting Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      login: 'POST /api/login',
      vote: 'POST /api/vote',
      results: 'GET /api/results',
      userStatus: 'GET /api/user-status'
    },
    docs: 'Visit /api/results to see voting results',
    timestamp: new Date()
  });
});

// Routes
app.use('/api', votingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   GET  /                    - API information`);
  console.log(`   POST /api/login       - Verify Firebase token & get user status`);
  console.log(`   POST /api/vote        - Submit vote (requires Firebase token)`);
  console.log(`   GET  /api/results     - Get voting results (public)`);
  console.log(`   GET  /api/user-status - Check user voting status (requires token)`);
  console.log(`   GET  /health          - Health check`);
  console.log(`\n🔒 Authentication: All /api/* endpoints except /results require Firebase token`);
  console.log(`🗳️  Election Year: 2026`);
  console.log(`💾 MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured - using placeholders'}`);
});