import express from 'express';
import { createIntent, handleWebhook } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Route to create payment intent - protected
router.post('/create-intent', protect, createIntent);

// Webhook route - needs to be raw body (handled in server.ts)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
