import express from 'express';
import {
    getAvailableLabs,
    getLabTests,
    updateLabTests,
    getLabsByTest,
} from '../controllers/lab.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/available', getAvailableLabs);
router.get('/:id/tests', getLabTests);
router.get('/by-test/:testId', getLabsByTest);

// Protected routes (Lab only)
router.put('/:id/tests', protect, updateLabTests);

export default router;
