import express from 'express';
import { login, vote, getResults } from '../controllers/votingController';

const router = express.Router();

// POST /login - Check user login status
router.post('/login', login);

// POST /vote - Submit a vote
router.post('/vote', vote);

// GET /results - Get voting results
router.get('/results', getResults);

export default router;