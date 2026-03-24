import { Request, Response } from 'express';
import * as stripeService from '../services/stripe.service';
import Booking from '../models/Booking';

export const createIntent = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId).populate('tests');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Amount in cents (PKR actually uses smallest unit too, which is Paisa, though mostly irrelevant now, Stripe expects integers)
        const amount = booking.totalAmount;

        const paymentIntent = await stripeService.createPaymentIntent(amount, 'pkr', {
            bookingId: booking._id.toString(),
            patientId: booking.patient.toString(),
        });

        // Save payment intent ID to booking
        booking.stripePaymentIntentId = paymentIntent.id;
        await booking.save();

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripeService.verifyWebhookSignature(req.body, sig, endpointSecret || '');
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as any;
        const bookingId = paymentIntent.metadata.bookingId;

        if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, {
                paymentStatus: 'paid',
                status: 'confirmed', // Automatically confirm if paid
            });
            console.log(`✅ Payment for booking ${bookingId} succeeded.`);
        }
    }

    res.json({ received: true });
};
