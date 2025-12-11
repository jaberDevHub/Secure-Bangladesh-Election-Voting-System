# Backend for Digital Nirbachon 2026

This is the JavaScript backend for the Digital Nirbachon 2026 voting application.

## Structure

```
backend/
├── index.js                 # Main server entry point
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js             # User model
│   └── Vote.js             # Vote model
├── services/
│   └── votingService.js    # Business logic
├── controllers/
│   └── votingController.js # Request handlers
├── routes/
│   └── votingRoutes.js     # API routes
├── utils/
│   └── firebaseAuth.js     # Firebase authentication
├── .env                    # Environment variables
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## Available Scripts

- `npm run backend:dev` - Run with nodemon for development
- `npm run backend:start` - Run with node in production

## API Endpoints

- `POST /api/login` - Check user login status
- `POST /api/vote` - Submit a vote
- `GET /api/results` - Get voting results
- `GET /health` - Health check endpoint

## Environment Variables

Copy `.env` and update the following:

- `MONGODB_URI` - Your MongoDB connection string
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase client email
- `FIREBASE_PRIVATE_KEY` - Firebase private key
- `ALLOWED_ORIGINS` - CORS allowed origins

## Running the Backend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your `.env` file with actual values

3. Run with nodemon:
   ```bash
   npm run backend:dev
   ```

4. Or run with node:
   ```bash
   npm run backend:start
   ```

## Vercel Deployment

The `vercel.json` file is configured for Vercel deployment. Make sure to set environment variables in your Vercel dashboard.

## Features

- Express.js server with security middleware
- MongoDB with Mongoose ODM
- Rate limiting and CORS protection
- Firebase authentication support
- RESTful API design
- Error handling and validation