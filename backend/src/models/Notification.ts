import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    userType: 'patient' | 'lab' | 'phlebotomist';
    type: 'status_update' | 'report_uploaded' | 'booking_created' | 'booking_cancelled';
    title: string;
    message: string;
    relatedBooking?: mongoose.Types.ObjectId;
    metadata?: {
        oldStatus?: string;
        newStatus?: string;
        testName?: string;
        labName?: string;
        [key: string]: any;
    };
    isRead: boolean;
    createdAt: Date;
    readAt?: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'userType',
        },
        userType: {
            type: String,
            required: true,
            enum: ['patient', 'lab', 'phlebotomist'],
        },
        type: {
            type: String,
            required: true,
            enum: ['status_update', 'report_uploaded', 'booking_created', 'booking_cancelled'],
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        relatedBooking: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
