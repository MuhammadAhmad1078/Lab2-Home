import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

export const createPaymentIntent = async (amount: number, currency: string = 'pkr', metadata: any = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents/paisa
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    } catch (error) {
        console.error('Stripe Error:', error);
        throw error;
    }
};

export const verifyWebhookSignature = (payload: string | Buffer, signature: string, secret: string) => {
    return stripe.webhooks.constructEvent(payload, signature, secret);
};

export default stripe;
