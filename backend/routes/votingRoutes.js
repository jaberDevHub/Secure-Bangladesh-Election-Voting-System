import express from 'express';
import { login, vote, getResults, checkUserStatus } from '../controllers/votingController.js';

const router = express.Router();

// POST /login - Verify Firebase token and return user status
router.post('/login', login);

// POST /vote - Submit a vote (requires Firebase token)
router.post('/vote', vote);

// GET /results - Get voting results (public)
router.get('/results', getResults);

// GET /user-status - Check if current user has voted (requires Firebase token)
router.get('/user-status', checkUserStatus);

export default router;