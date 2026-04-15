import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { verifyGooglePlaySubscription } from './google-play.controller.example.js';

const router = express.Router();

router.post('/mobile/subscription/google/verify', authenticate, verifyGooglePlaySubscription);

export default router;
