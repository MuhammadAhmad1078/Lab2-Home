import express from 'express';
import {
    createBooking,
    getPatientBookings,
    getLabBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
} from '../controllers/booking.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All booking routes require authentication
router.post('/', protect, createBooking);
router.get('/patient/:patientId', protect, getPatientBookings);
router.get('/lab/:labId', protect, getLabBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, cancelBooking);

export default router;
