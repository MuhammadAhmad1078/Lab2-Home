import { Router } from 'express';
import { getTrafficLicense, getDashboard } from '../controllers/phlebotomist.controller';
import { authenticateToken, authorizeUserType } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and phlebotomist role
router.use(authenticateToken);
router.use(authorizeUserType('phlebotomist'));

// Get dashboard data
router.get('/dashboard', getDashboard);

// Get traffic license file
router.get('/traffic-license', getTrafficLicense);

export default router;

