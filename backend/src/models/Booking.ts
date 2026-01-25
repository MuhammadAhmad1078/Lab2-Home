import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    patient: mongoose.Types.ObjectId;
    lab: mongoose.Types.ObjectId;
    tests: mongoose.Types.ObjectId[]; // Changed from single test to array of tests
    bookingDate: Date;
    preferredTimeSlot: string;
    collectionType: 'home' | 'lab';
    collectionAddress?: string;
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    totalAmount: number;
    notes?: string;
    phlebotomist?: mongoose.Types.ObjectId;
    cancelReason?: string;
    reportUrl?: string;
    reportData?: Buffer;
    reportContentType?: string;
    reportUploadedAt?: Date;
    stripePaymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: [true, 'Patient reference is required'],
        },
        lab: {
            type: Schema.Types.ObjectId,
            ref: 'Lab',
            required: [true, 'Lab reference is required'],
        },
        tests: [{
            type: Schema.Types.ObjectId,
            ref: 'Test',
            required: true,
        }],
        bookingDate: {
            type: Date,
            required: [true, 'Booking date is required'],
        },
        preferredTimeSlot: {
            type: String,
            required: [true, 'Preferred time slot is required'],
            trim: true,
        },
        collectionType: {
            type: String,
            enum: ['home', 'lab'],
            required: [true, 'Collection type is required'],
            default: 'home',
        },
        collectionAddress: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'refunded'],
            default: 'pending',
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        notes: {
            type: String,
            trim: true,
        },
        phlebotomist: {
            type: Schema.Types.ObjectId,
            ref: 'Phlebotomist',
        },
        cancelReason: {
            type: String,
            trim: true,
        },
        reportUrl: {
            type: String,
            trim: true,
        },
        reportData: {
            type: Buffer,
        },
        reportContentType: {
            type: String,
        },
        reportUploadedAt: {
            type: Date,
        },
        stripePaymentIntentId: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
bookingSchema.index({ patient: 1, createdAt: -1 });
bookingSchema.index({ lab: 1, bookingDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ phlebotomist: 1, bookingDate: 1 });

// Validation: home collection must have address
bookingSchema.pre('save', function (next) {
    if (this.collectionType === 'home' && !this.collectionAddress) {
        next(new Error('Collection address is required for home collection'));
    } else {
        next();
    }
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
