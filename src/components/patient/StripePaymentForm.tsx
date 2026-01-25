import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface StripePaymentFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    amount: number;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onSuccess, onCancel, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            toast.error(error.message || 'Payment failed');
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success('Payment successful!');
            onSuccess();
        } else {
            toast.error('Payment processing...');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Amount to Pay</span>
                    <span className="text-xl font-bold text-foreground">Rs. {amount}</span>
                </div>
                <PaymentElement />
            </div>

            <div className="flex flex-col gap-3">
                <Button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full h-12 rounded-xl gradient-primary"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            Pay Now
                        </>
                    )}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="w-full"
                >
                    Cancel
                </Button>
            </div>

            <p className="text-center text-[10px] text-muted-foreground">
                Your payment is secured by Stripe. Lab2Home does not store your card details.
            </p>
        </form>
    );
};

export default StripePaymentForm;
