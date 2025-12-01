import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Test from '../models/Test';
import Lab from '../models/Lab';
import Patient from '../models/Patient';

// ============================================
// CREATE BOOKING (Patient)
// ============================================
export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { patient, lab, test, bookingDate, preferredTimeSlot, collectionType, collectionAddress, notes } = req.body;

        // Validate required fields
        if (!patient || !lab || !test || !bookingDate || !preferredTimeSlot || !collectionType) {
            res.status(400).json({
                success: false,
                message: 'Patient, lab, test, booking date, time slot, and collection type are required',
            });
            return;
        }

        // Validate collection address for home collection
        if (collectionType === 'home' && !collectionAddress) {
            res.status(400).json({
                success: false,
                message: 'Collection address is required for home collection',
            });
            return;
        }

        // Verify test exists
        const testDoc = await Test.findById(test);
        if (!testDoc) {
            res.status(404).json({
                success: false,
                message: 'Test not found',
            });
            return;
        }

        // Verify lab exists and has this test available
        const labDoc = await Lab.findById(lab);
        if (!labDoc) {
            res.status(404).json({
                success: false,
                message: 'Lab not found',
            });
            return;
        }

        // Check if lab has configured tests
        if (!labDoc.hasConfiguredTests || labDoc.availableTests.length === 0) {
            res.status(400).json({
                success: false,
                message: 'This lab has not configured their available tests yet',
            });
            return;
        }

        // Check if lab offers this test
        const hasTest = labDoc.availableTests.some(t => t.toString() === test);
        if (!hasTest) {
            res.status(400).json({
                success: false,
                message: 'This lab does not offer the selected test',
            });
            return;
        }

        // Verify patient exists
        const patientDoc = await Patient.findById(patient);
        if (!patientDoc) {
            res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
            return;
        }

        // Create booking
        const booking = new Booking({
            patient,
            lab,
            test,
            bookingDate: new Date(bookingDate),
            preferredTimeSlot,
            collectionType,
            collectionAddress: collectionType === 'home' ? collectionAddress : undefined,
            totalAmount: testDoc.basePrice,
            notes,
            status: 'pending',
            paymentStatus: 'pending',
        });

        await booking.save();

        // Populate the booking with related data
        await booking.populate([
            { path: 'patient', select: 'fullName email phone address' },
            { path: 'lab', select: 'labName email phone labAddress' },
            { path: 'test', select: 'name description category basePrice reportDeliveryTime' },
        ]);

        // Send notifications to Lab (Email + In-App)
        try {
            const { sendNewBookingEmail } = await import('../services/email.service');
            const { createNotification } = await import('./notification.controller');

            // 1. Send Email to Lab
            if ((booking.lab as any).email) {
                await sendNewBookingEmail(
                    (booking.lab as any).email,
                    (booking.lab as any).labName,
                    (booking.patient as any).fullName,
                    (booking.test as any).name,
                    new Date(booking.bookingDate).toLocaleDateString(),
                    booking.preferredTimeSlot
                );
                console.log(`✅ New booking email sent to lab ${(booking.lab as any).email}`);
            }

            // 2. Create In-App Notification for Lab
            await createNotification({
                user: (booking.lab as any)._id.toString(),
                userType: 'lab',
                type: 'booking_created',
                title: 'New Booking 📅',
                message: `You have a new booking for ${(booking.test as any).name} from ${(booking.patient as any).fullName}.`,
                relatedBooking: booking._id.toString(),
                metadata: {
                    patientName: (booking.patient as any).fullName,
                    testName: (booking.test as any).name,
                    bookingDate: booking.bookingDate,
                    timeSlot: booking.preferredTimeSlot
                }
            });

            console.log(`✅ New booking in-app notification sent to lab ${(booking.lab as any)._id}`);
        } catch (notificationError) {
            console.error('❌ Failed to send lab notifications:', notificationError);
            // Don't fail the request if notification fails
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
        });
    } catch (error: any) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message,
        });
    }
};

// ============================================
// GET PATIENT BOOKINGS
// ============================================
export const getPatientBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { patientId } = req.params;
        const { status } = req.query;

        const query: any = { patient: patientId };
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('lab', 'labName email phone labAddress')
            .populate('test', 'name description category basePrice reportDeliveryTime')
            .populate('phlebotomist', 'fullName phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error: any) {
        console.error('Get patient bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message,
        });
    }
};

// ============================================
// GET LAB BOOKINGS
// ============================================
export const getLabBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { labId } = req.params;
        const { status, date } = req.query;

        const query: any = { lab: labId };
        if (status) {
            query.status = status;
        }
        if (date) {
            const startDate = new Date(date as string);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            query.bookingDate = { $gte: startDate, $lt: endDate };
        }

        const bookings = await Booking.find(query)
            .populate('patient', 'fullName email phone address')
            .populate('test', 'name description category basePrice reportDeliveryTime')
            .populate('phlebotomist', 'fullName phone')
            .sort({ bookingDate: 1, preferredTimeSlot: 1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error: any) {
        console.error('Get lab bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message,
        });
    }
};

// ============================================
// GET BOOKING BY ID
// ============================================
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('patient', 'fullName email phone address')
            .populate('lab', 'labName email phone labAddress')
            .populate('test', 'name description category basePrice reportDeliveryTime preparationInstructions')
            .populate('phlebotomist', 'fullName phone qualification');

        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error: any) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking',
            error: error.message,
        });
    }
};

// ============================================
// UPDATE BOOKING STATUS (Lab)
// ============================================
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, phlebotomist } = req.body;

        if (!status) {
            res.status(400).json({
                success: false,
                message: 'Status is required',
            });
            return;
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
            return;
        }

        // Store old status to check if it changed
        const oldStatus = booking.status;

        booking.status = status;
        if (phlebotomist) {
            booking.phlebotomist = phlebotomist;
        }

        await booking.save();

        await booking.populate([
            { path: 'patient', select: 'fullName email phone' },
            { path: 'lab', select: 'labName email phone' },
            { path: 'test', select: 'name description' },
            { path: 'phlebotomist', select: 'fullName phone' },
        ]);

        // Send notifications if status changed
        if (oldStatus !== status && booking.patient && (booking.patient as any).email) {
            try {
                const { sendBookingStatusUpdateEmail } = await import('../services/email.service');
                const { createNotification } = await import('./notification.controller');

                // Send email notification
                await sendBookingStatusUpdateEmail(
                    (booking.patient as any).email,
                    (booking.patient as any).fullName,
                    (booking.test as any).name,
                    status,
                    new Date(booking.bookingDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    booking.preferredTimeSlot,
                    (booking.lab as any).labName
                );

                console.log(`✅ Status update email sent to ${(booking.patient as any).email}`);

                // Create in-app notification
                const statusMessages: Record<string, { title: string; message: string }> = {
                    confirmed: {
                        title: 'Booking Confirmed ✅',
                        message: `Your ${(booking.test as any).name} test has been confirmed by ${(booking.lab as any).labName}.`
                    },
                    'in-progress': {
                        title: 'Sample Collection In Progress 🔬',
                        message: `Your sample for ${(booking.test as any).name} is being collected.`
                    },
                    completed: {
                        title: 'Test Completed ✨',
                        message: `Your ${(booking.test as any).name} test has been completed! Report will be available soon.`
                    },
                    cancelled: {
                        title: 'Booking Cancelled ❌',
                        message: `Your ${(booking.test as any).name} test booking has been cancelled.`
                    }
                };

                const notificationInfo = statusMessages[status] || {
                    title: 'Status Updated',
                    message: `Your booking status has been updated to: ${status}`
                };

                await createNotification({
                    user: (booking.patient as any)._id.toString(),
                    userType: 'patient',
                    type: 'status_update',
                    title: notificationInfo.title,
                    message: notificationInfo.message,
                    relatedBooking: booking._id.toString(),
                    metadata: {
                        oldStatus,
                        newStatus: status,
                        testName: (booking.test as any).name,
                        labName: (booking.lab as any).labName,
                    }
                });

                console.log(`✅ In-app notification created for patient ${(booking.patient as any)._id}`);
            } catch (notificationError) {
                console.error('❌ Failed to send notifications:', notificationError);
                // Don't fail the request if notification fails
            }
        }

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking,
        });
    } catch (error: any) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: error.message,
        });
    }
};

// ============================================
// CANCEL BOOKING
// ============================================
export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { cancelReason } = req.body;

        const booking = await Booking.findById(id);

        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
            return;
        }

        if (booking.status === 'completed') {
            res.status(400).json({
                success: false,
                message: 'Cannot cancel a completed booking',
            });
            return;
        }

        if (booking.status === 'cancelled') {
            res.status(400).json({
                success: false,
                message: 'Booking is already cancelled',
            });
            return;
        }

        booking.status = 'cancelled';
        booking.cancelReason = cancelReason;

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking,
        });
    } catch (error: any) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error.message,
        });
    }
};

// ============================================
// UPLOAD REPORT (Lab)
// ============================================
export const uploadReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'Report file is required',
            });
            return;
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
            return;
        }

        // Store report in database
        booking.reportData = req.file.buffer;
        booking.reportContentType = req.file.mimetype;

        // Construct report URL (API endpoint)
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const reportUrl = `${backendUrl}/api/bookings/${id}/report`;

        booking.reportUrl = reportUrl;
        booking.reportUploadedAt = new Date();
        // Ensure status is completed
        booking.status = 'completed';

        await booking.save();

        await booking.populate([
            { path: 'patient', select: 'fullName email phone' },
            { path: 'lab', select: 'labName email phone' },
            { path: 'test', select: 'name description' },
        ]);

        // Send notifications
        if (booking.patient && (booking.patient as any).email) {
            try {
                const { sendReportUploadedEmail } = await import('../services/email.service');
                const { createNotification } = await import('./notification.controller');

                // Send email
                await sendReportUploadedEmail(
                    (booking.patient as any).email,
                    (booking.patient as any).fullName,
                    (booking.test as any).name,
                    reportUrl,
                    (booking.lab as any).labName
                );

                // Create in-app notification
                await createNotification({
                    user: (booking.patient as any)._id.toString(),
                    userType: 'patient',
                    type: 'report_uploaded',
                    title: 'Report Ready 📄',
                    message: `Your report for ${(booking.test as any).name} is ready for download.`,
                    relatedBooking: booking._id.toString(),
                    metadata: {
                        reportUrl,
                        testName: (booking.test as any).name,
                        labName: (booking.lab as any).labName,
                    }
                });

                console.log(`✅ Report notifications sent for booking ${booking._id}`);

            } catch (notificationError) {
                console.error('❌ Failed to send report notifications:', notificationError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Report uploaded successfully',
            data: booking,
        });

    } catch (error: any) {
        console.error('Upload report error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload report',
            error: error.message,
        });
    }
};

// ============================================
// GET REPORT (Public/Protected)
// ============================================
export const getReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking || !booking.reportData) {
            res.status(404).json({ success: false, message: 'Report not found' });
            return;
        }

        res.setHeader('Content-Type', booking.reportContentType || 'application/pdf');
        // Use 'inline' to view in browser, 'attachment' to download
        res.setHeader('Content-Disposition', `inline; filename="report-${id}.${booking.reportContentType?.split('/')[1] || 'pdf'}"`);
        res.send(booking.reportData);

    } catch (error: any) {
        console.error('Get report error:', error);
        res.status(500).json({ success: false, message: 'Failed to get report' });
    }
};
